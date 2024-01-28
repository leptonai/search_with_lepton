
export const config = {
  runtime: "edge",
};

// pages/api/stream.js
export default async function handler(req, res) {
  const query = req.body.query; // or however you get the query
  const externalApiResponse = await fetch(`https://api.sciphi.ai/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer 765404bc9e5872e5f5ce36e89f70e729`, // Use an environment variable here
      Accept: "text/event-stream"
    },
    body: JSON.stringify({ query })
  });

  if (externalApiResponse.status !== 200) {
    res.status(externalApiResponse.status).json({ error: 'Error fetching data' });
    return;
  }

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


// // pages/api/stream.js

// export default async function handler(req, res) {
//   const encoder = new TextEncoder();

//   const stream = new ReadableStream({
//     start(controller) {
//       const sendChunk = async (chunk, delayMs) => {
//         await new Promise(resolve => setTimeout(resolve, delayMs));
//         controller.enqueue(encoder.encode(chunk));
//       };

//       sendChunk("First chunk of data", 1000)
//         .then(() => sendChunk("Second chunk of data", 1000))
//         .then(() => sendChunk("Final chunk of data", 1000))
//         .then(() => controller.close());
//     }
//   });

//   return new Response(stream, {
//     headers: { 'Content-Type': 'text/plain' }
//   });
// }


// import { OpenAIStream, StreamingTextResponse } from 'ai';


// // pages/api/sciphi.js
// export default async function handler(req, res) {
//   // Extract the query from the request body
//   const { query } = req.body;

//   try {
//     console.log("fetching...")
//     // Fetch data from the external API
//     const response = await fetch(`https://api.sciphi.ai/query`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         'Authorization': `Bearer 765404bc9e5872e5f5ce36e89f70e729`, // ${process.env.SCIPHI_API_KEY}`, // Use environment variable
//         Accept: "text/event-stream"
//       },
//       body: JSON.stringify({
//         query,
//       })
//     });

//     // Check if the response is successful
//     if (response.status !== 200) {
//       // You can also log the error or handle it as needed
//       res.status(response.status).send(`Error: ${response.status}`);
//       return;
//     }

//     console.log("getting reader... ")
//     // Read the stream from the response
//     const reader = response.body.getReader();

//     // Process the stream data as needed, or send it directly
//     // For example, you might want to read the stream and send the data as JSON
//     console.log("reading stream...")
//     let data = await readStream(reader);
//     res.status(200).json(data);

//   } catch (error) {
//     // Handle any errors that occurred during the fetch
//     res.status(500).json({ error: error.message });
//   }
// }

// // Helper function to read the stream
// async function readStream(reader) {
//   let chunks = [];
//   let done, value;
//   while (!done) {
//     ({ done, value } = await reader.read());
//     if (!done) {
//       console.log('chunk value = ...', value)
//       chunks.push(value);
//     }
//   }
//   let buffer = new Uint8Array(chunks.reduce((acc, val) => acc.concat(Array.from(val)), []));
//   return new TextDecoder().decode(buffer);
// }

// // // src/pages/api/query.js
// // import { Readable } from 'stream';

// // export default async function handler(req, res) {
// //   if (req.method !== 'POST') {
// //     res.setHeader('Allow', ['POST']);
// //     res.status(405).end(`Method ${req.method} Not Allowed`);
// //     return;
// //   }

// //   try {
// //     console.log('fetching query...');
// //     const externalApiResponse = await fetch('https://api.sciphi.ai/query', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': `Bearer 765404bc9e5872e5f5ce36e89f70e729`,
// //         'Accept': 'text/event-stream'
// //       },
// //       body: JSON.stringify(req.body)
// //     });

// //     if (!externalApiResponse.ok) {
// //       throw new Error(`Error: ${externalApiResponse.status}`);
// //     }

// //     // Ensure the response is a stream
// //     if (!externalApiResponse.body || !(externalApiResponse.body instanceof Readable)) {
// //       throw new Error("Response from external API is not a stream.");
// //     }

// //     console.log('Setting up streaming response...');
    
// //     // Set headers for streaming response
// //     res.writeHead(200, {
// //       'Content-Type': 'text/event-stream',
// //       'Connection': 'keep-alive',
// //       'Cache-Control': 'no-cache',
// //       'Transfer-Encoding': 'chunked'
// //     });

// //     externalApiResponse.body.on('data', (chunk) => {
// //       res.write(chunk);
// //     });

// //     externalApiResponse.body.on('end', () => {
// //       console.log('Stream ended.');
// //       res.end();
// //     });

// //     externalApiResponse.body.on('error', (err) => {
// //       console.error('Stream encountered an error:', err);
// //       res.end();
// //     });

// //   } catch (error) {
// //     console.error('An error occurred:', error);
// //     res.status(500).json({ error: error.message });
// //   }
// // }

// // // // // pages/api/stream.js
// // // // export default async function handler(req, res) {
// // // //   if (req.method !== 'GET') {
// // // //     res.status(405).end(); // Only allow GET requests
// // // //     return;
// // // //   }

// // // //   try {
// // // //     console.log('attempting to fetch...')
// // // //     const externalResponse = await fetch('https://api.sciphi.ai/query', {
// // // //       method: 'POST',
// // // //       headers: {
// // // //         'Content-Type': 'application/json',
// // // //         'Authorization': `Bearer 765404bc9e5872e5f5ce36e89f70e729`,
// // // //         'Accept': 'text/event-stream'
// // // //       },
// // // //       body: JSON.stringify(req.body)
// // // //     });

// // // //     if (!externalResponse.ok) {
// // // //       throw new Error('Failed to fetch external source');
// // // //     }

// // // //     res.writeHead(200, {
// // // //       'Content-Type': 'text/event-stream',
// // // //       'Connection': 'keep-alive',
// // // //       'Cache-Control': 'no-cache',
// // // //     });

// // // //     const reader = externalResponse.body.getReader();

// // // //     // Function to handle each chunk
// // // //     const pushChunk = async () => {
// // // //       const { done, value } = await reader.read();
// // // //       if (done) {
// // // //         res.end();
// // // //         return;
// // // //       }
// // // //       res.write(value);
// // // //       await pushChunk(); // Recursively push next chunk
// // // //     };

// // // //     await pushChunk();
// // // //   } catch (error) {
// // // //     console.error(error);
// // // //     res.status(500).end();
// // // //   }
// // // // }

// // // // src/pages/api/query.js
// // // export default async function handler(req, res) {
// // //   if (req.method !== 'POST') {
// // //     res.setHeader('Allow', ['POST']);
// // //     res.status(405).end(`Method ${req.method} Not Allowed`);
// // //     return;
// // //   }

// // //   try {
// // //     console.log('fetching query...')
// // //     const response = await fetch('https://api.sciphi.ai/query', {
// // //       method: 'POST',
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //         'Authorization': `Bearer 765404bc9e5872e5f5ce36e89f70e729`,
// // //         'Accept': 'text/event-stream'
// // //       },
// // //       body: JSON.stringify(req.body)
// // //     });

// // //     if (!response.ok) {
// // //       throw new Error(`Error: ${response.status}`);
// // //     }

// // //     // Set headers for streaming response
// // //     res.writeHead(200, {
// // //       'Content-Type': 'text/event-stream',
// // //       'Connection': 'keep-alive',
// // //       'Cache-Control': 'no-cache'
// // //     });

// // //     console.log('Starting to stream...');

// // //     // Forward chunks as they arrive
// // //     response.body.pipe(res);

// // //     response.body.on('end', () => {
// // //       console.log('Stream ended.');
// // //       res.end();
// // //     });
// // //   } catch (error) {
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // }
