import url from "url";

export const config = {
  runtime: "edge",
};

// pages/api/stream.js
export default async function handler(req, res) {
  // const queryObject = url.parse(req.url, true).query;
  // const apiKey = process.env.SCIPHI_API_KEY; // Accessing the environment variable

  const queryObject = url.parse(req.url, true).query;
  const jsonData = {
    query: queryObject.query,
    limit: 10,
    filters: {},
    settings: {},
    generation_config: { "stream": true },
  };

  const externalApiResponse = await fetch(`${process.env.REMOTE_URL}/rag_completion/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': `Bearer ${apiKey}`, // Use an environment variable here
      Accept: "text/event-stream"
    },
    // body: JSON.stringify({ query: queryObject.query })
    body: JSON.stringify(jsonData)
  });

  // if (externalApiResponse.status !== 200) {
  //   res.status(externalApiResponse.status).json({ error: 'Error fetching data' });
  //   return;
  // }

  const readableStream = externalApiResponse.body;
  // const decoder = new TextDecoder();

  const readable = new ReadableStream({
    async start(controller) {
      const reader = readableStream.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Process and decode data
        // Replace this with your actual data processing logic
        // const processedText = decoder.decode(value, { stream: true });
        
        // Stream the processed text to the client
        controller.enqueue(value);
      }

      controller.close();
    }
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain' }
  });
}