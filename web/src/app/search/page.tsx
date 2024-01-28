"use client";
import { Result } from "@/app/components/result";
import { Search } from "@/app/components/search";
import { Title } from "@/app/components/title";
import { useSearchParams } from "next/navigation";
export default function SearchPage() {
  const searchParams = useSearchParams();
  //@ts-ignore
  const query = decodeURIComponent(searchParams.get("q") || "");
  //@ts-ignore
  const rid = decodeURIComponent(searchParams.get("rid") || "");
  return (
    // <div className="absolute inset-0 bg-[url('/dist/bg.svg')]">
  <div className="absolute inset-0 bg-zinc-900">    
      <div className="mx-auto max-w-3xl absolute inset-4 md:inset-8 bg-zinc-800 rounded-t-2xl rounded-b-2xl">
      {/* <div className="h-20 pointer-events-none rounded-t-2xl w-full backdrop-filter absolute top-0 bg-gradient-to-t from-transparent to-zinc-900 [mask-image:linear-gradient(to_bottom,zinc-800,transparent)]"></div> */}
      <div className="h-20 pointer-events-none rounded-t-2xl w-full backdrop-filter absolute top-0 "></div>
          <div className="px-4 md:px-8 pt-6 pb-24 rounded-2xl ring-8 ring-zinc-700/20 border border-zinc-600 h-full overflow-auto">
              <Title query={query}></Title>
              <Result key={rid} query={query} rid={rid}></Result>
          </div>
          {/* <div className="h-80 pointer-events-none w-full rounded-b-2xl backdrop-filter absolute bottom-0 bg-gradient-to-b from-transparent to-zinc-900 [mask-image:linear-gradient(to_top,zinc-800,transparent)]"></div> */}
          <div className="h-80 pointer-events-none w-full rounded-b-2xl backdrop-filter absolute bottom-0 bg-gradient-to-b from-transparent to-zinc-900 [mask-image:linear-gradient(to_top,zinc-800,transparent)]"></div>
          <div className="absolute z-10 flex items-center justify-center bottom-6 px-4 md:px-8 w-full">
              <div className="w-full">
                  <Search></Search>
              </div>
          </div>
      </div>
    </div>
  );
}
