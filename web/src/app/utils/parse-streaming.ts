import { Relate } from "@/app/interfaces/relate";
import { Source } from "@/app/interfaces/source";

const LLM_SPLIT = "__LLM_RESPONSE__"; // Assuming this delimiter is still used
const RELATED_SPLIT = "__RELATED_QUESTIONS__"; // Assuming this delimiter is still used

const markdownParse = (text: string) => {
    return text
      .replace(/\[\[([cC])itation/g, "[citation")
      .replace(/[cC]itation:(\d+)]]/g, "citation:$1]")
      .replace(/\[\[([cC]itation:\d+)]](?!])/g, `[$1]`)
      .replace(/\[[cC]itation:(\d+)]/g, "[citation]($1)")
      .replace("\n","\\n")
};


export const parseStreaming = async (
  controller: AbortController,
  query: string,
  search_uuid: string,
  onSources: (value: Source[]) => void,
  onMarkdown: (value: string) => void,
  onRelates: (value: Relate[]) => void,
  onError?: (status: number) => void,
) => {
  console.log("Calling parse streaming...")
  const response = await fetch(`/api/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream"
    },
    body: JSON.stringify({
      query,
    })
  });

  if (response.status !== 200) {
    onError?.(response.status);
    return;
  }
  if (!response.body) {
    return;
  }

  const reader = response.body.getReader();
  let decoder = new TextDecoder();
  let uint8Array = new Uint8Array();
  let chunks = '';
  let chunkReply = false;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    uint8Array = new Uint8Array([...uint8Array, ...value]);
    chunks += decoder.decode(uint8Array, { stream: true });
    let sink = '';
    let iC = 0;
    const lines = chunks.split('\n');
    if (lines) {
      //@ts-ignore
      chunks = lines.pop(); // Keep any incomplete line for the next iteration
    }
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.substring(5).trim();
        sink += line.replace('data: ', '').slice(0, -1);
        iC += 1
        if (chunkReply && iC%5==0) {
          let md = sink.split(LLM_SPLIT)[1]
          onMarkdown(markdownParse(md));
        }
        // Handle data based on assumed format (adjust if needed)
        if (line.includes(LLM_SPLIT) && !chunkReply) {
          onSources(JSON.parse(sink.replace(LLM_SPLIT,''))); // Assuming sources are JSON-formatted
          chunkReply = true;
        } else if (sink.includes(`"queries"`) && sink.includes(RELATED_SPLIT)) {
          const [_, relates] = sink.split(`"queries":`);
          let relatesCleaned = relates.split(RELATED_SPLIT)[0].slice(0,-1).trim()//#.strip()
          onRelates(JSON.parse(relatesCleaned));
        } else {
          // Handle other event types
        }
      }
    }
  }
};