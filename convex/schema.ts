import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  searches: defineTable({
    query: v.string(),
    content: v.string(),
    sources: v.array(v.object({
      name: v.string(),
      url: v.string(),
      snippet: v.string(),
    })),
    relates: v.array(v.string())
  }).index("by_query", ["query"])
});