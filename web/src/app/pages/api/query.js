// src/pages/api/query.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const response = await fetch('https://api.sciphi.ai/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 765404bc9e5872e5f5ce36e89f70e729`, // Place your secret key here
            'Accept': 'text/event-stream'
          },
          body: JSON.stringify(req.body)
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
  
        const data = await response.text();
        res.status(200).send(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  