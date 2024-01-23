import { nanoid } from "nanoid";
import Link from "next/link";
import React, { FC, useMemo } from "react";

export const PresetQuery: FC<{ query: string }> = ({ query }) => {
  const rid = useMemo(() => nanoid(), [query]);

  return (
    <Link
      prefetch={false}
      title={query}
      href={`/search.html?q=${encodeURIComponent(query)}&rid=${rid}`}
      className="border border-zinc-200/50 text-ellipsis overflow-hidden text-nowrap items-center rounded-lg bg-zinc-100 hover:bg-zinc-200/80 hover:text-zinc-950 px-2 py-1 text-xs font-medium text-zinc-600"
    >
      {query}
    </Link>
  );
};
