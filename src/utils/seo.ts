// SEO helper to update page title, meta description, canonical link, and robots tag

interface SeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
}

export function updatePageSeo({ title, description, canonicalPath, robots = 'index, follow' }: SeoConfig) {
  if (typeof document === 'undefined') return;

  // 1. Update Title
  document.title = title;

  // 2. Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // 3. Update Canonical URL
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  const canonicalDomain = 'https://www.mlandproperties.com';
  const path = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  canonicalLink.setAttribute('href', `${canonicalDomain}${path}`);

  // 4. Update Robots Tag
  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    document.head.appendChild(robotsMeta);
  }
  robotsMeta.setAttribute('content', robots);
}

