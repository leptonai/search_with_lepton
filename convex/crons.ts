import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
    "update query embeddings",
    { seconds: 15 }, // every minute
    internal.searches.computeQueryEmbeddingForTenItems
);

export default crons;
