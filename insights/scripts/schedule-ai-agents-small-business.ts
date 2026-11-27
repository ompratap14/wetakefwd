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
const quote = (...content: ReturnType<typeof text>[]) => ({ type: "blockquote", content: [paragraph(...content)] });
const item = (...content: ReturnType<typeof text>[]) => ({ type: "listItem", content: [paragraph(...content)] });
const bullets = (...content: ReturnType<typeof item>[]) => ({ type: "bulletList", content });
const numbers = (...content: ReturnType<typeof item>[]) => ({ type: "orderedList", content });

const slug = "ai-agents-for-small-business-india";
// 11:20 AM IST, ten minutes before the daily 11:30 AM publishing cron.
const scheduledFor = new Date("2026-11-28T05:50:00.000Z");

const body = {
  type: "doc",
  content: [
    paragraph(text("An AI agent is not simply a chatbot with a new label. A useful agent can understand a goal, use approved information, work with business tools, complete several connected steps and ask a person for help when the situation falls outside its authority.")),
    paragraph(text("For a small business, that can mean responding to an enquiry, checking a service area, creating a CRM record, preparing the next message and assigning the lead—without the owner moving the same information between four apps.")),
    paragraph(text("The opportunity is real, but so is the risk of building something impressive that nobody trusts. This guide explains where AI agents create value, what they cost, how to start safely and which work should remain human.")),
    quote(text("The best first agent does one useful job reliably. It does not try to run the entire business.")),

    heading("What is an AI agent for business?"),
    paragraph(text("Traditional automation follows predefined rules. If a form is submitted, create a contact. If an invoice is overdue, send a reminder. An AI agent can work with less structured information: interpret a request, choose from permitted actions, use tools and continue until it reaches a defined outcome or needs a person.")),
    paragraph(text("A business agent normally has five parts:")),
    bullets(
      item(text("Purpose: ", true), text("one clearly defined job and success condition")),
      item(text("Knowledge: ", true), text("approved services, policies, documents and customer context")),
      item(text("Tools: ", true), text("limited access to CRM, email, WhatsApp, calendars, documents or internal software")),
      item(text("Guardrails: ", true), text("permissions, rules, confidence thresholds and actions it must refuse")),
      item(text("Human handoff: ", true), text("a clear route to the responsible person with the full context attached")),
    ),

    heading("Seven AI agents small businesses can use"),
    heading("1. Lead response agent", 3),
    paragraph(text("This agent receives website, WhatsApp or campaign enquiries, identifies the customer’s need, asks only the necessary questions, creates or updates the CRM record and prepares the next response. High-value, unclear or sensitive enquiries go to a person.")),
    paragraph(text("Measure: first-response time, qualified leads, missed enquiries and conversion to the next step.")),

    heading("2. Appointment and booking agent", 3),
    paragraph(text("A booking agent can understand a natural-language request, check real availability, confirm a slot, send reminders and support rescheduling. Clinics, consultants, salons, repair services, schools and restaurants can begin here because the workflow is repeated and the outcome is easy to measure.")),
    paragraph(text("The calendar must remain the source of truth. An agent should never invent availability.")),

    heading("3. Customer support agent", 3),
    paragraph(text("A support agent answers approved routine questions, retrieves order or service information and creates a structured handoff when a person is required. Complaints, payments, legal questions and unusual requests should follow stricter escalation rules.")),
    paragraph(text("Measure: resolution rate, escalation quality, response time and customer satisfaction—not the number of messages sent.")),

    heading("4. Sales follow-up agent", 3),
    paragraph(text("This agent identifies leads waiting for action, drafts relevant follow-ups, schedules approved messages and stops when the customer replies, opts out or moves to another stage. It should use CRM context rather than sending the same sequence to everyone.")),
    paragraph(text("A follow-up agent helps consistency; it should not impersonate a salesperson or pressure customers.")),

    heading("5. Document operations agent", 3),
    paragraph(text("An agent can read forms, invoices, reports or applications, extract fields, compare them with defined rules and flag uncertain or missing information. A person approves exceptions before records or payments change.")),
    paragraph(text("This is especially useful when staff repeatedly copy information between documents, spreadsheets and business software.")),

    heading("6. Internal knowledge agent", 3),
    paragraph(text("Employees can ask a controlled agent about policies, service details, operating procedures and project information. The agent should cite the approved source and say when the answer is missing or outdated.")),
    paragraph(text("A knowledge agent often becomes more valuable after the business first cleans its documents and assigns an owner to every important policy.")),

    heading("7. Management reporting agent", 3),
    paragraph(text("A reporting agent collects permitted data from several tools, prepares a recurring summary, highlights unusual changes and links each number to its source. Leaders spend less time assembling information and more time deciding what to do.")),
    paragraph(text("The agent may explain a pattern, but accountable decisions remain with management.")),

    heading("Where an AI agent should not act alone"),
    bullets(
      item(text("Approving payments, refunds, credit or legally binding commitments")),
      item(text("Handling emergencies, medical decisions or high-risk safety matters")),
      item(text("Changing important customer data without confirmation")),
      item(text("Sending prices or promises it cannot verify")),
      item(text("Accessing broad systems when a narrow permission would be enough")),
      item(text("Continuing when its information is missing, contradictory or uncertain")),
    ),
    paragraph(text("NIST’s AI Risk Management Framework recommends managing risk across design, deployment and ongoing use. For a small business, the practical translation is simple: define the risk before giving the agent a tool.")),

    heading("How much does an AI agent cost in India?"),
    paragraph(text("A focused pilot can start around ₹1,00,000–₹3,00,000. A production agent connected to several systems, with permissions, monitoring and a custom interface, may range from ₹4,00,000 to ₹15,00,000 or more. Model usage, messaging, hosting, monitoring and ongoing support are recurring costs.")),
    paragraph(text("Price depends on workflow complexity, integrations, data readiness, risk, volume and the quality level expected. For detailed ranges and an ROI formula, read "), text("AI Automation Cost in India", true, "https://insights.wetakefwd.online/article/ai-automation-cost-india-2027-pricing-roi-guide", false), text(".")),
    paragraph(text("Treat these figures as planning ranges, not universal quotations. A useful proposal should separate discovery, implementation and recurring operations.")),

    heading("How to choose the first agent"),
    numbers(
      item(text("List repeated work. ", true), text("Look for enquiries, handoffs, document processing, reminders and reporting that happen every week.")),
      item(text("Measure the baseline. ", true), text("Record volume, time, delay, error rate, conversion and the people involved.")),
      item(text("Choose one outcome. ", true), text("For example: every genuine enquiry receives a useful response within five minutes.")),
      item(text("Map exceptions. ", true), text("Write down the cases that are ambiguous, sensitive or require approval.")),
      item(text("Limit permissions. ", true), text("Give the agent only the information and actions needed for that job.")),
      item(text("Define the handoff. ", true), text("Name the person or team that receives escalations and what context they need.")),
    ),
    paragraph(text("The "), text("30-minute automation audit", true, "https://insights.wetakefwd.online/article/30-minute-automation-audit-first-workflow", false), text(" can help compare several workflows before a build begins.")),

    heading("A safe 30-day pilot"),
    heading("Week 1: map and measure", 3),
    paragraph(text("Document the current workflow from trigger to outcome. Identify systems, data, owners, exceptions and the baseline metric. Remove unnecessary steps before automating anything.")),
    heading("Week 2: build the smallest useful version", 3),
    paragraph(text("Use one approved source of information, one or two tools and narrow permissions. Add logging and a human handoff from the beginning.")),
    heading("Week 3: test difficult cases", 3),
    paragraph(text("Test normal requests, unclear language, missing data, incorrect assumptions, repeated requests, angry customers and actions the agent must refuse. Employees who do the work today should participate.")),
    heading("Week 4: run with supervision", 3),
    paragraph(text("Launch to a controlled group or limited hours. Review activity daily, compare results with the baseline and fix the workflow before adding more autonomy.")),

    heading("How to measure whether the agent works"),
    bullets(
      item(text("Outcome rate: ", true), text("how often the intended job is completed correctly")),
      item(text("Escalation quality: ", true), text("whether the right cases reach a person with useful context")),
      item(text("Time saved: ", true), text("staff time removed from repetitive handling")),
      item(text("Accuracy and correction rate: ", true), text("how often a person must repair the agent’s work")),
      item(text("Customer result: ", true), text("response time, booking, resolution, conversion or satisfaction")),
      item(text("Operating cost: ", true), text("total monthly tools, usage, support and internal oversight")),
    ),
    paragraph(text("OpenAI’s business guidance recommends establishing a baseline for time, cost and accuracy, then measuring performance across multiple cycles. A successful demo is not the same as repeatable value.")),

    heading("Common mistakes"),
    bullets(
      item(text("Starting with a general-purpose agent instead of one job")),
      item(text("Connecting messy or contradictory business information")),
      item(text("Giving write access before read-only behaviour is reliable")),
      item(text("Hiding the agent’s identity from customers or employees")),
      item(text("Treating human escalation as failure instead of a safety feature")),
      item(text("Measuring conversations instead of business outcomes")),
      item(text("Launching without a named owner, logs or maintenance plan")),
    ),

    heading("Frequently asked questions"),
    heading("Can a small business afford an AI agent?", 3),
    paragraph(text("Yes, when the agent is tied to a repeated workflow with measurable value. Begin with one bounded job instead of funding a broad assistant with unclear return.")),
    heading("Does an AI agent need access to all business data?", 3),
    paragraph(text("No. It should receive the minimum information and permissions required for its purpose. Narrow access reduces risk and makes testing easier.")),
    heading("Is an AI agent the same as a chatbot?", 3),
    paragraph(text("A chatbot mainly holds a conversation. An agent can use tools and complete multiple steps toward an outcome. Some agents have a chat interface; others work behind the scenes.")),
    heading("Can an AI agent work with WhatsApp and a CRM?", 3),
    paragraph(text("Yes, when the business has approved WhatsApp access, a compatible CRM and a properly designed integration. The system should record consent, respect message rules and preserve a human handoff.")),
    heading("Will AI agents replace staff?", 3),
    paragraph(text("The strongest first use is removing repetitive handling while people retain judgement, relationships and accountability. The workflow should state clearly what the agent does and what people own.")),

    heading("The next move"),
    paragraph(text("AI agents can give a small business faster response, more consistent follow-up and better operational visibility. The advantage does not come from giving an agent maximum autonomy. It comes from choosing the right job, providing reliable information and designing the human role deliberately.")),
    paragraph(text("At WeTakeFwd, we design focused AI agents and connected workflows around the way Indian businesses actually operate. Explore "), text("AI agent development", true, "https://www.wetakefwd.online/ai-agent-development", false), text(" or start with one workflow that can be measured, controlled and improved.")),
  ],
};

async function schedule() {
  const author = await db.author.findUnique({ where: { slug: "wetakefwd-editorial-team" } });
  const category = await db.category.findUnique({ where: { slug: "artificial-intelligence" } });
  if (!author || !category) throw new Error("Editorial author or Artificial Intelligence category is missing");

  const tagNames = ["AI agents", "Small business", "AI agents India", "Business automation", "AI implementation"];
  const tags = await Promise.all(tagNames.map((name) => {
    const tagSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return db.tag.upsert({ where: { slug: tagSlug }, create: { name, slug: tagSlug }, update: { name } });
  }));

  const existing = await db.article.findUnique({ where: { slug } });
  const data = {
    title: "AI Agents for Small Business",
    subtitle: "Seven practical agents, realistic India pricing and a safe 30-day plan for turning repetitive work into a controlled system.",
    summary: "A practical 2027 guide to AI agents for small businesses in India: use cases, costs, implementation, safety, ROI and the first workflow to choose.",
    body: body as Prisma.InputJsonValue,
    coverImageUrl: "/images/ai-agents-small-business-india-2027.png",
    coverImageAlt: "Indian small-business owner using a laptop and smartphone while employees serve a customer",
    status: "SCHEDULED" as const,
    isFeatured: false,
    publishedAt: null,
    scheduledFor,
    seoTitle: "AI Agents for Small Business in India: 2027 Guide",
    seoDescription: "Learn how small businesses in India can use AI agents. Compare seven use cases, realistic costs, safety controls, ROI metrics and a 30-day pilot plan.",
    canonicalOverride: null,
    sources: [
      { title: "OpenAI — A practical guide to building AI agents", url: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/" },
      { title: "OpenAI — A business leader’s guide to working with agents", url: "https://cdn.openai.com/business-guides-and-resources/a-business-leaders-guide-to-working-with-agents.pdf" },
      { title: "NIST — AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
      { title: "Microsoft — Agentic AI maturity model: Business strategy", url: "https://learn.microsoft.com/en-us/agents/adoption-maturity-model/maturity-model-business-process" },
    ] as Prisma.InputJsonValue,
    authorId: author.id,
    categoryId: category.id,
  };

  const article = existing
    ? await db.article.update({ where: { slug }, data: { ...data, articleTags: { deleteMany: {}, create: tags.map(({ id }) => ({ tagId: id })) } } })
    : await db.article.create({ data: { slug, ...data, articleTags: { create: tags.map(({ id }) => ({ tagId: id })) } } });
  console.log(JSON.stringify({ id: article.id, slug: article.slug, status: article.status, scheduledFor: article.scheduledFor }));
}

try { await schedule(); } finally { await db.$disconnect(); }
