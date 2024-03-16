import { Relate } from "@/app/interfaces/relate";
import { Source } from "@/app/interfaces/source";

const SEARCH_START = "<search>";
const SEARCH_END = "</search>";

const LLM_START = "<completion>";
const LLM_END = "</completion>";

const markdownParse = (text: string) => {
    return text
      .replace(/\[\[([cC])itation/g, "[citation")
      .replace(/[cC]itation:(\d+)]]/g, "citation:$1]")
      .replace(/\[\[([cC]itation:\d+)]](?!])/g, `[$1]`)
      .replace(/\[[cC]itation:(\d+)]/g, "[citation]($1)")
      .replace("\n","\\n")
};


export const parseStreaming = async (
  controller: AbortController,
  query: string,
  onSources: (value: string) => void,
  onMarkdown: (value: string) => void,
  onError?: (status: number) => void,
) => {

  const response = await fetch(`/api/query?query=${query}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      Accept: "text/event-stream"
    },
  });

  if (response.status !== 200) {
    onError?.(response.status);
    return;
  }
  if (!response.body) {
    return;
  }

  const reader = response.body.getReader();
  let decoder = new TextDecoder();
  let sink = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    sink += chunk;

    if (sink.includes(SEARCH_END)) {
      let results = sink.split(SEARCH_END)[0].replace(SEARCH_START, "");
      onSources(results)
    }

    if (true) {
      let md = sink.split(LLM_START)[1]
      if (md !== undefined) {
        md = md.replace(LLM_END, "")
        onMarkdown(markdownParse(md));
      }
    }
  }
  let md = sink.split(LLM_START)[1]
  if (md !== undefined) {
    md = md.replace(LLM_END, "")
    onMarkdown(markdownParse(md));
  }

};