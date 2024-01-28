"use client";
import { getSearchUrl } from "@/app/utils/get-search-url";
import { ArrowRight } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";

export const Search: FC = () => {
  const [value, setValue] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value) {
          setValue("");
          router.push(getSearchUrl(encodeURIComponent(value), nanoid()));
        }
      }}
    >
      <label
        className="relative border-zinc-700 bg-zinc-800 flex items-center justify-center border  py-2 px-2 rounded-lg gap-2 focus-within:border-zinc-500 ring-8 ring-zinc-700/20"
        htmlFor="search-bar"
      >
        <input
          id="search-bar"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          placeholder="Ask SciPhi AI anything ..."
          className="px-2 pr-6 w-full rounded-md flex-1 outline-none bg-zinc-800 text-zinc-200"
        />
        <button
          type="submit"
          className="w-auto py-1 px-2 bg-zinc-400 border-black text-black fill-white active:scale-95 border overflow-hidden relative rounded-xl hover:bg-zinc-200"
        >
          <ArrowRight size={16} />
        </button>
      </label>
    </form>
  );
};
