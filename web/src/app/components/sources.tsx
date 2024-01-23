import { Skeleton } from "@/app/components/skeleton";
import { Wrapper } from "@/app/components/wrapper";
import { Source } from "@/app/interfaces/source";
import { BookText } from "lucide-react";
import { FC } from "react";

const SourceItem: FC<{ source: Source; index: number }> = ({
  source,
  index,
}) => {
  const { id, name, url } = source;
  const domain = new URL(url).hostname;
  return (
    <div
      className="relative text-xs py-3 px-3 bg-zinc-100 hover:bg-zinc-200 rounded-lg flex flex-col gap-2"
      key={id}
    >
      <a href={url} target="_blank" className="absolute inset-0"></a>
      <div className="font-medium text-zinc-950 text-ellipsis overflow-hidden whitespace-nowrap break-words">
        {name}
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1 overflow-hidden">
          <div className="text-ellipsis whitespace-nowrap break-all text-zinc-400 overflow-hidden w-full">
            {index + 1} - {domain}
          </div>
        </div>
        <div className="flex-none flex items-center">
          <img
            className="h-3 w-3"
            alt={domain}
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${16}`}
          />
        </div>
      </div>
    </div>
  );
};

export const Sources: FC<{ sources: Source[] }> = ({ sources }) => {
  return (
    <Wrapper
      title={
        <>
          <BookText></BookText> Sources
        </>
      }
      content={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {sources.length > 0 ? (
            sources.map((item, index) => (
              <SourceItem
                key={item.id}
                index={index}
                source={item}
              ></SourceItem>
            ))
          ) : (
            <>
              <Skeleton className="max-w-sm h-16 bg-zinc-200/80"></Skeleton>
              <Skeleton className="max-w-sm h-16 bg-zinc-200/80"></Skeleton>
              <Skeleton className="max-w-sm h-16 bg-zinc-200/80"></Skeleton>
              <Skeleton className="max-w-sm h-16 bg-zinc-200/80"></Skeleton>
            </>
          )}
        </div>
      }
    ></Wrapper>
  );
};
