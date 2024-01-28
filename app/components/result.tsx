"use client";
import { Answer } from "@/app/components/answer";
import { Relates } from "@/app/components/relates";
import { Sources } from "@/app/components/sources";
import { Source } from "@/app/interfaces/source";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction, useMutation, useQuery } from "convex/react";
import { Annoyed } from "lucide-react";
import { FC, useEffect, useState } from "react";

export const Result: FC<{ query: string; rid: string }> = ({ query, rid }) => {
  const [error, setError] = useState<number | null>(null);

  const [searchId, setSearchId] = useState<Id<"searches"> | undefined>(undefined)
  const similarSearch = useAction(api.mongo.similarSearches)
  const search = useMutation(api.searches.createSearch);
  const searchResponse = useQuery(api.searches.read, { id: searchId })

  const markdown = searchResponse?.content || "";
  const sources = (searchResponse?.sources || []) as Source[];
  const relates = searchResponse?.relates.map(x => ({ question: x })) || null;

  useEffect(() => {
    (async () => {
      if (query) {
        const similar = await similarSearch({ query });
        if (similar) {
          setSearchId(similar);
        } else {
          const searchId = await search({ query });
          setSearchId(searchId)
        }
      }
    })()
  }, [query]);
  return (
    <div className="flex gap-12 w-full flex-col md:flex-row">
      <div className="flex flex-col gap-8 md:w-3/4">
        <Answer markdown={markdown} sources={sources}></Answer>
        <Relates relates={relates} />
        {error && (
          <div className="absolute inset-4 flex items-center justify-center bg-white/40 backdrop-blur-sm">
            <div className="p-4 bg-white shadow-2xl rounded text-blue-500 font-medium flex gap-4">
              <Annoyed></Annoyed>
              {error === 429
                ? "Sorry, you have made too many requests recently, try again later."
                : "Sorry, we might be overloaded, try again later."}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1">
        <Sources sources={sources}></Sources>
      </div>
    </div>
  );
};
