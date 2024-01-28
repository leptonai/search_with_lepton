import { internal } from "./_generated/api";
import { action, internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSearch = mutation({
    args: {
        query: v.string()
    },
    handler: async (ctx, args) => {
        const searchId = await ctx.db.insert("searches", { query: args.query, content: "", sources: [], relates: [] });
        await ctx.scheduler.runAfter(0, internal.llm.rag, {
            searchId,
            ...args
        })
        return searchId;
    },
});

export const updateContent = internalMutation({
    args: {
        id: v.id("searches"),
        content: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { content: args.content });
    }
})

export const updateSources = internalMutation({
    args: {
        id: v.id("searches"),
        sources: v.array(v.object({
            name: v.string(),
            url: v.string(),
            snippet: v.string(),

        }))
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { sources: args.sources });
    }
})

export const updateRelates = internalMutation({
    args: {
        id: v.id("searches"),
        relates: v.array(v.string())
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { relates: args.relates });
    }
})

export const updateQueryEmbedding = internalMutation({
    args: {
        id: v.id("searches"),
        embedding: v.array(v.float64())
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { query_embedding: args.embedding });
    }
})

export const read = query({
    args: {
        id: v.optional(v.id("searches")),
    },
    handler: async (ctx, args) => {
        if (args.id) {
            return await ctx.db.get(args.id)
        } else {
            return undefined
        }
    }
})

export const getSearchesWithoutQueryEmbeddings = internalQuery({
    args: { count: v.number() },
    handler: async (ctx, args) => {
        return await ctx.db.query("searches").filter(q => q.eq(q.field("query_embedding"), undefined)).take(args.count);
    },
})

export const computeQueryEmbeddingForTenItems = internalAction({
    args: {},
    handler: async (ctx, args) => {
        const searches = await ctx.runQuery(internal.searches.getSearchesWithoutQueryEmbeddings, { count: 10 });
        const actions = searches.map(x => ctx.runAction(internal.llm.computeQueryEmbedding, { searchId: x._id }))
        await Promise.all(actions);
    }
})