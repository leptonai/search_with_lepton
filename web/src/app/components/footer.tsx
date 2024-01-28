import { Mails } from "lucide-react";
import { FC } from "react";

export const Footer: FC = () => {
  return (
    <div className="text-center flex flex-col items-center text-xs text-zinc-700 gap-1">
      <div className="flex gap-2 justify-center">
        <div>
          <a
            className="text-blue-500 font-medium inline-flex gap-1 items-center flex-nowrap text-nowrap"
            href="mailto:info@SciPhi.ai"
          >
            <Mails size={8} />
            Talk to us
          </a>
        </div>
        <div>if you need a performant and scalable AI cloud!</div>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 mt-2 text-zinc-400">
        <a className="hover:text-zinc-950" href="https://SciPhi.ai/">
          SciPhi Home
        </a>
        <a
          className="hover:text-zinc-950"
          href="https://dashboard.SciPhi.ai/playground"
        >
          API Playground
        </a>
        <a
          className="hover:text-zinc-950"
          href="https://github.com/leptonai/leptonai"
        >
          Python Library
        </a>
        <a className="hover:text-zinc-950" href="https://twitter.com/leptonai">
          Twitter
        </a>
        <a className="hover:text-zinc-950" href="https://leptonai.medium.com/">
          Blog
        </a>
      </div>
    </div>
  );
};
