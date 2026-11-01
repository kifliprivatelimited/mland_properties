import fs from 'fs';
import path from 'path';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { generateSitemap } from './generate-sitemap.js';

const CANONICAL_DOMAIN = 'https://www.mlandproperties.com';

async function prerender() {
  console.log('--- Starting SSG Prerendering for MLAND Properties ---');

  const distIndexHtmlPath = path.resolve('dist/index.html');
  if (!fs.existsSync(distIndexHtmlPath)) {
    throw new Error('dist/index.html not found. Please run vite build first.');
  }

  const baseHtml = fs.readFileSync(distIndexHtmlPath, 'utf8');

  // Start Vite server in SSR mode
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const appMod = await vite.ssrLoadModule('/src/App.tsx');
    const App = appMod.default;

    const seoMod = await vite.ssrLoadModule('/src/utils/seo.ts');
    const ROUTES_SEO = seoMod.ROUTES_SEO;

    const routes = [
      { path: '/', dest: 'dist/index.html' },
      { path: '/privacy-policy', dest: 'dist/privacy-policy/index.html' },
      { path: '/terms-and-conditions', dest: 'dist/terms-and-conditions/index.html' },
      { path: '/cookie-policy', dest: 'dist/cookie-policy/index.html' },
      { path: '/disclaimer', dest: 'dist/disclaimer/index.html' },
      { path: '/404', dest: 'dist/404.html' },
    ];

    for (const { path: route, dest } of routes) {
      console.log(`Prerendering route: ${route} -> ${dest}`);

      const renderedBody = renderToString(
        React.createElement(App, { initialPath: route, initialLoading: false })
      );

      const seo = ROUTES_SEO[route] || ROUTES_SEO['/'];
      const canonicalUrl = `${CANONICAL_DOMAIN}${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`;

      let html = baseHtml;

      // 1. Replace Title
      html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(seo.title)}</title>`);

      // 2. Replace Meta Description
      html = html.replace(
        /<meta name="description" content=".*?" \/>/s,
        `<meta name="description" content="${escapeAttr(seo.description)}" />`
      );

      // 3. Replace Canonical Link
      html = html.replace(
        /<link rel="canonical" href=".*?" \/>/s,
        `<link rel="canonical" href="${canonicalUrl}" />`
      );

      // 4. Replace Robots Meta
      html = html.replace(
        /<meta name="robots" content=".*?" \/>/s,
        `<meta name="robots" content="${seo.robots || 'index, follow'}" />`
      );

      // 5. Open Graph Meta Tags
      html = html.replace(
        /<meta property="og:title" content=".*?" \/>/s,
        `<meta property="og:title" content="${escapeAttr(seo.title)}" />`
      );
      html = html.replace(
        /<meta property="og:description" content=".*?" \/>/s,
        `<meta property="og:description" content="${escapeAttr(seo.description)}" />`
      );
      html = html.replace(
        /<meta property="og:url" content=".*?" \/>/s,
        `<meta property="og:url" content="${canonicalUrl}" />`
      );
      html = html.replace(
        /<meta property="og:type" content=".*?" \/>/s,
        `<meta property="og:type" content="${seo.ogType || 'website'}" />`
      );

      // 6. Twitter Meta Tags
      html = html.replace(
        /<meta name="twitter:title" content=".*?" \/>/s,
        `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`
      );
      html = html.replace(
        /<meta name="twitter:description" content=".*?" \/>/s,
        `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`
      );
      html = html.replace(
        /<meta name="twitter:url" content=".*?" \/>/s,
        `<meta name="twitter:url" content="${canonicalUrl}" />`
      );

      // 7. Inject Route JSON-LD Structured Data
      if (seo.jsonLd) {
        const jsonLdScript = `<script id="seo-structured-data" type="application/ld+json">\n${JSON.stringify(
          seo.jsonLd,
          null,
          2
        )}\n    </script>`;
        html = html.replace(
          /<script id="seo-structured-data" type="application\/ld\+json">.*?<\/script>/s,
          jsonLdScript
        );
      }

      // 8. Inject Server Rendered Body into #root
      html = html.replace('<div id="root"></div>', `<div id="root">${renderedBody}</div>`);

      // Ensure directory exists and write file
      const fullDest = path.resolve(dest);
      fs.mkdirSync(path.dirname(fullDest), { recursive: true });
      fs.writeFileSync(fullDest, html, 'utf8');
      console.log(`  ✓ Wrote ${fullDest} (${html.length} bytes)`);
    }

    // Refresh sitemap.xml in dist
    generateSitemap();

    console.log('--- Prerendering Completed Successfully ---');
  } finally {
    await vite.close();
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;');
}

prerender().catch((err) => {
  console.error('[Prerender Fatal Error]', err);
  process.exit(1);
});

