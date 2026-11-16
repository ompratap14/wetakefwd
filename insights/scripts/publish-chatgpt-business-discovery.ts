import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";

const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("Set DIRECT_DATABASE_URL or DATABASE_URL");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
const text = (value: string, bold = false, href?: string) => ({
  type: "text",
  text: value,
  ...(bold || href ? { marks: [
    ...(bold ? [{ type: "bold" }] : []),
    ...(href ? [{ type: "link", attrs: { href, target: "_blank", rel: "noopener noreferrer nofollow" } }] : []),
  ] } : {}),
});
const paragraph = (...content: ReturnType<typeof text>[]) => ({ type: "paragraph", content });
const heading = (value: string, level = 2) => ({ type: "heading", attrs: { level }, content: [text(value)] });
const item = (...content: ReturnType<typeof text>[]) => ({ type: "listItem", content: [paragraph(...content)] });
const bullets = (...content: ReturnType<typeof item>[]) => ({ type: "bulletList", content });
const numbers = (...content: ReturnType<typeof item>[]) => ({ type: "orderedList", content });

const slug = "chatgpt-businesses-ai-discovery-what-companies-should-do";
const body = {
  type: "doc",
  content: [
    paragraph(text("A new front door to the internet is taking shape. On 10 November 2026, OpenAI introduced Businesses in ChatGPT, a beta experience designed to let companies claim their identity, maintain business information and understand how people encounter them inside ChatGPT. For eligible businesses, a separate Business Agent can help prospective customers explore products or services through conversation.")),
    paragraph(text("The immediate headline is a product launch. "), text("The larger story is a change in discovery", true), text(": people are increasingly asking an AI system to compare options, explain trade-offs and recommend a next step instead of opening ten tabs and assembling the answer themselves.")),
    paragraph(text("For business leaders, the right response is not panic, a rushed chatbot or another round of keyword stuffing. It is to make the company’s information accurate, useful, attributable and easy for both people and machines to understand.")),

    heading("The news in one minute"),
    bullets(
      item(text("Business profiles: ", true), text("OpenAI says businesses can claim a profile and maintain information that may appear when people discover them in ChatGPT.")),
      item(text("Discovery insights: ", true), text("the Business Hub is designed to show aggregated signals such as mentions, website clicks and themes where a company’s website is cited, subject to privacy thresholds.")),
      item(text("Business Agents: ", true), text("eligible ecommerce and online-service businesses can offer a clearly separated conversational experience to help people understand their offerings.")),
      item(text("Availability matters: ", true), text("Business Agents are beginning with eligible businesses in the United States. OpenAI says it plans to expand to more markets and categories over time.")),
      item(text("This is not a shortcut to endorsement: ", true), text("a business-controlled agent is separate from ChatGPT’s independent answer, and sponsored placements are intended to be labelled.")),
    ),

    heading("Why this matters beyond ChatGPT"),
    paragraph(text("Search used to be mainly a list of links. The emerging interface is a conversation that can absorb a question, compare evidence and continue with follow-up questions. That compresses the distance between discovery, evaluation and action.")),
    paragraph(text("A customer may no longer ask only “AI automation company in Delhi.” They may ask: “Which agency can automate WhatsApp enquiries for a service business, keep a human approval step and integrate with our CRM?” The businesses most likely to be represented accurately are those that publish clear, specific and credible information about what they do, who they serve and how their work is controlled.")),
    paragraph(text("Microsoft’s recent analysis of nearly 500 AI transformation projects points in the same operational direction: begin with measurable value, redesign a workflow rather than automating an isolated task, and build governance and cost control from the start. The tools are changing quickly, but the business discipline is remarkably stable.")),

    heading("The mandatory foundation: one source of truth"),
    paragraph(text("Before building an agent, a company needs reliable information for an agent—or a customer—to use. Conflicting service descriptions, old pricing, missing policies and inconsistent contact details create the same problem everywhere: weak answers and weak trust.")),
    paragraph(text("Every business should establish a maintained source of truth covering:")),
    bullets(
      item(text("the official business name, website, contact routes and genuine operating locations;")),
      item(text("clear descriptions of services, eligibility, limitations and delivery areas;")),
      item(text("current policies, FAQs, timelines and escalation paths;")),
      item(text("named ownership for every important fact and a review date;")),
      item(text("evidence: real case studies, reviews, credentials and independently verifiable references.")),
    ),
    paragraph(text("Highlight: ", true), text("an AI discovery strategy begins with information quality, not an AI widget.")),

    heading("Six actions businesses should take now"),
    numbers(
      item(text("Audit how the company is described online. ", true), text("Compare the website, Google Business Profile, LinkedIn, major directories and review platforms. Correct genuine inconsistencies instead of copying a generic description everywhere.")),
      item(text("Answer buyer questions with evidence. ", true), text("Create pages and articles around real decisions: cost, process, fit, risk, implementation time and what remains human. Use specific examples without inventing outcomes.")),
      item(text("Make important pages technically clear. ", true), text("Use descriptive titles, one canonical URL, crawlable internal links, accessible content, structured data where appropriate and an accurate sitemap. Technical markup cannot create trust, but it can reduce ambiguity.")),
      item(text("Strengthen the entity behind the content. ", true), text("Publish a genuine company profile, responsible authors, contact information, editorial standards and transparent policies. A polished article with no accountable publisher is a weak signal.")),
      item(text("Measure qualified action. ", true), text("Track enquiries, calls, booked meetings and sales progression—not only rankings, mentions or traffic. Discovery matters when it produces a useful next step.")),
      item(text("Pilot one controlled agent workflow. ", true), text("Choose a narrow task, restrict its knowledge and tools, log what it does, define a human handoff and test difficult cases before expanding permissions.")),
    ),

    heading("What not to do"),
    bullets(
      item(text("Do not create dozens of nearly identical city pages that only swap the location name.")),
      item(text("Do not publish fake reviews, invented case studies or unsupported “best” claims.")),
      item(text("Do not let a customer-facing agent make commitments it cannot verify.")),
      item(text("Do not connect an agent to sensitive systems with broad permissions “for convenience.”")),
      item(text("Do not confuse being present in an AI interface with being independently recommended by it.")),
    ),
    paragraph(text("Mandatory control: ", true), text("every agent needs a named owner, a defined purpose, limited permissions, observable activity and a reliable route to a person.")),

    heading("A practical 90-day plan"),
    heading("Days 1–30: become understandable", 3),
    paragraph(text("Audit business information, correct contradictions, identify the ten questions prospects ask most often and improve the pages that should answer them. Confirm that analytics, Search Console, the sitemap and conversion events work.")),
    heading("Days 31–60: become credible", 3),
    paragraph(text("Publish one verifiable case study, collect authentic customer feedback, strengthen author and company profiles, and earn relevant mentions through partners, associations or expert contributions. Credibility is accumulated, not generated.")),
    heading("Days 61–90: become useful in conversation", 3),
    paragraph(text("Prototype a narrow assistant using approved information. Test routine, ambiguous and adversarial questions. Measure answer quality, escalation rate, response time and business outcome before allowing additional actions.")),

    heading("What this means for Indian businesses"),
    paragraph(text("The current Business Agent rollout is not a universal launch for Indian companies. That is precisely why preparation now is useful. Accurate business information, original expertise, genuine proof and controlled workflows improve the company’s position across search, AI discovery and direct customer conversations—regardless of which interface becomes dominant.")),
    paragraph(text("Companies should watch availability rather than imitate it. Claim an official profile only through the platform’s legitimate process when eligible, keep business facts current and treat any future agent as an extension of customer operations, not a marketing toy.")),

    heading("The bottom line"),
    paragraph(text("Businesses in ChatGPT is an early signal of a larger change: discovery is becoming conversational, and the distance between a question and an action is shrinking.")),
    paragraph(text("The companies that benefit will not simply be those that mention AI most often. They will be the companies with the clearest information, strongest evidence, most useful customer experience and safest operational design.")),
    paragraph(text("The winning question is no longer only, “How do we rank?” It is: "), text("“When an intelligent system explains our business, is the answer accurate, credible and genuinely helpful?”", true)),

    heading("Sources"),
    bullets(
      item(text("OpenAI — Introducing Businesses in ChatGPT", false, "https://openai.com/index/introducing-businesses-chatgpt/")),
      item(text("Microsoft — From AI ambition to business impact", false, "https://blogs.microsoft.com/blog/2026/11/12/from-ai-ambition-to-business-impact/")),
      item(text("OpenAI — A business leader’s guide to working with agents", false, "https://cdn.openai.com/business-guides-and-resources/a-business-leaders-guide-to-working-with-agents.pdf")),
    ),
  ],
};

async function publish() {
  const author = await db.author.findUnique({ where: { slug: "wetakefwd-editorial-team" } });
  const category = await db.category.findUnique({ where: { slug: "artificial-intelligence" } });
  if (!author || !category) throw new Error("Editorial author or Artificial Intelligence category is missing");

  const tagNames = ["AI discovery", "Business agents", "ChatGPT", "AI strategy", "Responsible AI"];
  const tags = await Promise.all(tagNames.map((name) => db.tag.upsert({
    where: { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") },
    create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") },
    update: { name },
  })));
  const existing = await db.article.findUnique({ where: { slug } });
  await db.article.updateMany({ where: { isFeatured: true, slug: { not: slug } }, data: { isFeatured: false } });
  const data = {
    title: "ChatGPT Is Becoming a Business Discovery Channel. What Companies Should Do Now",
    subtitle: "OpenAI’s new business profiles and agents point to a future where discovery, evaluation and action happen in one conversation.",
    summary: "OpenAI has introduced Businesses in ChatGPT. Here is what the shift toward AI-powered business discovery means—and the six actions companies should take now.",
    body: body as Prisma.InputJsonValue,
    coverImageUrl: "/images/chatgpt-business-discovery-2026.png",
    coverImageAlt: "Editorial illustration showing search, maps and websites flowing through an AI conversation into verified business information and customer actions",
    status: "PUBLISHED" as const,
    isFeatured: true,
    publishedAt: existing?.publishedAt || new Date(),
    scheduledFor: null,
    seoTitle: "Businesses in ChatGPT: What Companies Should Do Now",
    seoDescription: "OpenAI's Businesses in ChatGPT signals a shift to AI-powered discovery. Learn the six practical actions businesses should take to prepare.",
    canonicalOverride: null,
    sources: [
      { title: "Introducing Businesses in ChatGPT", url: "https://openai.com/index/introducing-businesses-chatgpt/" },
      { title: "From AI ambition to business impact", url: "https://blogs.microsoft.com/blog/2026/11/12/from-ai-ambition-to-business-impact/" },
      { title: "A business leader’s guide to working with agents", url: "https://cdn.openai.com/business-guides-and-resources/a-business-leaders-guide-to-working-with-agents.pdf" },
    ] as Prisma.InputJsonValue,
    authorId: author.id,
    categoryId: category.id,
  };
  const article = existing
    ? await db.article.update({ where: { slug }, data: { ...data, articleTags: { deleteMany: {}, create: tags.map(({ id }) => ({ tagId: id })) } } })
    : await db.article.create({ data: { slug, ...data, articleTags: { create: tags.map(({ id }) => ({ tagId: id })) } } });
  console.log(JSON.stringify({ id: article.id, slug: article.slug, status: article.status, featured: article.isFeatured }));
}

try { await publish(); } finally { await db.$disconnect(); }
