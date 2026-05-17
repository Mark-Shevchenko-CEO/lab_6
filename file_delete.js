const http = require('http');
const fs = require('fs');

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  const match = req.url.match(/^\/data\/(\d+)$/);

  if (req.method === 'DELETE' && match) {
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
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Malformed data.json' }));
    }

    // Find item by id
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Not found' }));
    }

    // Remove item
    data.splice(index, 1);

    // Save back to file
    try {
      fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Could not write file' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});