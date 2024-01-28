"use node"

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import OpenAI from "openai";
import { Serper } from "serper";
import { api, internal } from "./_generated/api";

function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("Add your OPENAI_API_KEY as an env variable");
  }

  const baseURL = process.env.OPENAI_BASE_URL

  return new OpenAI({
    apiKey,
    baseURL,
  });
}

function getOpenAIChatModel() {
  const model = process.env.OPENAI_CHAT_MODEL || "gpt-3.5-turbo"
  return model
}

function getOpenAIEmbeddingModel() {
  const model = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small"
  return model
}

function createSerperClient() {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    throw new Error("Add your SERPER_API_KEY as an env variable");
  }

  return new Serper({
    apiKey,
  });
}

export const relatedQuestion = internalAction({
  args: {
    searchId: v.id("searches")
  },
  handler: async (ctx, args) => {
    const openai = createOpenAIClient();

    const search = await ctx.runQuery(api.searches.read, { id: args.searchId });
    if (!search) {
      throw new Error("Invalid searchId");
    }

    const resp = await openai.chat.completions.create({
      model: getOpenAIChatModel(),
      messages: [
        {
          "role": "system",
          "content": buildMoreQuestionsSystemPrompt(search.sources)
        },
        {
          "role": "user",
          "content": search.query,
        },
      ],
      tools: [{
        type: "function",
        function: {
          name: "ask_related_questions",
          description: "ask further questions that are related to the input and output.",
          parameters: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "related question to the original question and context."
              }
            }
          }
        }
      }],
      max_tokens: 512
    });

    const choice = resp.choices[0];
    const tool_calls = choice.message.tool_calls;
    let relates: string[] = [];
    if (tool_calls) {
      let related = JSON.parse(tool_calls[0]?.function.arguments);
      relates = related.questions.slice(0, 5);
    }

    await ctx.runMutation(internal.searches.updateRelates, {
      id: args.searchId,
      relates,
    })
  }
})

const MORE_QUESTIONS_PROMPT = `
You are a helpful assistant that helps the user to ask related questions, based on user's original question and the related contexts. Please identify worthwhile topics that can be follow-ups, and write questions no longer than 20 words each. Please make sure that specifics, like events, names, locations, are included in follow up questions so they can be asked standalone. For example, if the original question asks about "the Manhattan project", in the follow up question, do not just say "the project", but use the full name "the Manhattan project". Your related questions must be in the same language as the original question.

Here are the contexts of the question:

{context}

Remember, based on the original question and related contexts, suggest three such further questions. Do NOT repeat the original question. Each related question should be no longer than 20 words. Here is the original question:
`;

function buildMoreQuestionsSystemPrompt(context: Array<Source>): string {
  const lines = [];
  for (const [i, x] of context.entries()) {
    lines.push(x.snippet);
  }

  return MORE_QUESTIONS_PROMPT.replace("{context}", lines.join("\n\n"));
}

interface Source {
  name: string
  url: string
  snippet: string
}

export const rag = internalAction({
  args: {
    searchId: v.id("searches"),
    query: v.string()
  },
  handler: async (ctx, args) => {
    const serper = createSerperClient();
    const openai = createOpenAIClient();

    const resp = await serper.search(args.query)
    const sources: Array<Source> = [];
    for (const x of resp.organic.slice(0, 8)) {
      sources.push({
        name: x.title,
        snippet: x.snippet,
        url: x.link
      })
    }

    await ctx.runMutation(internal.searches.updateSources, {
      id: args.searchId,
      sources,
    })

    await ctx.runAction(internal.llm.relatedQuestion, {
      searchId: args.searchId
    });

    const openaiResponse = await openai.chat.completions.create({
      model: getOpenAIChatModel(),
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(sources),
        },
        { "role": "user", "content": args.query },
      ],
      temperature: 0.9,
      stream: true,
      max_tokens: 1024,
    });

    let content = "";
    for await (const part of openaiResponse) {
      if (part.choices[0].delta?.content) {
        content += part.choices[0].delta.content;
        await ctx.runMutation(internal.searches.updateContent, {
          id: args.searchId,
          content: markdownParse(content)
        });
      }
    }
  },
});

function markdownParse(text: string) {
  return text
    .replace(/\[\[([cC])itation/g, "[citation")
    .replace(/[cC]itation:(\d+)]]/g, "citation:$1]")
    .replace(/\[\[([cC]itation:\d+)]](?!])/g, `[$1]`)
    .replace(/\[[cC]itation:(\d+)]/g, "[citation]($1)")
}

const RAG_QUERY_TEXT = `
You are a professional developer AI assistant built by Bobtail.DEV. You are given a user question, and please write clean, concise and accurate answer to the question. You will be given a set of related contexts to the question, each starting with a reference number like [[citation:x]], where x is a number. Please use the context and cite the context at the end of each sentence if applicable.

Your answer must be correct, accurate and written by an expert using an unbiased and professional tone. Please limit to 1024 tokens. Do not give any information that is not related to the question, and do not repeat. Say "information is missing on" followed by the related topic, if the given context do not provide sufficient information.

Please cite the contexts with the reference numbers, in the format [citation:x]. If a sentence comes from multiple contexts, please list all applicable citations, like [citation:3][citation:5]. Other than code and specific names and citations, your answer must be written in the same language as the question.

Here are the set of contexts:

{context}

Remember, don't blindly repeat the contexts verbatim. When possible, give code snippet to demonstrate the answer. And here is the user question:
`

function buildSystemPrompt(context: Array<Source>): string {
  const lines = [];
  for (const [i, x] of context.entries()) {
    lines.push(`[[citation:${i + 1}]] ${x.snippet}`)
  }

  return RAG_QUERY_TEXT.replace("{context}", lines.join("\n\n"));
}

export const computeQueryEmbedding = internalAction({
  args: { searchId: v.id("searches") },
  handler: async (ctx, args) => {
    const search = await ctx.runQuery(api.searches.read, { id: args.searchId });
    if (!search) {
      return;
    }

    const openai = createOpenAIClient();

    const resp = await openai.embeddings.create({
      input: search.query,
      model: getOpenAIEmbeddingModel()
    });

    const embedding = resp.data[0].embedding;
    await ctx.runMutation(internal.searches.updateQueryEmbedding, {
      id: args.searchId,
      embedding,
    })
  },
});

export const similarSearches = action({
  args: {
    query: v.string()
  },
  handler: async (ctx, args) => {
    const openai = createOpenAIClient();
    const resp = await openai.embeddings.create({
      input: args.query,
      model: getOpenAIEmbeddingModel()
    });

    const embedding = resp.data[0].embedding;

    const results = await ctx.vectorSearch("searches", "by_query_embedding", {
      vector: embedding,
      limit: 1,
    });

    return results[0];
  },
});