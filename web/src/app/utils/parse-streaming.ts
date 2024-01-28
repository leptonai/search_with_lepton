import { Relate } from "@/app/interfaces/relate";
import { Source } from "@/app/interfaces/source";

const LLM_SPLIT = "__LLM_RESPONSE__"; // Assuming this delimiter is still used
const RELATED_SPLIT = "__RELATED_QUESTIONS__"; // Assuming this delimiter is still used

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
  const response = await fetch(`https://api.sciphi.ai/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer 765404bc9e5872e5f5ce36e89f70e729`,
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
    // console.log('chunks = ', chunks)
    // Process accumulated chunks
    let sink = '';
    let iC = 0;
    const lines = chunks.split('\n');
    // console.log('...')
    chunks = lines.pop(); // Keep any incomplete line for the next iteration
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.substring(5).trim();
        sink += line.replace('data: ', '').slice(0, -1);
        // console.log(line)
        // console.log('sink = ',   sink)
        iC += 1
        if (chunkReply && iC%5==0) {
          // console.log(sink)
          let md = sink.split(LLM_SPLIT)[1]
          onMarkdown(md);
        }
        // Handle data based on assumed format (adjust if needed)
        if (line.includes(LLM_SPLIT) && !chunkReply) {
          // const [sources, md] = data.split(LLM_SPLIT);
          // console.log('source_chunk = ', source_chunk)
          // sink = sink.replace('data:', '')
          // sink = sink.split('data:')[0]
          // console.log(sink)
          // console.log("in on sources...., line = ", line)
          onSources(JSON.parse(sink.replace(LLM_SPLIT,''))); // Assuming sources are JSON-formatted
          chunkReply = true;
          // sink = '';
          // markdownParse(md);
        } else if (data.includes(RELATED_SPLIT)) {
          const [_, relates] = data.split(RELATED_SPLIT);
          onRelates(JSON.parse(relates)); // Assuming relates are JSON-formatted
        } else {
          // Handle other event types
        }
      }
    }
  }
};


// import { Relate } from "@/app/interfaces/relate";
// import { Source } from "@/app/interfaces/source";
// import { fetchStream } from "@/app/utils/fetch-stream";

// const LLM_SPLIT = "__LLM_RESPONSE__";
// const RELATED_SPLIT = "__RELATED_QUESTIONS__";

// export const parseStreaming = async (
//   controller: AbortController,
//   query: string,
//   search_uuid: string,
//   onSources: (value: Source[]) => void,
//   onMarkdown: (value: string) => void,
//   onRelates: (value: Relate[]) => void,
//   onError?: (status: number) => void,
// ) => {
//   const decoder = new TextDecoder();
//   let uint8Array = new Uint8Array();
//   let chunks = "";
//   let sourcesEmitted = false;
//   const response = await fetch(`https://api.sciphi.ai/query`, {
//   // const response = await fetch(`http://localhost:8080/query`, {
//       method: "POST",
//     headers: {
//       // "Transfer-Encoding": "chunked",
//       "Content-Type": "application/json",
//       'Authorization': `Bearer 765404bc9e5872e5f5ce36e89f70e729`,
//       Accept: "text/event-stream" // Specify the correct content type
//     },
//     // signal: controller.signal,
//     body: JSON.stringify({
//       query,
//     }),
//   });
//   if (response.status !== 200) {
//     onError?.(response.status);
//     return;
//   }
//   const markdownParse = (text: string) => {
//     onMarkdown(
//       text
//         .replace(/\[\[([cC])itation/g, "[citation")
//         .replace(/[cC]itation:(\d+)]]/g, "citation:$1]")
//         .replace(/\[\[([cC]itation:\d+)]](?!])/g, `[$1]`)
//         .replace(/\[[cC]itation:(\d+)]/g, "[citation]($1)"),
//     );
//   };
//   fetchStream(
//     response,
//     (chunk) => {
//       uint8Array = new Uint8Array([...uint8Array, ...chunk]);
//       chunks = decoder.decode(uint8Array, { stream: true });
//       // chunks = chunks.split
//       // chunks = chunks.replace('data:', '')
//       // console.log("chunks = ", chunks)
//       chunks = chunks.replace("data:", "").trim()
//       console.log("cleaned chunks = ", chunks)
//       if (chunks.includes(LLM_SPLIT)) {
//         const [sources, rest] = chunks.split(LLM_SPLIT);
//         if (!sourcesEmitted) {
//           try {
//             onSources(JSON.parse(sources));
//           } catch (e) {
//             onSources([]);
//           }
//         }
//         sourcesEmitted = true;
//         if (rest.includes(RELATED_SPLIT)) {
//           const [md] = rest.split(RELATED_SPLIT);
//           markdownParse(md);
//         } else {
//           markdownParse(rest);
//         }
//       }
//     },
//     () => {
//       const [_, relates] = chunks.split(RELATED_SPLIT);
//       try {
//         onRelates(JSON.parse(relates));
//       } catch (e) {
//         onRelates([]);
//       }
//     },
//   );
// };
