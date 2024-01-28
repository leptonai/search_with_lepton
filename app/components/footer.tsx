import { FC } from "react";

export const Footer: FC = () => {
  return (
    <div className="text-center flex flex-col items-center text-xs text-zinc-700 gap-1">
      <div className="text-zinc-400">
        OSS perplexity.ai/phind.com implementation
      </div>
      <span>Star me on <a className="underline" target="_blank" href="https://github.com/wsxiaoys/bobtail.dev">Github</a></span>
    </div>
  );
};
