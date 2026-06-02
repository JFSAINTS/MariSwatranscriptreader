import http from 'http';
import { translate } from '@vitalets/google-translate-api';

const PORT = process.env.TRANSLATE_PORT || 3001;

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/translate' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { text, source = 'es', target = 'en' } = JSON.parse(body);

        if (!text) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Text is required' }));
          return;
        }

        // Usar Google Translate - sin claves, soporte para páginas completas
        try {
          const result = await translate(text, { from: source, to: target });

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            translatedText: result.text,
            source,
            target,
          }));
        } catch (translateError) {
          console.error('Google Translate error:', translateError.message);
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Translation failed',
            message: translateError.message
          }));
        }
      } catch (error) {
        console.error('Server error:', error.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Invalid request',
          message: error.message
        }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Translation server running on port ${PORT}`);
});
