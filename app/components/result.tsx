"use client";
import { Answer } from "@/app/components/answer";
import { Relates } from "@/app/components/relates";
import { Sources } from "@/app/components/sources";
import { Source } from "@/app/interfaces/source";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Annoyed } from "lucide-react";
import { FC, useEffect, useState } from "react";

export const Result: FC<{ query: string; rid: string }> = ({ query, rid }) => {
  const [error, setError] = useState<number | null>(null);

  const [searchId, setSearchId] = useState<Id<"searches"> | undefined>(undefined)
  const search = useMutation(api.searches.createSearch);
  const searchResponse = useQuery(api.searches.read, { id: searchId })

  const markdown = searchResponse?.content || "";
  const sources = (searchResponse?.sources || []) as Source[];
  const relates = searchResponse?.relates.map(x => ({ question: x })) || null;

  useEffect(() => {
    if (query) {
      search({ query }).then(setSearchId);
    }
  }, [query]);
  return (
    <div className="flex gap-12 w-screen">
      <div className="flex flex-col gap-8 w-3/4">
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
