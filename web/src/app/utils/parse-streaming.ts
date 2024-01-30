import { Relate } from "@/app/interfaces/relate";
import { Source } from "@/app/interfaces/source";
import { fetchStream } from "@/app/utils/fetch-stream";
import { LocalHistory } from "@/app/interfaces/history";

const LLM_SPLIT = "__LLM_RESPONSE__";
const RELATED_SPLIT = "__RELATED_QUESTIONS__";

export const parseStreaming = async (
  controller: AbortController,
  query: string,
  search_uuid: string,
  onSources: (value: Source[]) => void,
  onMarkdown: (value: string) => void,
  onRelates: (value: Relate[]) => void,
  onFinish: (result: LocalHistory) => void,
  onError?: (status: number) => void,
) => {
  const decoder = new TextDecoder();
  let uint8Array = new Uint8Array();
  let chunks = "";
  let sourcesEmitted = false;
  const response = await fetch(`/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*./*",
    },
    signal: controller.signal,
    body: JSON.stringify({
      query,
      search_uuid,
    }),
  });
  let finalRelates: Relate[] = [];
  let finalMarkdown: string = "";
  let finalSources: Source[] = [];
  if (response.status !== 200) {
    onError?.(response.status);
    return;
  }
  const markdownParse = (text: string) => {
    return text
      .replace(/\[\[([cC])itation/g, "[citation")
      .replace(/[cC]itation:(\d+)]]/g, "citation:$1]")
      .replace(/\[\[([cC]itation:\d+)]](?!])/g, `[$1]`)
      .replace(/\[[cC]itation:(\d+)]/g, "[citation]($1)");
  };
  fetchStream(
    response,
    (chunk) => {
      uint8Array = new Uint8Array([...uint8Array, ...chunk]);
      chunks = decoder.decode(uint8Array, { stream: true });
      if (chunks.includes(LLM_SPLIT)) {
        const [sources, rest] = chunks.split(LLM_SPLIT);
        if (!sourcesEmitted) {
          try {
            finalSources = JSON.parse(sources);
          } catch (e) {
            finalSources = [];
          }
          onSources(finalSources);
        }
        sourcesEmitted = true;
        if (rest.includes(RELATED_SPLIT)) {
          const [md] = rest.split(RELATED_SPLIT);
          finalMarkdown = markdownParse(md);
        } else {
          finalMarkdown = markdownParse(rest);
        }
        onMarkdown(finalMarkdown);
      }
    },
    () => {
      const [_, relates] = chunks.split(RELATED_SPLIT);
      try {
        finalRelates = JSON.parse(relates);
      } catch (e) {
        finalRelates = [];
      }
      onRelates(finalRelates);
      onFinish({
        markdown: finalMarkdown,
        sources: finalSources,
        relates: finalRelates,
        rid: search_uuid,
        query,
        timestamp: new Date().valueOf(),
      });
    },
  );
};
