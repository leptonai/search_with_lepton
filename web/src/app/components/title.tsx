"use client";
import { getSearchUrl } from "@/app/utils/get-search-url";
import { RefreshCcw, Power } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

export const Title = ({ query }: { query: string }) => {
  const router = useRouter();
  return (
    //@ts-ignore
    <div className="flex items-center pb-4 mb-6 border-b gap-4">
      <div
        className="flex-1 text-lg sm:text-xl text-zinc-200 text-ellipsis overflow-hidden whitespace-nowrap"
        title={query}
      >
        {query}
      </div>
      <div className="flex-none flex"> {/* Added 'flex' class to make this a flex container */}
        <button
          onClick={() => {
            router.push("https://huggingface.co/SciPhi/Sensei-7B-V1");
            // Different functionality for the second button
          }}
          type="button"
          className="rounded flex gap-2 items-center bg-transparent px-2 py-1 text-xs font-semibold text-blue-500 hover:bg-zinc-900"
        >
          <Power size={12}></Power>Sensei-7B
        </button>

        <button
          onClick={() => {
            router.push(getSearchUrl(encodeURIComponent(query), nanoid()));
          }}
          type="button"
          className="rounded flex gap-2 items-center bg-transparent px-2 py-1 text-xs font-semibold text-blue-500 hover:bg-zinc-900"
        >
          <RefreshCcw size={12}></RefreshCcw>Rewrite
        </button>

      </div>
    </div>
  );
};
