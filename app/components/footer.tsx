import { FC } from "react";

export const Footer: FC = () => {
  return (
    <div className="text-center flex flex-col items-center text-xs text-zinc-700 gap-1">
      <div className="text-zinc-400">
        Poor-man's oss perplexity.ai/phind.com implementation
      </div>
      <a target="_blank" href="https://github.com/wsxiaoys/bobtail.dev">Fork me on Github</a>
    </div>
  );
};
