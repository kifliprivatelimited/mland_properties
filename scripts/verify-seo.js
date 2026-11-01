import fs from 'fs';

console.log('=== STEP 3: VERIFICATION ===');

// 1. Check robots.txt
if (!fs.existsSync('dist/robots.txt')) {
  console.error('FAIL: dist/robots.txt does not exist');
} else {
  const robots = fs.readFileSync('dist/robots.txt', 'utf8');
  console.log('PASS: dist/robots.txt exists.');
  console.log('Robots preview:\n' + robots.trim());
}

// 2. Check sitemap.xml
if (!fs.existsSync('dist/sitemap.xml')) {
  console.error('FAIL: dist/sitemap.xml does not exist');
} else {
  const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
  console.log('PASS: dist/sitemap.xml exists.');
  if (sitemap.startsWith('<?xml') && sitemap.includes('</urlset>') && !sitemap.includes('undefined')) {
    console.log('PASS: dist/sitemap.xml is valid XML syntax.');
  } else {
    console.error('FAIL: dist/sitemap.xml invalid syntax');
  }
}

// 3. Confirm built homepage HTML contains visible text content
const indexHtml = fs.readFileSync('dist/index.html', 'utf8');
const rootMatch = indexHtml.match(/<div id="root">([\s\S]*?)<\/div>/);
if (!rootMatch || rootMatch[1].trim().length < 500) {
  console.error('FAIL: dist/index.html root div is empty or too short');
} else {
  console.log(`PASS: dist/index.html root contains ${rootMatch[1].length} characters of pre-rendered markup.`);
  console.log('Contains H1:', indexHtml.includes('<h1'));
  console.log('Contains Studio content:', indexHtml.includes('A single team'));
  console.log('Contains Services:', indexHtml.includes('Residential Architecture'));
  console.log('Contains Projects:', indexHtml.includes('Villa Travertine'));
  console.log('Contains Contact:', indexHtml.includes('Tell us about'));
}

// 4. Validate JSON-LD syntax in index.html and privacy-policy
const extractJsonLd = (html) => {
  const match = html.match(/<script id="seo-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/);
  return match ? JSON.parse(match[1]) : null;
};

try {
  const homeJsonLd = extractJsonLd(indexHtml);
  console.log('PASS: dist/index.html JSON-LD is valid JSON.');
  console.log('  Types found:', Array.isArray(homeJsonLd) ? homeJsonLd.map((x) => x['@type']) : homeJsonLd['@type']);

  const privacyHtml = fs.readFileSync('dist/privacy-policy/index.html', 'utf8');
  const privacyJsonLd = extractJsonLd(privacyHtml);
  console.log('PASS: dist/privacy-policy/index.html JSON-LD is valid JSON.');
  console.log('  Breadcrumb type:', privacyJsonLd['@type']);
} catch (e) {
  console.error('FAIL: JSON-LD parse error:', e);
}

// 5. Check icon assets
const icons = [
  'dist/favicon.ico',
  'dist/favicon.svg',
  'dist/favicon-48x48.png',
  'dist/favicon-32x32.png',
  'dist/apple-touch-icon.png',
  'dist/site.webmanifest',
  'dist/og-image.jpg',
];
for (const icon of icons) {
  if (fs.existsSync(icon)) {
    console.log(`PASS: ${icon} (${fs.statSync(icon).size} bytes)`);
  } else {
    console.error(`FAIL: missing ${icon}`);
  }
}

