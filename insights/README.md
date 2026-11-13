# Insights by WeTakeFwd

An independent editorial publication for technology, artificial intelligence and innovation. This Next.js application lives in `insights/` so it can deploy as a separate Vercel project at `insights.wetakefwd.online` while the existing WeTakeFwd site continues to use its current project and build.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Tiptap, Vercel Blob and Resend. Article, author and category content is stored in PostgreSQL. The homepage never invents published stories.

## Local setup

1. Use Node.js 20.19 or newer and a PostgreSQL database.
2. In this directory, run `npm ci`.
3. Copy `.env.example` to `.env.local` and set `DATABASE_URL` and `DIRECT_DATABASE_URL` (they may be the same for a local database). Never commit the values.
4. Run `npm run db:migrate`, then `npm run db:seed`.
5. Set `BOOTSTRAP_ADMIN_EMAIL` and a unique `BOOTSTRAP_ADMIN_PASSWORD` of at least 16 characters. Run `npm run admin:bootstrap` **once**, then remove the bootstrap password from the environment.
6. Run `npm run dev` and visit `http://localhost:3000`. Sign in at `/admin/login`.

The seed creates the eight categories and default settings. Add genuine authors and articles in the admin dashboard. An empty database shows editorial empty states.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL runtime connection, preferably pooled in production. |
| `DIRECT_DATABASE_URL` | Direct PostgreSQL connection for Prisma migrations, seed and bootstrap. |
| `SITE_URL` | Canonical publication origin; use `https://insights.wetakefwd.online` in production. |
| `RESEND_API_KEY` | Resend API key for newsletter confirmation emails. |
| `NEWSLETTER_FROM_EMAIL` | Verified sender address on a domain you control. |
| `BLOB_READ_WRITE_TOKEN` | Blob token if the connected store uses token authentication. Newer Vercel stores may use OIDC automatically. |
| `RATE_LIMIT_SECRET` | Long random secret for hashing IPs used in public form limits. |
| `CRON_SECRET` | Vercel Cron bearer token for scheduled publishing. |
| `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD` | Temporary one-time admin creation. Remove after bootstrap. |

Without Resend configuration, the newsletter form reports that subscriptions are unavailable; it does not claim mail was sent. Media upload requires a connected Blob store and will report an error if authentication is unavailable. Without a database, public empty states render, but admin and forms require PostgreSQL.

## Deploy on Vercel

1. Import the same GitHub repository as a **new** Vercel project. Set **Root Directory** to `insights`. Keep the existing marketing-site project untouched.
2. Provision PostgreSQL and set both database URLs in the new project's environment variables. Connect a public Vercel Blob store; use its automatic OIDC connection or add its token if the store uses token authentication. Verify a sending domain with Resend and set its key and sender address.
3. Set `SITE_URL`, `RATE_LIMIT_SECRET` and `CRON_SECRET`. The Vercel configuration runs scheduled publishing daily at 06:00 UTC; adjust the schedule for editorial needs.
4. Deploy. Run `npm run db:migrate` and `npm run db:seed` against the production database from a trusted environment. Run `npm run admin:bootstrap` once with temporary admin credentials. Remove the bootstrap password afterward.
5. Add `insights.wetakefwd.online` to the new Vercel project and create the DNS record specified by Vercel at your domain registrar. Verify the domain and HTTPS in Vercel.
6. Add the sitemap `https://insights.wetakefwd.online/sitemap.xml` to Google Search Console after domain verification. Search indexing and Google News inclusion are not guaranteed.

The confirmation flow sends a welcome email containing the subscriber's individual unsubscribe link. The admin can export **confirmed active** subscribers from `/admin/subscribers`. Bulk campaign sending is not included; an external campaign tool must manage its own unsubscribe links and suppression list before use.

## Editorial workflow

Create an author, upload a cover image in Media, then create an article. Save it as draft, publish it, or schedule it. Only `PUBLISHED` stories with a publication time in the past appear publicly. External contributor submissions remain private in the admin dashboard and never publish automatically. Editors can edit content; only admins can delete content, export subscribers and change site settings.

## Checks

Run `npm run typecheck`, `npm run lint`, `npm test`, `npx prisma validate`, and `npm run build`. The migration SQL is committed in `prisma/migrations/20261113_init/migration.sql`.
