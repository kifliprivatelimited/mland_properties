// SEO Configuration and Head Management for MLAND Properties
// Canonical domain: https://www.mlandproperties.com (https, www)

export const CANONICAL_DOMAIN = 'https://www.mlandproperties.com';
export const THEME_COLOR = '#F7F3ED';
export const DEFAULT_OG_IMAGE = `${CANONICAL_DOMAIN}/og-image.jpg`;

export interface SeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

// 1. Organization Structured Data
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${CANONICAL_DOMAIN}/#organization`,
  name: 'MLAND Properties',
  legalName: 'Kifli Private Limited',
  url: CANONICAL_DOMAIN,
  logo: `${CANONICAL_DOMAIN}/favicon.svg`,
  email: 'kifliprivatelimited@gmail.com',
  telephone: '+91 8590999415', // TODO: Add Istanbul studio direct telephone if separate
  sameAs: [
    'https://www.instagram.com/TODO_INSTAGRAM_HANDLE',
    'https://www.linkedin.com/company/TODO_LINKEDIN_HANDLE',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91 8590999415',
    contactType: 'customer support',
    email: 'kifliprivatelimited@gmail.com',
    availableLanguage: ['English', 'Turkish'],
  },
};

// 2. WebSite Structured Data
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${CANONICAL_DOMAIN}/#website`,
  name: 'MLAND Properties',
  url: CANONICAL_DOMAIN,
  description:
    'Contemporary architecture, precision construction, and refined interiors delivered by a single integrated team in Istanbul.',
  publisher: {
    '@id': `${CANONICAL_DOMAIN}/#organization`,
  },
  inLanguage: 'en',
};

// 3. LocalBusiness / GeneralContractor / ProfessionalService Structured Data
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['GeneralContractor', 'ProfessionalService'],
  '@id': `${CANONICAL_DOMAIN}/#localbusiness`,
  name: 'MLAND Properties',
  description:
    'Contemporary architecture, precision construction, and refined interiors delivered by a single integrated team in Istanbul.',
  url: CANONICAL_DOMAIN,
  telephone: '+91 8590999415', // TODO: Add Istanbul studio office phone
  email: 'kifliprivatelimited@gmail.com',
  image: DEFAULT_OG_IMAGE,
  priceRange: '$$$$',
  currenciesAccepted: 'EUR, USD, TRY',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'TODO: Add exact Istanbul street address',
    addressLocality: 'Istanbul',
    addressRegion: 'Istanbul',
    postalCode: 'TODO: Add Istanbul postal code',
    addressCountry: 'TR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.0082, // Central Istanbul coordinates (TODO: Update with exact building coordinates if required)
    longitude: 28.9784,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Istanbul' },
    { '@type': 'Country', name: 'Turkey' },
    { '@type': 'Country', name: 'United Arab Emirates' },
    { '@type': 'Country', name: 'Spain' },
    { '@type': 'Country', name: 'Italy' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Architectural & Construction Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Residential Architecture',
          description: 'Contemporary residences, stone villas and bespoke family homes.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Interior Architecture & Joinery',
          description: 'Custom joinery, stone detailing and architectural lighting.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'General Construction & Project Delivery',
          description: 'Integrated structural execution and engineering on site.',
        },
      },
    ],
  },
};

// 4. Breadcrumb Helper for Inner Pages
export function getBreadcrumbSchema(pageName: string, path: string) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${CANONICAL_DOMAIN}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageName,
        item: `${CANONICAL_DOMAIN}${cleanPath}`,
      },
    ],
  };
}

// 5. Route-by-route Metadata Definitions (<60 char titles, <160 char descriptions)
export const ROUTES_SEO: Record<string, SeoConfig> = {
  '/': {
    title: 'MLAND Properties — Architecture & Construction', // 48 chars
    description:
      'MLAND Properties — Contemporary architecture, precision construction, and refined interiors delivered by a single integrated team in Istanbul.', // 145 chars
    canonicalPath: '/',
    robots: 'index, follow',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [organizationSchema, websiteSchema, localBusinessSchema],
  },
  '/privacy-policy': {
    title: 'Privacy Policy | MLAND Properties', // 33 chars
    description:
      'Read the privacy policy of MLAND Properties detailing data protection, client enquiry confidentiality, and statutory compliance.', // 129 chars
    canonicalPath: '/privacy-policy',
    robots: 'index, follow',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: getBreadcrumbSchema('Privacy Policy', '/privacy-policy'),
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions | MLAND Properties', // 37 chars
    description:
      'Terms and conditions governing architectural enquiries, copyright protection, preliminary estimates, and website use for MLAND Properties.', // 139 chars
    canonicalPath: '/terms-and-conditions',
    robots: 'index, follow',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: getBreadcrumbSchema('Terms & Conditions', '/terms-and-conditions'),
  },
  '/cookie-policy': {
    title: 'Cookie Policy | MLAND Properties', // 32 chars
    description:
      'MLAND Properties cookie and storage policy. Learn about our minimal storage practices and zero third-party marketing tracking.', // 127 chars
    canonicalPath: '/cookie-policy',
    robots: 'index, follow',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: getBreadcrumbSchema('Cookie Policy', '/cookie-policy'),
  },
  '/disclaimer': {
    title: 'Disclaimer | MLAND Properties', // 29 chars
    description:
      'Professional disclaimer regarding architectural 3D visualizations, preliminary feasibility estimates, and statutory planning sanctions.', // 136 chars
    canonicalPath: '/disclaimer',
    robots: 'index, follow',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: getBreadcrumbSchema('Disclaimer', '/disclaimer'),
  },
  '/404': {
    title: 'Page Not Found | MLAND Properties', // 33 chars
    description: 'The requested architectural document or page could not be located.',
    canonicalPath: '/404',
    robots: 'noindex, follow',
    ogType: 'website',
  },
};

function setMetaTag(selector: string, attrName: string, attrVal: string, content: string) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// 6. Dynamic Client-Side Head Update
export function updatePageSeo(config: SeoConfig) {
  if (typeof document === 'undefined') return;

  const {
    title,
    description,
    canonicalPath,
    robots = 'index, follow',
    ogType = 'website',
    ogImage = DEFAULT_OG_IMAGE,
    jsonLd,
  } = config;

  // Title
  document.title = title;

  // Standard Meta Tags
  setMetaTag('meta[name="description"]', 'name', 'description', description);
  setMetaTag('meta[name="robots"]', 'name', 'robots', robots);
  setMetaTag('meta[name="theme-color"]', 'name', 'theme-color', THEME_COLOR);

  // Canonical link
  const path = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = `${CANONICAL_DOMAIN}${path === '/' ? '/' : path}`;
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Open Graph
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'MLAND Properties');
  setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_US');

  // Twitter Cards
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

  // JSON-LD Script Tag
  const SCRIPT_ID = 'seo-structured-data';
  let scriptEl = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (jsonLd) {
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = SCRIPT_ID;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);
  } else if (scriptEl) {
    scriptEl.remove();
  }
}
