const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const effects = {
  wetglass: 'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html',
  flaming: 'https://en.ephoto360.com/create-a-burning-text-online-131.html',
  blackpink: 'https://en.ephoto360.com/blackpink-style-logo-maker-online-free-519.html'
};

async function generateImage(effectUrl, text) {
  const html = await axios.get(effectUrl);
  const $ = cheerio.load(html.data);
  const token = $('input[name="token"]').val();
  const form = new URLSearchParams();

  form.append('text[]', text);
  form.append('token', token);
  form.append('build_server', 'https://img.ephoto360.com');
  form.append('build_server_id', '3');

  const { data } = await axios.post(
    `https://en.ephoto360.com/effect/create-image`,
    form,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );
  return data.image;
}

app.get('/api/ephoto/:style', async (req, res) => {
  const style = req.params.style;
  const text = req.query.text;

  if (!text) return res.status(400).json({ status: 'error', message: 'Missing ?text= parameter', creator: 'Gabimaru' });
  if (!effects[style]) return res.status(404).json({ status: 'error', message: 'Invalid style name', creator: 'Gabimaru' });

  try {
    const imageUrl = await generateImage(effects[style], text);
    if (imageUrl) {
      res.json({ status: 'success', image: imageUrl, style, creator: 'Gabimaru' });
    } else {
      res.status(500).json({ status: 'error', message: 'Failed to generate image', creator: 'Gabimaru' });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message, creator: 'Gabimaru' });
  }
});

// Keep Render alive
setInterval(() => {
  axios.get('https://your-app-name.onrender.com').catch(() => {});
}, 300000);

// Homepage
app.get('/', (req, res) => {
  const base = 'https://' + req.headers.host;
  const apis = Object.keys(effects).map(style => {
    return `
      <div class="card">
        <h2>${style.toUpperCase()}</h2>
        <p>${base}/api/ephoto/${style}?text=YourText</p>
        <a href="/api/ephoto/${style}?text=YourText" target="_blank">Try It</a>
        <button onclick="copyLink('${base}/api/ephoto/${style}?text=YourText')">Copy</button>
      </div>
    `;
  }).join('');

  res.send(`
    <html>
      <head>
        <title>Gabimaru GFX API</title>
        <style>
          body { font-family: sans-serif; background: #f7f7f7; padding: 2em; }
          h1 { text-align: center; }
          .card {
            background: white;
            border-radius: 12px;
            padding: 1em;
            margin: 1em auto;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 500px;
            text-align: center;
          }
          .card h2 { color: #d32f2f; }
          .card p { font-family: monospace; color: #555; }
          .card a, .card button {
            display: inline-block;
            margin: 0.5em;
            padding: 0.5em 1em;
            background: #d32f2f;
            color: white;
            border: none;
            border-radius: 8px;
            text-decoration: none;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h1>Gabimaru Ephoto GFX API</h1>
        ${apis}
        <script>
          function copyLink(text) {
            navigator.clipboard.writeText(text).then(() => alert('Copied!'));
          }
        </script>
      </body>
    </html>
  `);
});

app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
