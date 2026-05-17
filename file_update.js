const http = require('http');
const fs = require('fs');

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  const match = req.url.match(/^\/data\/(\d+)$/);

  if (req.method === 'PUT' && match) {
    const id = parseInt(match[1], 10);

    // Read data.json
    let fileContent;
    try {
      fileContent = fs.readFileSync('data.json', 'utf8');
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Could not read file' }));
    }

    // Parse data.json
    let data;
    try {
      data = JSON.parse(fileContent);
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid data.json' }));
    }

    // Collect request body
    let body = '';
    req.on('data', chunk => { body += chunk; });

    req.on('end', () => {
      // Parse request body
      let updates;
      try {
        updates = JSON.parse(body);
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid JSON in request body' }));
      }

      // Find item by id
      const index = data.findIndex(item => item.id === id);
      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Not found' }));
      }

      // Update item
      data[index] = { ...data[index], ...updates };

      // Save back to file
      try {
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
      } catch {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Could not write file' }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data[index]));
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});