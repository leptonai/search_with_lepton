import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/popover";
import { Skeleton } from "@/app/components/skeleton";
import { Wrapper } from "@/app/components/wrapper";
import { Source } from "@/app/interfaces/source";
import { BookOpenText } from "lucide-react";
import { FC } from "react";
import Markdown from "react-markdown";

function formatMarkdownNewLines(markdown: string) {
  return markdown.split('\\n').join('  \n').replace(/\[(\d+)]/g, '[$1]($1)').split(`"queries":`)[0].replace(/\\u[\dA-F]{4}/gi, (match: any) => {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
  });
}


export const Answer: FC<{ markdown: string; sources: Source[] }> = ({
  markdown,
  sources,
}) => {
  return (
    <Wrapper
      title={
        <>
          <BookOpenText></BookOpenText> Answer
        </>
      }
      content={
        markdown ? (
          <div className="prose prose-sm max-w-full text-zinc-300">
            <Markdown
              components={{
                a: ({ node: _, ...props }) => {
                  if (!props.href) return <></>;
                  const source = sources[+props.href - 1];
                  if (!source) return <></>;
                  return (
                    <span className="inline-block w-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <span
                            title={source.name}
                            className="inline-block cursor-pointer transform scale-[60%] no-underline font-medium bg-zinc-700 hover:bg-zinc-500 w-6 text-center h-6 rounded-full origin-top-left"
                          >
                            {props.href}
                          </span>
                        </PopoverTrigger>
                        <PopoverContent
                          align={"start"}
                          className="max-w-screen-md flex flex-col gap-2 bg-zinc-800 shadow-transparent ring-zinc-600 border-zinc-600 ring-4 text-xs"
                        >
                          <div className="text-zinc-200 text-ellipsis overflow-hidden whitespace-nowrap font-medium">
                            {source.name}
                          </div>
                          <div className="flex gap-4">
                            {source.primaryImageOfPage?.thumbnailUrl && (
                              <div className="flex-none">
                                <img
                                  className="rounded h-16 w-16"
                                  width={source.primaryImageOfPage?.width}
                                  height={source.primaryImageOfPage?.height}
                                  src={source.primaryImageOfPage?.thumbnailUrl}
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="line-clamp-4 text-white break-words">
                                {source.snippet}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 items-center">
                            <div className="flex-1 overflow-hidden">
                              <div className="text-ellipsis text-blue-500 overflow-hidden whitespace-nowrap">
                                <a
                                  title={source.name}
                                  href={source.url}
                                  target="_blank"
                                >
                                  {source.url}
                                </a>
                              </div>
                            </div>
                            <div className="flex-none flex items-center relative">
                              <img
                                className="h-3 w-3"
                                alt={source.url}
                                src={`https://www.google.com/s2/favicons?domain=${source.url}&sz=${16}`}
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </span>
                  );
                },
              }}
            >
              {formatMarkdownNewLines(markdown)}

            </Markdown>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Skeleton className="max-w-sm h-4 bg-zinc-200"></Skeleton>
            <Skeleton className="max-w-lg h-4 bg-zinc-200"></Skeleton>
            <Skeleton className="max-w-2xl h-4 bg-zinc-200"></Skeleton>
            <Skeleton className="max-w-lg h-4 bg-zinc-200"></Skeleton>
            <Skeleton className="max-w-xl h-4 bg-zinc-200"></Skeleton>
          </div>
        )
      }
    ></Wrapper>
  );
};
