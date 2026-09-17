import fs from 'fs';

const css = fs.readFileSync('dist/assets/bundle.css', 'utf8');
const js = fs.readFileSync('dist/assets/bundle.js', 'utf8');

const html = `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Genowl - Intelligence that grows with you</title>
    <meta name="description" content="High-converting 2D websites, cinema-grade 3D WebGL experiences, and custom AI production — engineered for visionary brands." />
    <link rel="canonical" href="https://genowl.tech/" />

    <!-- Google Search & Desktop Browser Tab Favicons -->
    <meta name="google-site-verification" content="7W7u1FClacGfGr1N7M2t4qxijoU6jRt-UkbU1nfWXow" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

    <!-- Mobile Phone (iOS Safari & Android Chrome) Icons & PWA Manifest -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#070908" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Genowl" />

    <!-- Open Graph & Social Cards (Google Discover, WhatsApp, LinkedIn, X, Telegram) -->
    <meta property="og:title" content="Genowl - Intelligence that grows with you" />
    <meta property="og:description" content="High-converting 2D websites, cinema-grade 3D WebGL experiences, and custom AI production — engineered for visionary brands." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://genowl.tech/" />
    <meta property="og:image" content="https://genowl.tech/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />

    <!-- Twitter / X Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@GENOWL_TECH" />
    <meta name="twitter:creator" content="@GENOWL_TECH" />
    <meta name="twitter:title" content="Genowl - Intelligence that grows with you" />
    <meta name="twitter:description" content="High-converting 2D websites, cinema-grade 3D WebGL experiences, and custom AI production." />
    <meta name="twitter:image" content="https://genowl.tech/og-image.png" />

    <!-- Google Structured Data (Organization Schema with 512px Logo) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Genowl",
      "url": "https://genowl.tech/",
      "logo": "https://genowl.tech/icon-512x512.png",
      "image": "https://genowl.tech/og-image.png",
      "description": "High-converting 2D websites, cinema-grade 3D WebGL experiences, and custom AI production.",
      "telephone": "+1-628-245-9578",
      "email": "support@genowl.tech",
      "sameAs": [
        "https://x.com/GENOWL_TECH",
        "https://instagram.com/genowl_tech"
      ]
    }
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <style>
${css}
    </style>
  </head>
  <body class="bg-[#070908] text-white antialiased selection:bg-[#c6f554]/30 selection:text-[#c6f554]">
    <div id="root"></div>
    <script type="module">
${js}
    </script>
  </body>
</html>`;

fs.writeFileSync('index.html', html, 'utf8');
console.log('Standalone index.html successfully generated! Total size:', html.length, 'bytes');
