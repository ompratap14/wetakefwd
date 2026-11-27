import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";

const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("Set DIRECT_DATABASE_URL or DATABASE_URL");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
const text = (value: string, bold = false, href?: string, external = true) => ({
  type: "text",
  text: value,
  ...(bold || href ? { marks: [
    ...(bold ? [{ type: "bold" }] : []),
    ...(href ? [{ type: "link", attrs: { href, target: external ? "_blank" : "_self", rel: external ? "noopener noreferrer" : "" } }] : []),
  ] } : {}),
});
const paragraph = (...content: ReturnType<typeof text>[]) => ({ type: "paragraph", content });
const heading = (value: string, level = 2) => ({ type: "heading", attrs: { level }, content: [text(value)] });
const item = (...content: ReturnType<typeof text>[]) => ({ type: "listItem", content: [paragraph(...content)] });
const bullets = (...content: ReturnType<typeof item>[]) => ({ type: "bulletList", content });
const numbers = (...content: ReturnType<typeof item>[]) => ({ type: "orderedList", content });

const slug = "ai-automation-cost-india-2027-pricing-roi-guide";
const body = {
  type: "doc",
  content: [
    paragraph(text("AI automation in India can cost less than a new hire, more than a small software project, or anything in between. The useful answer is not a single market price. It is a clear view of the workflow, the systems involved, the risk of mistakes and the business result the automation is expected to create.")),
    paragraph(text("For most small and mid-sized businesses, a sensible first project falls between ₹75,000 and ₹2,50,000. More complex systems that connect a CRM, WhatsApp, documents, internal approvals and reporting can range from ₹2,50,000 to ₹8,00,000 or more. A production-grade AI agent with custom integrations, permissions, monitoring and ongoing improvement may require a larger investment.")),
    paragraph(text("These are planning ranges—not fixed quotations or promises. This guide explains what changes the price, what should be included, how to estimate return on investment and how to avoid paying for an impressive demo that never becomes reliable business infrastructure.")),

    heading("AI automation cost in India: quick answer"),
    bullets(
      item(text("Workflow audit and implementation plan: ", true), text("₹25,000–₹75,000")),
      item(text("One focused automation: ", true), text("₹75,000–₹2,50,000")),
      item(text("Multi-system business workflow: ", true), text("₹2,50,000–₹8,00,000")),
      item(text("Custom AI agent or operations system: ", true), text("₹4,00,000–₹15,00,000+")),
      item(text("Ongoing monitoring, support and improvement: ", true), text("₹15,000–₹1,50,000+ per month")),
    ),
    paragraph(text("The best first budget is usually the smallest amount that can deliver one measurable outcome safely. ", true), text("Do not begin by automating the entire business.")),

    heading("What counts as AI automation?"),
    paragraph(text("AI automation combines ordinary workflow logic with AI where judgement, language or unstructured information is involved. Traditional automation follows a defined rule: when a form is submitted, create a CRM record. AI can add a less predictable step: understand the enquiry, classify its intent, extract important details, draft a response and decide whether a person should review it.")),
    paragraph(text("Common examples for Indian businesses include WhatsApp lead qualification, enquiry routing, document extraction, proposal drafting, appointment reminders, customer-support triage, invoice processing, school communication, sales follow-up and management reporting.")),
    paragraph(text("A useful system normally includes more than a model subscription. It needs workflow design, integrations, permissions, approved knowledge, exception handling, logs, testing, monitoring and a human handoff.")),

    heading("Why prices vary so much"),
    heading("1. The workflow itself", 3),
    paragraph(text("A three-step reminder workflow is cheaper than a process with ten branches, multiple approvals and different rules for each customer type. Price grows with the number of decisions, exceptions and failure paths—not only with the number of screens.")),
    heading("2. The systems that must connect", 3),
    paragraph(text("An automation that works inside one tool is simpler than one that connects WhatsApp, a website, spreadsheets, email, a CRM, accounting software and an internal dashboard. Reliable integrations require authentication, field mapping, rate-limit handling, retries and testing.")),
    heading("3. Data readiness", 3),
    paragraph(text("If service information, customer records and policies are inconsistent, the project must first create a dependable source of truth. Cleaning and structuring information can be more valuable—and more time-consuming—than the AI layer itself.")),
    heading("4. Risk and human control", 3),
    paragraph(text("Drafting an internal summary has a lower risk than sending a price, approving a refund or changing a customer record. Higher-risk actions need stronger permissions, review steps, audit logs, monitoring and rollback plans.")),
    heading("5. Volume and performance", 3),
    paragraph(text("A pilot handling 100 enquiries per month has different infrastructure needs from a system processing thousands of conversations, documents or API calls every day. Model usage, messaging charges, hosting and third-party tools become recurring costs.")),
    heading("6. The quality bar", 3),
    paragraph(text("A prototype proves that an idea can work. Production software must continue working when information is missing, users are unclear, an API fails or the AI produces an uncertain answer. Testing and observability are part of the product, not optional extras.")),

    heading("Typical pricing models"),
    numbers(
      item(text("Fixed-scope project. ", true), text("Best when the workflow, integrations and acceptance criteria are clear. It gives budget certainty but requires disciplined change control.")),
      item(text("Discovery followed by implementation. ", true), text("A paid audit maps the workflow, establishes a baseline and produces a technical plan before a build price is agreed. This is often the safest approach for a first automation.")),
      item(text("Monthly improvement retainer. ", true), text("Useful after launch when the system needs monitoring, prompt and rule refinement, new integrations, reporting and support.")),
      item(text("Usage-based platform fee. ", true), text("The business pays according to conversations, messages, documents, model tokens or completed tasks. Ask what happens when volume increases.")),
      item(text("Internal build. ", true), text("Software subscriptions may look inexpensive, but the real cost includes staff time, integration work, security, testing, maintenance and ownership when the original builder leaves.")),
    ),

    heading("A realistic cost breakdown"),
    paragraph(text("A responsible proposal should separate one-time implementation from recurring operating cost. A focused ₹1,50,000 project might allocate effort roughly across discovery and workflow design, integration, AI behaviour, interface or reporting, testing, deployment and training. The exact percentages will change, but every category should exist.")),
    bullets(
      item(text("Discovery: ", true), text("current process, baseline, desired result and exception map")),
      item(text("Build: ", true), text("workflow logic, integrations, prompts, retrieval and data handling")),
      item(text("Control: ", true), text("permissions, human approval, logs, error recovery and escalation")),
      item(text("Validation: ", true), text("routine, ambiguous, incorrect and adversarial test cases")),
      item(text("Adoption: ", true), text("staff training, operating guide, ownership and measurement")),
      item(text("Operations: ", true), text("hosting, APIs, messaging, monitoring, support and improvement")),
    ),
    paragraph(text("If a quotation includes only “AI development” and a total price, ask for the missing detail.")),

    heading("How to calculate ROI before you build"),
    paragraph(text("OpenAI’s business guidance recommends establishing a baseline for time, cost and accuracy before measuring an agent. That principle matters because automation value is impossible to prove when nobody knows the current performance.")),
    paragraph(text("A simple annual value estimate is:")),
    paragraph(text("Hours saved per month × fully loaded hourly cost × 12", true)),
    paragraph(text("Then add measurable gains such as leads recovered, faster collections, reduced errors or improved capacity. Subtract implementation and annual operating cost. Keep the assumptions conservative.")),
    paragraph(text("Example: a team spends 120 hours each month qualifying enquiries and preparing follow-ups. If automation safely removes 60 hours at an estimated loaded cost of ₹350 per hour, the direct annual capacity value is ₹2,52,000. If it also recovers two additional sales each month, the commercial value may be higher—but only count it when conversion data supports the assumption.")),
    paragraph(text("ROI is not only labour reduction. Faster response, better consistency, fewer missed enquiries and improved visibility can matter more. But every claimed benefit needs a metric and an owner.")),

    heading("What should a small business automate first?"),
    paragraph(text("Choose a workflow that is repeated often, follows a recognisable pattern, has a visible cost and can be checked by a person. The first project should be important enough to matter but bounded enough to learn safely.")),
    bullets(
      item(text("Lead response: ", true), text("capture, classify, assign and prepare a personalised first reply")),
      item(text("WhatsApp follow-up: ", true), text("send approved reminders and hand replies to the right person")),
      item(text("Document operations: ", true), text("extract fields, validate rules and flag uncertain records")),
      item(text("Customer support: ", true), text("answer approved questions and escalate complaints, payments or unusual requests")),
      item(text("Reporting: ", true), text("combine activity from multiple sources into a scheduled management summary")),
    ),
    paragraph(text("Use the "), text("30-minute automation audit", true, "https://insights.wetakefwd.online/article/30-minute-automation-audit-first-workflow", false), text(" to compare candidate workflows before asking for estimates.")),

    heading("Hidden costs to include in the budget"),
    bullets(
      item(text("API, model and WhatsApp conversation charges")),
      item(text("CRM, automation platform, database and hosting subscriptions")),
      item(text("Data cleaning and migration")),
      item(text("Security review, access management and compliance work")),
      item(text("Monitoring, incident handling and backups")),
      item(text("Training and process changes for staff")),
      item(text("Maintenance when third-party APIs or business rules change")),
    ),
    paragraph(text("The cheapest build can become the most expensive system if nobody owns it after launch.")),

    heading("Red flags in an AI automation proposal"),
    bullets(
      item(text("A guaranteed ROI without examining the existing workflow or baseline")),
      item(text("A promise to automate everything in the first phase")),
      item(text("No description of human approval, uncertainty or escalation")),
      item(text("No separation between implementation cost and recurring usage")),
      item(text("No plan for logs, monitoring, testing or API failures")),
      item(text("No clarity about who owns the data, accounts, prompts and source code")),
      item(text("A demo built on perfect examples with no difficult-case testing")),
    ),
    paragraph(text("NIST’s AI Risk Management Framework is voluntary, but its core idea is valuable for businesses of every size: identify risks in context, measure them and manage them throughout the system lifecycle—not only at launch.")),

    heading("A practical 90-day implementation plan"),
    heading("Days 1–15: measure and choose", 3),
    paragraph(text("Map the workflow, count monthly volume, record time and error rate, identify every system involved and choose one measurable outcome. Decide which actions always require a person.")),
    heading("Days 16–45: build the controlled pilot", 3),
    paragraph(text("Connect only the necessary systems, use approved information, restrict permissions and test routine and difficult examples. Keep the pilot visible to the people who perform the work today.")),
    heading("Days 46–75: operate and observe", 3),
    paragraph(text("Run the workflow with real cases, compare performance with the baseline and record failures, overrides and escalation reasons. Improve the process rather than hiding weak results.")),
    heading("Days 76–90: decide whether to scale", 3),
    paragraph(text("Expand only when the workflow delivers repeatable value and the team can operate it safely. The next investment may be more volume, another integration or a second workflow—not necessarily more AI.")),

    heading("Frequently asked questions"),
    heading("How much does AI automation cost for a small business in India?", 3),
    paragraph(text("A focused first implementation commonly requires ₹75,000–₹2,50,000, while a discovery exercise may begin around ₹25,000. Complexity, integrations, risk, data readiness and volume can move the price substantially.")),
    heading("Can AI automation be done for ₹20,000?", 3),
    paragraph(text("A narrow no-code prototype may fit that budget, especially when no custom integration or sensitive action is involved. It is unlikely to cover a dependable multi-system production workflow with testing, monitoring and support.")),
    heading("How long does implementation take?", 3),
    paragraph(text("A focused pilot can take three to eight weeks. Multi-system workflows often take two to four months, particularly when data cleaning, permissions and process changes are required.")),
    heading("Will AI automation replace employees?", 3),
    paragraph(text("The strongest first projects remove repetitive steps and give people better context. Human judgement remains essential for exceptions, sensitive decisions, relationships and accountability.")),
    heading("What is the biggest cause of failed automation projects?", 3),
    paragraph(text("Starting with the tool instead of the workflow. Automating a broken or unmeasured process can make the confusion move faster without improving the outcome.")),

    heading("The bottom line"),
    paragraph(text("AI automation cost in India should be evaluated against one clearly measured business workflow, not against a list of fashionable features. A smaller system with reliable integrations, clear ownership and human control is more valuable than an ambitious agent nobody trusts.")),
    paragraph(text("Begin with a baseline. Choose one outcome. Include operations and risk in the budget. Then scale only after the evidence shows that the system saves time, improves quality or creates additional capacity.")),
    paragraph(text("If you want to map the first workflow and receive a practical implementation plan, explore "), text("AI automation with WeTakeFwd", true, "https://www.wetakefwd.online/best-ai-automation-company-india", false), text(".")),
  ],
};

async function publish() {
  const author = await db.author.findUnique({ where: { slug: "wetakefwd-editorial-team" } });
  const category = await db.category.findUnique({ where: { slug: "artificial-intelligence" } });
  if (!author || !category) throw new Error("Editorial author or Artificial Intelligence category is missing");

  const tagNames = ["AI automation cost", "AI automation India", "AI ROI", "Small business automation", "AI implementation"];
  const tags = await Promise.all(tagNames.map((name) => {
    const tagSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return db.tag.upsert({ where: { slug: tagSlug }, create: { name, slug: tagSlug }, update: { name } });
  }));

  const existing = await db.article.findUnique({ where: { slug } });
  await db.article.updateMany({ where: { isFeatured: true, slug: { not: slug } }, data: { isFeatured: false } });
  const data = {
    title: "AI Automation Cost in India: 2027 Pricing, ROI and Implementation Guide",
    subtitle: "A transparent guide to project costs, recurring fees, ROI calculation and choosing the first workflow worth automating.",
    summary: "AI automation in India typically starts at ₹75,000 for a focused workflow. Compare realistic 2027 price ranges, hidden costs, ROI and implementation steps.",
    body: body as Prisma.InputJsonValue,
    coverImageUrl: "/images/ai-automation-cost-india-2027.png",
    coverImageAlt: "Indian business professionals reviewing an AI automation cost and performance plan in an office",
    status: "PUBLISHED" as const,
    isFeatured: true,
    publishedAt: existing?.publishedAt || new Date(),
    scheduledFor: null,
    seoTitle: "AI Automation Cost in India (2027 Pricing Guide)",
    seoDescription: "How much does AI automation cost in India? Compare 2027 project prices, monthly fees, hidden costs, ROI calculations and implementation timelines.",
    canonicalOverride: null,
    sources: [
      { title: "OpenAI — A business leader’s guide to working with agents", url: "https://cdn.openai.com/business-guides-and-resources/a-business-leaders-guide-to-working-with-agents.pdf" },
      { title: "OpenAI — A practical guide to building AI agents", url: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/" },
      { title: "NIST — AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
      { title: "Microsoft — AI implementation strategy", url: "https://www.microsoft.com/en-us/ai/ai-101/implementation-strategy" },
    ] as Prisma.InputJsonValue,
    authorId: author.id,
    categoryId: category.id,
  };

  const article = existing
    ? await db.article.update({ where: { slug }, data: { ...data, articleTags: { deleteMany: {}, create: tags.map(({ id }) => ({ tagId: id })) } } })
    : await db.article.create({ data: { slug, ...data, articleTags: { create: tags.map(({ id }) => ({ tagId: id })) } } });
  console.log(JSON.stringify({ id: article.id, slug: article.slug, status: article.status, featured: article.isFeatured, publishedAt: article.publishedAt }));
}

try { await publish(); } finally { await db.$disconnect(); }
