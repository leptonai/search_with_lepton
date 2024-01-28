
export const config = {
  runtime: "edge",
};

// pages/api/stream.js
export default async function handler(req, res) {
  const query = req.body.query; // or however you get the query
  console.log("req = ", req)
  console.log("req.body.query = ", req.body.query)
  console.log("req.query.query = ", req.query.query)
  const apiKey = process.env.SCIPHI_API_KEY; // Accessing the environment variable

  
  console.log('query = ', query)
  const externalApiResponse = await fetch(`https://api.sciphi.ai/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${apiKey}`, // Use an environment variable here
      Accept: "text/event-stream"
    },
    body: JSON.stringify({query })
  });

  // if (externalApiResponse.status !== 200) {
  //   res.status(externalApiResponse.status).json({ error: 'Error fetching data' });
  //   return;
  // }

  const readableStream = externalApiResponse.body;
  const decoder = new TextDecoder();

  const readable = new ReadableStream({
    async start(controller) {
      const reader = readableStream.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Process and decode data
        // Replace this with your actual data processing logic
        const processedText = decoder.decode(value, { stream: true });
        
        // Stream the processed text to the client
        controller.enqueue(processedText);
      }

      controller.close();
    }
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain' }
  });
}