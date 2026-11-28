# WeTakeFWD SEO operating system

Last audited: 28 November 2026

This directory is the working source of truth for organic search. It separates verified evidence from recommendations and avoids unsupported search-volume, ranking, backlink and traffic claims.

## Executive summary

WeTakeFWD has a stronger technical foundation than its present search visibility suggests. The live main site has a consistent canonical domain, a valid robots file, 44 indexable HTML pages matched by 44 sitemap entries, unique titles and descriptions, descriptive URLs, structured data, real project case studies, practical guides, and clear enquiry paths. Insights has a separate valid sitemap with 26 URLs, including nine published articles and an author page.

The main constraint is authority and evidence, not page count. Google is still showing an older cached version of the homepage for at least one branded search result. The site also competes with specialists that publish deeper workflow examples, clearer pilot offers, founder or team identity, prices or ranges, and measured case-study results. Creating more generic service or city pages would increase overlap without solving that problem.

The highest-impact strategy is:

1. Prove expertise through first-hand project evidence, named authorship and useful original resources.
2. Consolidate every core commercial intent around one authoritative page.
3. Use Insights to answer real buyer questions and link those answers to the relevant service and case study.
4. Earn links through client attribution, useful guest contributions, local and industry relationships, and one strong linkable asset.
5. Measure impressions, clicks, qualified enquiries and assisted conversions rather than page count or average position alone.

No SEO action guarantees a ranking.

## Current verified inventory

| Surface | Verified state |
| --- | --- |
| Main site | Static Flask export deployed on Vercel |
| Main sitemap | 44 URLs |
| Main indexable HTML | 44 pages |
| Main noindex HTML | 43 pages, intentionally excluded from sitemap |
| Insights sitemap | 26 URLs |
| Published Insights articles | 9 |
| Main guides | 3 |
| Main case studies | 5 |
| Main service and commercial pages | Core India service pages plus selected evidence-backed Etah pages |
| Analytics | Google Tag Manager container present; conversion configuration must be checked in GA4/GTM |
| Search Console | Sitemaps previously submitted successfully; current query data was not provided |

## Biggest opportunities

### P0 — critical

- Use Search Console URL Inspection to request recrawling of the homepage because Google still displays an obsolete cached version with unsupported claims.
- Confirm GA4 receives `generate_lead`, form-success, email-click and WhatsApp-click events. GTM presence alone does not prove tracking works.
- Export Search Console performance data for both properties so priorities can be based on actual queries and pages.

### P1 — high

- Add measurable, client-approved evidence to the five case studies: baseline, scope, launch date, adoption, response-time change, enquiries, or hours saved. Never invent metrics.
- Publish a transparent team or founder profile with real experience and responsibility. Insights already has an editorial-team author page; commercial pages need equivalent trust context.
- Strengthen the six principal commercial pages before adding new ones: AI automation, AI development, AI agents, chatbots, business automation, and custom software.
- Launch a useful Automation Opportunity Assessment as the first linkable and lead-generation asset.
- Secure contextual links from project clients where permission exists.

### P2 — medium

- Build four tightly connected content clusters: AI automation, AI agents, WhatsApp/CRM automation, and practical business systems.
- Improve internal links from articles to services, from services to evidence, and from case studies back to the exact commercial page.
- Test a clearer first offer: a 20–30 minute workflow review followed by a written shortlist of viable automation opportunities.
- Optimise large case-study images and verify Core Web Vitals with field data.

### P3 — long-term

- Publish original benchmarks only after enough real project data exists.
- Expand industry pages only where WeTakeFWD has proof, a repeatable solution and a distinct audience need.
- Pursue digital PR around small-town business technology, school digitisation and practical automation lessons.

## Files in this system

- `technical-audit.md` — verified technical findings and fixes
- `keyword-master-plan.md` — keyword clusters, intent and page ownership
- `content-gap-and-calendar.md` — topical authority plan and 90-day schedule
- `internal-linking-and-conversion.md` — link architecture and lead paths
- `competitors-and-backlinks.md` — competitor patterns, prospects and outreach
- `roadmap.md` — week-by-week priorities
- `tracking.md` — KPI definitions, Search Console workflow and reporting template

## Decision rules

- Improve an existing page when it already owns the intent.
- Create a page only when intent, audience and evidence are genuinely distinct.
- Mark volume and difficulty as `Not verified — requires keyword data tool` until exported from an approved source.
- Keep location pages noindex unless WeTakeFWD genuinely serves the location and can provide local proof or unique information.
- Do not publish fabricated testimonials, client results, offices, credentials or author profiles.
- Review every plan monthly using Search Console and lead data.

