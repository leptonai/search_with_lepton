import { Skeleton } from "@/app/components/skeleton";
import { Wrapper } from "@/app/components/wrapper";
import { Source } from "@/app/interfaces/source";
import { BookText } from "lucide-react";
import { FC } from "react";

const SourceItem: FC<{ source: Source; index: number }> = ({
  source,
  index,
}) => {
  const { title, link } = source;
  if (link === null || link === "" || link === undefined){
    return null;
  }

  return (
    <div
      className="relative text-xs py-3 px-3 bg-zinc-400 hover:bg-zinc-300 rounded-lg flex flex-col gap-2"
      key={title}
    >
      <a href={link} target="_blank" className="absolute inset-0"></a>
      <div className="font-medium text-zinc-950 text-ellipsis overflow-hidden whitespace-nowrap break-words">
        {title}
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1 overflow-hidden">
          <div className="text-ellipsis whitespace-nowrap break-all text-zinc-600 overflow-hidden w-full">
            {index + 1} - {link}
          </div>
        </div>
        <div className="flex-none flex items-center">
          <img
            className="h-3 w-3"
            alt={link}
            src={`https://www.google.com/s2/favicons?domain=${link}&sz=${16}`}
          />
        </div>
      </div>
    </div>
  );
};

export const Sources: FC<{ sources: String }> = ({ sources }) => {
  let parsedSources:Source[]   = typeof sources === 'string' ? JSON.parse(sources) : sources;
  return (
    <Wrapper
      title={
        <>
          <BookText></BookText> Sources
        </>
      }
      content={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {parsedSources && parsedSources.length > 0 ? (
            parsedSources.map((item, index) => (
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
