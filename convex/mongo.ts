"use node"

import { MongoClient, ServerApiVersion } from "mongodb";
import { action, internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const client = new MongoClient(process.env.MONGODB_URI!, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
}
);

export const updateQueryEmbedding = internalAction({
    args: {
        id: v.id("searches"),
        embedding: v.array(v.float64())
    },
    handler: async (ctx, args) => {
        const searches = client.db("agihouse").collection("searches");
        await searches.insertOne({
            searchId: args.id,
            queryEmbedding: args.embedding,
        })
    }
})

export const similarSearches = action({
    args: {
        query: v.string()
    },
    handler: async (ctx, args) => {
        const openApiKey = process.env.TOGETHER_API_KEY
        if (!openApiKey) {
            throw new Error("Add your TOGETHER_API_KEY as an env variable");
        }

        const openai = new OpenAI({
            apiKey: openApiKey,
            baseURL: "https://api.together.xyz/v1",
        });

        const resp = await openai.embeddings.create({
            input: args.query,
            model: "togethercomputer/m2-bert-80M-32k-retrieval"
        });

        const embedding = resp.data[0].embedding;

        const searches = client.db("agihouse").collection("searches");
        const results = await searches.aggregate([
            {
                '$vectorSearch': {
                    "index": "vector_index",
                    "path": "queryEmbedding",
                    "queryVector": embedding,
                    "numCandidates": 50,
                    "limit": 1,
                }
            }
        ])

        const doc = await results.next();
        if (doc) {
            return doc;
        }
    },
});