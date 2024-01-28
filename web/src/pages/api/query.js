// // pages/api/stream.js
// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     res.status(405).end(); // Only allow GET requests
//     return;
//   }

//   try {
//     console.log('attempting to fetch...')
//     const externalResponse = await fetch('https://api.sciphi.ai/query', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer 765404bc9e5872e5f5ce36e89f70e729`,
//         'Accept': 'text/event-stream'
//       },
//       body: JSON.stringify(req.body)
//     });

//     if (!externalResponse.ok) {
//       throw new Error('Failed to fetch external source');
//     }

//     res.writeHead(200, {
//       'Content-Type': 'text/event-stream',
//       'Connection': 'keep-alive',
//       'Cache-Control': 'no-cache',
//     });

//     const reader = externalResponse.body.getReader();

//     // Function to handle each chunk
//     const pushChunk = async () => {
//       const { done, value } = await reader.read();
//       if (done) {
//         res.end();
//         return;
//       }
//       res.write(value);
//       await pushChunk(); // Recursively push next chunk
//     };

//     await pushChunk();
//   } catch (error) {
//     console.error(error);
//     res.status(500).end();
//   }
// }

// src/pages/api/query.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    console.log('fetching query...')
    const response = await fetch('https://api.sciphi.ai/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 765404bc9e5872e5f5ce36e89f70e729`,
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Set headers for streaming response
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    });

    console.log('Starting to stream...');

    // Forward chunks as they arrive
    response.body.pipe(res);

    response.body.on('end', () => {
      console.log('Stream ended.');
      res.end();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
