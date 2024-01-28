import { Relate } from "@/app/interfaces/relate";
import { Source } from "@/app/interfaces/source";

const LLM_SPLIT = "__LLM_RESPONSE__"; // delimiter marking the start of the LLM response
const RELATED_SPLIT = "__RELATED_QUESTIONS__"; // delimiter marking the end of the LLM response

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
  const response = await fetch(`/api/query?query=${query}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      Accept: "text/event-stream"
    },
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
  let chunks = '';
  let chunkReply = false;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    console.log('chunk = ', chunk)

    chunks += chunk;
    let sink = '';
    let iC = 0;
    const lines = chunks.split('\n');
    for (const line of lines) {
      console.log('line = ', line)
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
          onSources(JSON.parse(sink.replace(LLM_SPLIT,'')));
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