const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.get('/', (req, res) => {
  res.send(`
    <style>
      body { font-family: sans-serif; background: #111; color: #fff; padding: 2rem; }
      .container { background: #222; padding: 1rem 2rem; border-radius: 10px; margin-bottom: 1rem; }
      .link { color: #0af; text-decoration: none; }
      .button { background: #0af; color: #fff; padding: 5px 10px; border: none; border-radius: 5px; }
    </style>
    <h1>Gabimaru GFX API</h1>
    <div class="container">
      <h3>GFX Text Effect API</h3>
      <p>Endpoint: <span class="link">/gfx?text=Gabimaru</span></p>
      <a class="button" href="/gfx?text=Gabimaru" target="_blank">Try it</a>
    </div>
  `);
});

app.get('/gfx', async (req, res) => {
  const text = req.query.text || 'Gabimaru';
  try {
    const { data } = await axios.post('https://photooxy.com/logo-and-text-effects/shadow-text-effect-in-the-sky-394.html', 
      new URLSearchParams({ text_1: text, login: 'OK' }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0',
        }
      });

    const $ = cheerio.load(data);
    const imageUrl = $('.thumbnail img').attr('src');

    if (!imageUrl) throw new Error('Image not found');

    res.json({
      status: 'success',
      image: `https://photooxy.com${imageUrl}`,
      creator: 'Gabimaru'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate image',
      error: err.message,
      creator: 'Gabimaru'
    });
  }
});

// Prevent Render sleep
setInterval(() => {
  axios.get('https://gabimaru-gfxlogo-api.onrender.com').catch(() => {});
}, 300000); // every 5 minutes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
