import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSearch = mutation({
    args: {
        query: v.string()
    },
    handler: async (ctx, args) => {
        const search = await ctx.db.query("searches").withIndex("by_query").filter(q => q.eq(q.field("query"), args.query)).first();
        if (search) {
            return search._id
        }

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
        await ctx.db.patch(args.id, { relates: args.relates});
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