import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Built-in backend server middleware to dispatch emails directly without browser CORS restrictions
function emailDispatchPlugin() {
  return {
    name: 'email-dispatch-endpoint',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === '/api/send-email' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body);
              const apiKey = payload.apiKey || process.env.VITE_RESEND_API_KEY || '';

              if (!apiKey) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'No Resend API Key configured yet.' }));
                return;
              }

              // Server-side call to Resend has ZERO browser CORS restrictions
              const resendResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                  from: 'Genowl Studio <onboarding@resend.dev>',
                  to: [payload.to],
                  subject: payload.subject,
                  text: payload.text,
                  ...(payload.html ? { html: payload.html } : {}),
                }),
              });

              const result = await resendResponse.json();
              console.log('[Genowl Email Dispatcher]', { to: payload.to, subject: payload.subject, status: resendResponse.status, result });
              res.statusCode = resendResponse.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err?.message || 'Server mail dispatch error' }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), emailDispatchPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
