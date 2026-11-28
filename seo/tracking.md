# SEO tracking system

## Monthly scorecard

| Metric | Source | Baseline | Current | Change | Target or interpretation |
| --- | --- | --- | --- | --- | --- |
| Organic clicks | Search Console | Add after export |  |  | Trend by brand/non-brand |
| Organic impressions | Search Console | Add after export |  |  | Discovery trend |
| Non-brand clicks | Search Console query filter | Add after export |  |  | Primary visibility measure |
| Qualified organic leads | GA4 + lead record | Add after audit |  |  | Primary business outcome |
| Organic lead conversion rate | GA4 | Add after audit |  |  | Leads / organic landing sessions |
| WhatsApp clicks from organic | GA4/GTM | Add after setup |  |  | Assisted lead signal |
| Form successes from organic | GA4/GTM | Add after setup |  |  | Do not count button clicks alone |
| Pages with clicks | Search Console | Add after export |  |  | Breadth with actual engagement |
| Queries in positions 5–20 | Search Console | Add after export |  |  | Improvement queue |
| Relevant referring domains | Backlink tool/manual | Add after tool export |  |  | Quality reviewed manually |
| Core Web Vitals pass rate | Search Console | Add after export |  |  | Mobile first |

## Search Console workflow

Export two periods for each property:

- last 3 months;
- previous 3 months;
- optionally last 6 months for a broader baseline.

Include:

- queries;
- pages;
- countries;
- devices;
- search appearance;
- clicks, impressions, CTR and position.

Analysis queues:

### High impressions, low CTR

Review whether the title and description match the actual query. Do not use clickbait. Check whether Google selected a different title or canonical.

### Positions 5–20

Check intent alignment, completeness, originality, internal links and evidence. Improve the existing page before creating a competitor.

### Traffic without leads

Check whether the page serves informational intent, whether the CTA is appropriate and whether tracking works. An article may assist a later conversion rather than convert directly.

### No impressions

Check indexability, internal links, topic demand, page quality and overlap. Indexing alone does not establish demand.

## GA4/GTM event plan

| Event | Trigger | Parameters |
| --- | --- | --- |
| `generate_lead` | Confirmed form success or thank-you page | landing page, form name, service interest, UTMs |
| `whatsapp_click` | Click to `wa.me` | page path, link position |
| `email_click` | Mailto click | page path, link position |
| `phone_click` | Tel click | page path, link position |
| `assessment_start` | Assessment begins | page path |
| `assessment_complete` | Assessment produces result | priority band, workflow category; no sensitive text |
| `case_study_view` | Meaningful case-study view | case slug, source page |

Never place personal or sensitive lead details in analytics parameters.

## Content tracker

| Field | Purpose |
| --- | --- |
| URL | Canonical page |
| Cluster | AI automation, agents, WhatsApp, systems or industry |
| Primary query | One intended search intent |
| Author/reviewer | Accurate identity |
| Published | Original publish date |
| Reviewed | Last substantive review |
| Official sources | URLs and checked dates |
| Internal links in/out | Architecture check |
| Search clicks/impressions | Search Console |
| Leads/assists | GA4 and lead system |
| Next action | Refresh, improve links, consolidate or maintain |

## Backlink outreach tracker

| Prospect | URL | Category | Contact | Pitch | Sent | Follow-up | Status | Link URL | Referral leads |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  | Research |  |  |

Status values: `Research`, `Ready`, `Pitched`, `Follow-up`, `Accepted`, `Published`, `Declined`, `Not suitable`.

## Monthly report template

### 1. Outcome

- Qualified organic leads:
- Organic clicks:
- Non-brand clicks:
- Best converting organic landing pages:

### 2. What changed

- Pages improved:
- Articles published or refreshed:
- Links earned:
- Technical fixes:

### 3. Evidence

- Query/page winners:
- High-impression opportunities:
- Conversion issues:
- Core Web Vitals issues:

### 4. Next month

- P0:
- P1:
- P2:

### 5. Decisions needed

- Client permissions:
- Subject-matter input:
- Tool access:
- Development capacity:

## Manual setup checklist

- [ ] Export Search Console data for `www.wetakefwd.online`.
- [ ] Export Search Console data for `insights.wetakefwd.online`.
- [ ] Confirm GA4 property and GTM container ownership.
- [ ] Test every conversion in GA4 DebugView.
- [ ] Add the baseline to the monthly scorecard.
- [ ] Choose one keyword-data provider and document country/date.
- [ ] Choose one backlink tool or manual review process.
- [ ] Review the scorecard on the same date every month.

