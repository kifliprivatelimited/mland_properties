import fs from 'fs';
import path from 'path';

export function generateSitemap() {
  const CANONICAL_DOMAIN = 'https://www.mlandproperties.com';
  const today = new Date().toISOString().split('T')[0];

  const projects = [
    {
      loc: `${CANONICAL_DOMAIN}/images/villa-travertine-sunset.jpg`,
      title: 'Villa Travertine — Residence & Landscape',
      caption: 'Contemporary stone residence with infinity pool overlooking the Mediterranean sea at sunset in Marbella',
    },
    {
      loc: `${CANONICAL_DOMAIN}/images/hotel-lumen-lobby.jpg`,
      title: 'Hôtel Lumen — Hospitality Architecture',
      caption: 'Soaring double-height grand lobby with bookmatched Italian marble and ribbed oak panels in Istanbul',
    },
    {
      loc: `${CANONICAL_DOMAIN}/images/villa-exterior.jpg`,
      title: 'Villa Fiorentina — Private Residence',
      caption: 'Modern stone residence with courtyard pool and mature olive trees in Florence',
    },
    {
      loc: `${CANONICAL_DOMAIN}/images/commercial-building.jpg`,
      title: 'Atrium Works — Commercial Headquarters',
      caption: 'Commercial headquarters with warm stone and bronze facade in Istanbul',
    },
    {
      loc: `${CANONICAL_DOMAIN}/images/interior-design.jpg`,
      title: 'Marble House — Interior Architecture',
      caption: 'Luxury interior with travertine columns, oak joinery and bronze fixtures in Doha',
    },
    {
      loc: `${CANONICAL_DOMAIN}/images/renovation-building.jpg`,
      title: 'Pavilion Oak — Guest Pavilion',
      caption: 'Timber and limestone guest pavilion nestled in lavender fields in Provence',
    },
  ];

  const legalPages = [
    '/privacy-policy',
    '/terms-and-conditions',
    '/cookie-policy',
    '/disclaimer',
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Homepage & Architectural Portfolio -->
  <url>
    <loc>${CANONICAL_DOMAIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
${projects
  .map(
    (p) => `    <image:image>
      <image:loc>${p.loc}</image:loc>
      <image:title>${escapeXml(p.title)}</image:title>
      <image:caption>${escapeXml(p.caption)}</image:caption>
    </image:image>`
  )
  .join('\n')}
  </url>

  <!-- Legal & Compliance Documentation -->
${legalPages
  .map(
    (route) => `  <url>
    <loc>${CANONICAL_DOMAIN}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  fs.writeFileSync('public/sitemap.xml', sitemapXml.trim() + '\n', 'utf8');
  if (fs.existsSync('dist')) {
    fs.writeFileSync('dist/sitemap.xml', sitemapXml.trim() + '\n', 'utf8');
  }
  console.log('Generated sitemap.xml with updated timestamp.');
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

if (process.argv[1]?.endsWith('generate-sitemap.js')) {
  generateSitemap();
}

