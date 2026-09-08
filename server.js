const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // Mock API Routes
  if (url.pathname === '/api/leaderboard') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      entries: [
        { id: "lb-1", displayName: "Valkyrie_99", mode: "classic", difficulty: "extreme", score: 18450, accuracy: 98.2, bestCombo: 42, grade: "S+" },
        { id: "lb-2", displayName: "CyberGhost", mode: "classic", difficulty: "hard", score: 15200, accuracy: 96.5, bestCombo: 34, grade: "S+" },
        { id: "lb-3", displayName: "NeoSniper", mode: "precision", difficulty: "extreme", score: 14800, accuracy: 100.0, bestCombo: 28, grade: "S+" },
        { id: "lb-4", displayName: "BlazeTrigger", mode: "survival", difficulty: "hard", score: 13950, accuracy: 94.0, bestCombo: 29, grade: "S" },
      ]
    }));
    return;
  }

  if (url.pathname === '/api/scores' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: "Score verified and recorded" }));
    });
    return;
  }

  // Serve the primary Game Interface
  const filePath = path.join(__dirname, 'standalone.html');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading Prime Edge game file.');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`>>> PRIME EDGE SERVER RUNNING AT:`);
  console.log(`>>> http://localhost:${PORT}`);
  console.log(`========================================\n`);
});

