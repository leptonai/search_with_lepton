"use client";
import { getSearchUrl } from "@/app/utils/get-search-url";
import { RefreshCcw } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

export const Title = ({ query }: { query: string }) => {
  const router = useRouter();
  return (
    <div className="flex items-center pb-4 mb-6 border-b gap-4">
      <div
        className="flex-1 text-lg sm:text-xl text-black text-ellipsis overflow-hidden whitespace-nowrap"
        title={query}
      >
        {query}
      </div>
    </div>
  );
};
