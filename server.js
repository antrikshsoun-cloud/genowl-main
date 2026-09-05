import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Built-in email forwarding endpoint (Resend REST API)
app.post('/api/send-email', async (req, res) => {
  try {
    const { apiKey, to, subject, text, html } = req.body;
    const key = apiKey || process.env.VITE_RESEND_API_KEY || '';

    if (!key) {
      return res.status(400).json({ success: false, error: 'No Resend API Key configured.' });
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        from: 'Genowl Studio <onboarding@resend.dev>',
        to: Array.isArray(to) ? to : [to],
        subject,
        text,
        ...(html ? { html } : {}),
      }),
    });

    const result = await resendResponse.json();
    res.status(resendResponse.status).json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err?.message || 'Server email error' });
  }
});

// Google Apps Script Server Proxy (Zero CORS, 100% server-to-server delivery)
app.post('/api/send-google-email', async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;
    const googleUrl =
      process.env.VITE_GOOGLE_APPS_SCRIPT_URL ||
      'https://script.google.com/macros/s/AKfycbwY6ycQQx1qV2C0dhNR686LeKWjGezYQ7kgSmUR2babI6dTIdmpK19etUdkBsSoqT-AfQ/exec';

    const googleRes = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ to, subject, html, text }),
    });

    const resultText = await googleRes.text();
    let parsed;
    try {
      parsed = JSON.parse(resultText);
    } catch {
      parsed = { status: 'success', raw: resultText };
    }
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ status: 'error', error: err?.message || 'Server Google Mail error' });
  }
});

// Serve compiled static assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback: send index.html for all frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Genowl Studio] Server active and listening on port ${PORT}`);
});
