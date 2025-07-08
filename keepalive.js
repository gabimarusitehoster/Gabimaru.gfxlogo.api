
const http = require('http');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3000;
const SELF_URL = 'https://viper-x-api.onrender.com';

// Simple HTTP server to satisfy Render's uptime check
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('✅ Viper X is alive and running.\n');
}).listen(PORT, () => {
  console.log(`✅ KeepAlive server running on port ${PORT}`);
});

// Self-ping every 5 minutes to prevent Render from idling
setInterval(async () => {
  try {
    const response = await fetch(SELF_URL);
    if (response.ok) {
      console.log(`🔁 Self-ping success at ${new Date().toLocaleTimeString()}`);
    } else {
      console.log(`⚠️ Ping failed: HTTP ${response.status}`);
    }
  } catch (err) {
    console.error('❌ Self-ping error:', err.message);
  }
}, 1000 * 60 * 5); // Every 5 minutes