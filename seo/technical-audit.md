# Technical SEO audit

Audit date: 28 November 2026

## Verified strengths

| Area | Evidence | Status |
| --- | --- | --- |
| Canonical host | All audited canonical tags use `https://www.wetakefwd.online` | Pass |
| Sitemap alignment | 44 sitemap URLs and 44 indexable main-site HTML pages | Pass |
| Noindex control | 43 local or experimental pages are `noindex,follow` and absent from the sitemap | Pass |
| Titles | No duplicate titles in generated main-site pages | Pass |
| Descriptions | No duplicate descriptions in generated main-site pages | Pass |
| H1 | Every generated public page has a primary heading | Pass |
| Image alternative text | No generated `<img>` element was missing an `alt` attribute | Pass |
| Structured data | Service, FAQ, breadcrumb, case-study and homepage schemas are rendered where appropriate | Pass |
| Redirects | Old core slugs redirect permanently to their selected canonical pages | Pass |
| Security | HTTPS plus basic Vercel security headers | Pass |
| Mobile foundation | Responsive viewport and mobile layouts are present | Pass; field testing still required |
| Crawl files | `robots.txt`, `sitemap.xml` and `llms.txt` are generated and deployed | Pass |

## Verified issues and actions

| Priority | Finding | Evidence | Action |
| --- | --- | --- | --- |
| P0 | Google shows an obsolete homepage version in a branded/site search result | Search result crawled two months earlier contains removed copy and unsupported metrics | Request recrawl of `/` in Search Console and monitor snippet replacement |
| P1 | Analytics implementation is not proven | GTM is installed, but no GA4/GTM access was available | Verify GA4 page views and conversion events in DebugView and Realtime |
| P1 | Two evidence-backed Etah pages had no internal inbound links | `/ecommerce-development/etah` and `/school-website-development/etah` had zero inbound links in the static export | Fixed by linking them contextually from relevant case studies |
| P1 | SEO service title repeated “Services” | Generated title was `SEO Services Services in India` | Fixed with an explicit meta title |
| P1 | Three commercial descriptions ended mid-thought | Static export truncated descriptions after words such as “and” | Fixed with intentionally shorter descriptions |
| P2 | Case-study image payload is high | Multiple PNG files are 550 KB–1.48 MB | Convert photographic screenshots to WebP/AVIF after visual comparison; retain PNG only when transparency or fidelity requires it |
| P2 | Field Core Web Vitals are unknown | No CrUX or Search Console CWV export was available | Record mobile LCP, INP and CLS from Search Console and PageSpeed Insights monthly |
| P2 | Guides have only one obvious inbound path each | Each guide is linked from the guides index, with limited service-page support | Add contextual guide links from the relevant service pages and Insights articles |
| P2 | Commercial and editorial domains split authority | Main site and Insights are separate hosts | Use consistent authorship, reciprocal contextual links, canonicals and brand entities; do not duplicate content |

## Indexing and crawl checks

- `robots.txt` allows crawling and references the main sitemap.
- The main sitemap contains only canonical, indexable pages.
- The thank-you page is correctly noindex.
- The noindex local pages remain followable so their outgoing links are usable, but they should not be treated as ranking assets.
- Redirects cover the old high-priority slugs. Add redirects whenever a published URL is consolidated or removed.
- A custom 404 experience should be verified in Vercel production. Static hosting can otherwise return a generic platform response.

## On-page checks

Every important page should continue to have:

- one descriptive title and H1;
- a description written as a useful search-result summary, not a list of keywords;
- a self-referencing canonical;
- useful H2 sections matching buyer questions;
- one primary conversion action;
- links to relevant proof and learning content;
- accurate image dimensions and alt text;
- Service, Article, Breadcrumb or FAQ markup only when the visible page supports it.

## Performance work order

1. Convert the largest case-study screenshots and brand images to modern formats.
2. Confirm the intro video does not delay LCP on mobile and is not fetched when unnecessary.
3. Measure real-user Core Web Vitals before changing JavaScript or fonts.
4. Remove unused legacy CSS/JS only after coverage testing; several stylesheets are historical and a broad deletion could break pages.
5. Keep explicit image width and height attributes to avoid layout shifts.

## Safe fixes completed in this audit

- Corrected the SEO service title.
- Rewrote three truncated commercial descriptions.
- Added internal paths to two evidence-backed Etah pages.
- Replaced “Company overview” with “Service overview” in `llms.txt`.

## Verification not possible without account access

- Google-selected canonicals and indexed-page count
- Search Console queries, impressions, clicks, CTR and position
- GA4 traffic and conversions
- CrUX field performance
- Backlink profile and referring-domain quality
- Google Business Profile performance

These are research tasks, not reasons to invent estimates.

