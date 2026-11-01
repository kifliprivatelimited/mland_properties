# MLAND Properties — Technical SEO & Indexing Checklist

**Canonical Domain:** `https://www.mlandproperties.com`  
**Brand Identity:** MLAND Properties — Architecture, Construction & Interior Design (Istanbul, Turkey)  
**Theme Color:** `#F7F3ED`  
**Audit & Implementation Date:** 1 November 2026  

---

## 1. Files Changed & Created

### Core Build & Prerendering Architecture
* [`package.json`](file:///d:/Dev/projects/mland_properties/package.json) — Added build-time SSG prerendering hook (`tsc && vite build && node scripts/prerender.js`).
* [`scripts/prerender.js`](file:///d:/Dev/projects/mland_properties/scripts/prerender.js) — Lightweight static prerenderer that runs Vite in SSR mode and outputs static HTML for `/`, `/privacy-policy`, `/terms-and-conditions`, `/cookie-policy`, `/disclaimer`, and `/404` directly into `dist/`.
* [`scripts/generate-sitemap.js`](file:///d:/Dev/projects/mland_properties/scripts/generate-sitemap.js) — Dynamic build-time sitemap generator that embeds valid canonical URLs, image sitemap definitions, and timestamps.
* [`scripts/verify-seo.js`](file:///d:/Dev/projects/mland_properties/scripts/verify-seo.js) — Automated CI/build validator confirming prerendered HTML content, JSON-LD schemas, robots.txt, and sitemap XML.
* [`src/main.tsx`](file:///d:/Dev/projects/mland_properties/src/main.tsx) — Added dual-mode hydration (`hydrateRoot` for prerendered markup with fallback to `createRoot`).

### Head & Meta Management
* [`index.html`](file:///d:/Dev/projects/mland_properties/index.html) — Configured complete canonical tags, unique title, meta description, Open Graph, Twitter Cards, theme-color `#F7F3ED`, icon links, and initial JSON-LD structured data.
* [`src/utils/seo.ts`](file:///d:/Dev/projects/mland_properties/src/utils/seo.ts) — Centralized metadata repository defining <60 char titles, <160 char descriptions, schema.org models (`Organization`, `WebSite`, `LocalBusiness`, `BreadcrumbList`), and dynamic DOM meta mutators.
* [`src/App.tsx`](file:///d:/Dev/projects/mland_properties/src/App.tsx) — Added prerendering props (`initialPath`, `initialLoading`), 404 route handling, and automatic page-level SEO updates.
* [`src/components/Legal/PrivacyPolicy.tsx`](file:///d:/Dev/projects/mland_properties/src/components/Legal/PrivacyPolicy.tsx) — Updated with centralized route SEO and breadcrumb schema.
* [`src/components/Legal/TermsConditions.tsx`](file:///d:/Dev/projects/mland_properties/src/components/Legal/TermsConditions.tsx) — Updated with centralized route SEO and breadcrumb schema.
* [`src/components/Legal/CookiePolicy.tsx`](file:///d:/Dev/projects/mland_properties/src/components/Legal/CookiePolicy.tsx) — Updated with centralized route SEO and breadcrumb schema.
* [`src/components/Legal/Disclaimer.tsx`](file:///d:/Dev/projects/mland_properties/src/components/Legal/Disclaimer.tsx) — Updated with centralized route SEO and breadcrumb schema.

### Semantic Hierarchy & Quality Fixes
* [`src/components/Loader/Loader.tsx`](file:///d:/Dev/projects/mland_properties/src/components/Loader/Loader.tsx) — Replaced ephemeral preloader `<h1>` with a styled `div` to ensure the loading overlay does not conflict with page semantics.
* [`src/components/Hero/Hero.tsx`](file:///d:/Dev/projects/mland_properties/src/components/Hero/Hero.tsx) — Introduced the primary accessible `<h1>` on the homepage (`MLAND Properties — Contemporary Architecture, Precision Construction & Refined Interiors in Istanbul`) and adjusted fallback heading to `<h2>`.
* [`src/components/Studio/Studio.tsx`](file:///d:/Dev/projects/mland_properties/src/components/Studio/Studio.tsx) — Added `decoding="async"`, `width={1200}`, `height={900}`, and lazy-loading.
* [`src/components/Services/Services.tsx`](file:///d:/Dev/projects/mland_properties/src/components/Services/Services.tsx) — Added `decoding="async"`, `width={800}`, `height={600}` to prevent Cumulative Layout Shifts (CLS).
* [`src/components/Projects/Projects.tsx`](file:///d:/Dev/projects/mland_properties/src/components/Projects/Projects.tsx) — Added `decoding="async"` and explicit dimensions based on card layout.
* [`src/components/NotFound/NotFound.tsx`](file:///d:/Dev/projects/mland_properties/src/components/NotFound/NotFound.tsx) & [`NotFound.css`](file:///d:/Dev/projects/mland_properties/src/components/NotFound/NotFound.css) — Custom on-brand 404 error page sending `noindex, follow` directives with quick navigation back to the homepage.

### Crawling, Redirects & Assets
* [`public/robots.txt`](file:///d:/Dev/projects/mland_properties/public/robots.txt) — Explicitly allows all public routes while disallowing private `/admin` and `/api/` endpoints; points to `sitemap.xml`.
* [`public/sitemap.xml`](file:///d:/Dev/projects/mland_properties/public/sitemap.xml) — Valid XML sitemap covering all 200 OK indexable routes and image sitemap entries for architectural photography.
* `public/sitemap-test.xml` — Removed obsolete unlinked test file.
* [`vercel.json`](file:///d:/Dev/projects/mland_properties/vercel.json) — Configured permanent 301 host redirect from `mlandproperties.com` to `https://www.mlandproperties.com`, asset caching headers, and manifest MIME types.
* [`public/site.webmanifest`](file:///d:/Dev/projects/mland_properties/public/site.webmanifest) — Web app manifest matching brand palette `#211F1D` / `#F7F3ED`.
* `public/favicon.ico` — Multi-resolution binary icon (32x32, 48x48).
* `public/favicon-32x32.png` & `public/favicon-48x48.png` — Standard browser favicons.
* `public/apple-touch-icon.png` — High-DPI 180x180 iOS touch icon.
* `public/icon-192.png` & `public/icon-512.png` — PWA icons.
* `public/og-image.jpg` — 1200x630 social share preview image (Villa Travertine sunset architecture).

---

## 2. Business TODO Placeholders to Fill

The following placeholders contain real data found in the codebase where available, and clear `TODO` markers where specific Istanbul data must be supplied. Search for `TODO` in [`src/utils/seo.ts`](file:///d:/Dev/projects/mland_properties/src/utils/seo.ts) and [`index.html`](file:///d:/Dev/projects/mland_properties/index.html) to update:

| Placeholder | File Locations | Current Value / State | Instructions |
| :--- | :--- | :--- | :--- |
| **Istanbul Street Address** | `src/utils/seo.ts`<br>`index.html` | `"TODO: Add exact Istanbul street address"` | Replace with your physical office street name and building/suite number in Istanbul (e.g., `"Levent Mah., Nispetiye Cad. No: 12"`). |
| **Istanbul Postal Code** | `src/utils/seo.ts`<br>`index.html` | `"TODO: Add Istanbul postal code"` | Replace with your 5-digit Turkish postal code (e.g., `"34340"`). |
| **Istanbul Studio Direct Phone** | `src/utils/seo.ts`<br>`index.html` | `"+91 8590999415"` | Current code has the Kerala headquarters number. If you have an Istanbul studio direct phone line (e.g., `+90 212 ...`), update this in `telephone`. |
| **Instagram Social URL** | `src/utils/seo.ts`<br>`index.html` | `"https://www.instagram.com/TODO_INSTAGRAM_HANDLE"` | Replace `TODO_INSTAGRAM_HANDLE` with your official Instagram handle (e.g., `mlandproperties`). |
| **LinkedIn Social URL** | `src/utils/seo.ts`<br>`index.html` | `"https://www.linkedin.com/company/TODO_LINKEDIN_HANDLE"` | Replace `TODO_LINKEDIN_HANDLE` with your official LinkedIn company page slug. |
| **Turkish Version (`/tr/`)** | Optional / Future | English only (`lang="en"`) | *Do not add broken hreflang tags now.* When ready, add a `/tr/` route and introduce alternate hreflang tags: `<link rel="alternate" hreflang="en" href="https://www.mlandproperties.com/" />` and `<link rel="alternate" hreflang="tr" href="https://www.mlandproperties.com/tr/" />`. |

---

## 3. Post-Deployment Steps

Execute these steps immediately after pushing to production:

### 1. Google Search Console Verification (Domain Property)
1. Navigate to [Google Search Console](https://search.google.com/search-console).
2. Choose **Domain property** and enter `mlandproperties.com`.
3. Add the generated `TXT` record to your DNS provider (Cloudflare, GoDaddy, Namecheap, etc.) to verify root and all subdomains (both `www` and non-`www`).
4. Once verified, confirm that traffic resolves cleanly to `https://www.mlandproperties.com`.

### 2. Submit XML Sitemap
1. Inside Google Search Console, select **Sitemaps** in the left menu.
2. Enter `sitemap.xml` under *Add a new sitemap* and click **Submit**.
3. Confirm status shows **Success** and that all 5 URLs (and 6 images) are discovered.

### 3. Request URL Indexing for Homepage
1. In Search Console's top search bar, paste `https://www.mlandproperties.com/` and hit Enter (URL Inspection).
2. Click **Test Live URL** to confirm Googlebot renders the pre-rendered HTML without errors.
3. Click **Request Indexing**.
4. Repeat URL Inspection and indexing requests for the inner legal pages if desired.

### 4. Create and Verify Google Business Profile (GBP)
1. Go to [Google Business Profile](https://www.google.com/business/).
2. Create or claim **MLAND Properties**.
3. **Primary Category:** Select **Architect** or **General Contractor**.
4. **Secondary Categories:** *Interior Designer*, *Architecture Firm*, *Building Construction Company*.
5. **Address:** Enter the exact Istanbul address that matches your JSON-LD `PostalAddress`.
6. **Website:** Set to `https://www.mlandproperties.com/`.
7. **Business Hours:** Monday–Friday 09:00–18:00 (matching `openingHoursSpecification`).
8. Upload high-resolution photos of your flagship projects (`Villa Travertine`, `Hôtel Lumen`, `Atrium Works`) and your studio workspace (`studio-interior.jpg`).

### 5. Run Rich Results Test & PageSpeed Insights
1. **Google Rich Results Test:** Open [Rich Results Test](https://search.google.com/test/rich-results) and test `https://www.mlandproperties.com/`. Verify that `Organization`, `WebSite`, and `LocalBusiness` / `GeneralContractor` structured data are recognized with zero errors.
2. **PageSpeed Insights:** Open [PageSpeed Insights](https://pagespeed.web.dev/) and test `https://www.mlandproperties.com/`. Confirm First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Cumulative Layout Shift (CLS) scores are in the green zone.
3. **HTTP 301 Redirect Check:** Test via terminal or [Redirect Detective](https://redirectdetective.com/):
   * `http://mlandproperties.com` → `https://www.mlandproperties.com` (301 Permanent Redirect)
   * `http://www.mlandproperties.com` → `https://www.mlandproperties.com` (301 Permanent Redirect)
   * `https://mlandproperties.com` → `https://www.mlandproperties.com` (301 Permanent Redirect)

