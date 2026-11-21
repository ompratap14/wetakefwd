import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";

const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("Set DIRECT_DATABASE_URL or DATABASE_URL");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
const text = (value: string, bold = false, italic = false) => ({
  type: "text",
  text: value,
  ...(bold || italic ? { marks: [
    ...(bold ? [{ type: "bold" }] : []),
    ...(italic ? [{ type: "italic" }] : []),
  ] } : {}),
});
const paragraph = (...content: ReturnType<typeof text>[]) => ({ type: "paragraph", content });
const heading = (value: string, level = 2) => ({ type: "heading", attrs: { level }, content: [text(value)] });
const quote = (...content: ReturnType<typeof text>[]) => ({ type: "blockquote", content: [paragraph(...content)] });
const item = (...content: ReturnType<typeof text>[]) => ({ type: "listItem", content: [paragraph(...content)] });
const bullets = (...content: ReturnType<typeof item>[]) => ({ type: "bulletList", content });

const slug = "whatsapp-automations-small-business-start-first";
const scheduledFor = new Date("2026-11-22T05:55:00.000Z");
const body = {
  type: "doc",
  content: [
    paragraph(text("Most small businesses do not have a lead problem. They have a follow-up problem.")),
    paragraph(text("A customer sends a message while the owner is serving someone else. A booking request gets buried. A payment reminder goes out late. None of these moments looks dramatic, but together they cost time, trust and revenue.")),
    paragraph(text("WhatsApp automation can close those gaps—if it is designed around the real workflow rather than used as a machine for sending more messages.")),
    quote(text("The goal is not to automate every conversation. ", true), text("It is to make sure every customer gets the right next step, while a person remains easy to reach.")),

    heading("Before you automate: map one customer journey"),
    paragraph(text("Choose one common journey, such as enquiry to appointment or order to delivery. Write down what happens today, where people wait and which questions repeat. That map tells you what to automate first.")),
    paragraph(text("A useful first workflow should have four things:")),
    bullets(
      item(text("a clear trigger", true), text(", such as a new enquiry or an upcoming appointment;")),
      item(text("one useful response", true), text(", not a long menu of unrelated options;")),
      item(text("a recorded next step", true), text(" in a CRM, sheet or booking system;")),
      item(text("a visible human handoff", true), text(" whenever the customer asks for help.")),
    ),

    heading("1. Welcome and route every new enquiry"),
    paragraph(text("An instant welcome message should confirm that the enquiry has arrived and help the customer reach the right path. A clinic may offer appointments, reports and billing. A school may offer admissions, fees and parent support. A restaurant may offer reservations, delivery and event enquiries.")),
    paragraph(text("Keep the choices short. If the system cannot understand the request, move it to a person instead of trapping the customer in a loop.")),
    quote(text("Best first outcome: ", true), text("no genuine enquiry is left wondering whether anyone received it.")),

    heading("2. Qualify leads without interrogating people"),
    paragraph(text("A good qualification flow asks only what the team needs to take the next action: service required, location, preferred time and perhaps a budget range. It should feel like useful preparation, not a form disguised as a conversation.")),
    paragraph(text("Once the answers arrive, the system can create a lead, assign an owner and mark the priority. The sales team starts with context instead of asking the customer to repeat everything.")),

    heading("3. Book and reschedule appointments"),
    paragraph(text("For clinics, salons, consultants, repair services and restaurants, booking is one of the clearest places to begin. The customer chooses from genuinely available times, receives confirmation and can reschedule without a chain of calls.")),
    paragraph(text("The important detail is connection: the conversation, calendar and staff view must agree. An automated message that offers an unavailable slot creates more work than it removes.")),

    heading("4. Send useful reminders"),
    paragraph(text("Reminders work when they arrive at the right moment and include a clear action. Appointment reminders should allow confirmation or rescheduling. Fee and payment reminders should explain the amount, due date and trusted payment route. Service reminders should make booking the next step easy.")),
    paragraph(text("Give customers sensible frequency controls and stop reminders as soon as the action is complete. Repeating an outdated reminder is one of the fastest ways to lose trust.")),

    heading("5. Share order and service updates automatically"),
    paragraph(text("Customers should not have to ask, “What is happening with my order?” A small set of event-based updates—confirmed, in progress, ready, dispatched or completed—can remove a large volume of repetitive calls.")),
    paragraph(text("Send updates only when the underlying status changes. Automation should report reality, not generate reassuring messages that the operations team cannot support.")),

    heading("6. Make payment follow-up easier"),
    paragraph(text("Automation can send a secure payment link, acknowledge a received payment and flag an overdue account for personal follow-up. It should never ask customers to share passwords, PINs or one-time codes in chat.")),
    paragraph(text("For sensitive or disputed payments, route the conversation to a trained person. The purpose of automation is to remove routine chasing—not to automate judgement.")),

    heading("7. Follow up after the service"),
    paragraph(text("The end of a transaction is a valuable moment. Ask whether the customer received what they needed, offer support, and request feedback only after confirming satisfaction. A later re-engagement message can be useful when it is relevant and permission-based.")),
    paragraph(text("Avoid sending the same promotion to every contact. A smaller, timely message based on a real customer need will outperform a broadcast that teaches people to mute the business.")),

    heading("Human handoff is not the eighth automation—it belongs in all seven"),
    paragraph(text("Every automated path needs an escape route. Customers should be able to type a natural request such as “talk to someone,” and staff should receive the conversation history, captured details and reason for escalation.")),
    quote(text("A successful handoff means the customer does not have to start again.")),

    heading("A sensible 30-day rollout"),
    heading("Week 1: measure the current process", 3),
    paragraph(text("Count enquiry volume, response time, missed follow-ups and the questions staff answer repeatedly. Pick one workflow with visible value and manageable risk.")),
    heading("Week 2: build the smallest useful version", 3),
    paragraph(text("Create the trigger, response, data capture and human handoff. Use real language from customer conversations, including the Hindi-English mix your audience naturally uses.")),
    heading("Week 3: test with the team", 3),
    paragraph(text("Test normal requests, incomplete answers, spelling variations, angry customers and situations the automation should refuse. Make ownership clear when a conversation reaches a person.")),
    heading("Week 4: launch narrowly and improve", 3),
    paragraph(text("Start with a limited audience or business hours. Review conversations daily. Improve the workflow based on confusion and drop-off rather than adding features because they look impressive.")),

    heading("Measure outcomes, not message volume"),
    paragraph(text("Track the numbers connected to the business problem:")),
    bullets(
      item(text("time to first useful response;")),
      item(text("percentage of enquiries reaching a clear next step;")),
      item(text("bookings completed and no-shows reduced;")),
      item(text("payments completed after a reminder;")),
      item(text("handoff rate and time to human response;")),
      item(text("opt-outs, complaints and failed conversations.")),
    ),
    paragraph(text("More automated messages are not automatically better. The strongest system often sends fewer messages, with better timing and clearer purpose.")),

    heading("Where to start tomorrow"),
    paragraph(text("Choose the one customer message your team receives most often. Design a response that resolves it or moves it forward. Connect that response to the place where your team already works, and add a human handoff before you add anything else.")),
    paragraph(text("That single workflow will teach you more than a large automation plan on a slide.")),
    paragraph(text("At WeTakeFwd, we help Indian businesses design WhatsApp, CRM and AI workflows around the way their teams and customers actually work. The technology matters—but the useful outcome comes first.", true)),
  ],
};

async function schedule() {
  const author = await db.author.findUnique({ where: { slug: "wetakefwd-editorial-team" } });
  const category = await db.category.findUnique({ where: { slug: "business-technology" } });
  if (!author || !category) throw new Error("Editorial author or Business & Technology category is missing");

  const tagNames = ["WhatsApp Automation", "Small Business", "Customer Experience", "CRM", "MSME", "Business Automation"];
  const tags = await Promise.all(tagNames.map((name) => {
    const tagSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return db.tag.upsert({ where: { slug: tagSlug }, create: { name, slug: tagSlug }, update: { name } });
  }));
  const existing = await db.article.findUnique({ where: { slug } });
  const data = {
    title: "7 WhatsApp Automations Every Small Business Should Set Up First",
    subtitle: "A practical guide to faster replies, better follow-up and automation that always leaves room for a person.",
    summary: "Seven practical WhatsApp automations that help small businesses respond faster, reduce missed follow-ups and give customers a clear next step.",
    body: body as Prisma.InputJsonValue,
    coverImageUrl: "/images/whatsapp-automations-small-business.png",
    coverImageAlt: "An Indian small-business owner reviewing seven connected customer messaging workflows around a smartphone",
    status: "SCHEDULED" as const,
    isFeatured: false,
    publishedAt: null,
    scheduledFor,
    seoTitle: "7 WhatsApp Automations for Small Businesses | WeTakeFwd",
    seoDescription: "Discover seven practical WhatsApp automations for enquiries, bookings, reminders, payments, updates and customer follow-up.",
    canonicalOverride: null,
    sources: [] as Prisma.InputJsonValue,
    authorId: author.id,
    categoryId: category.id,
  };
  const article = existing
    ? await db.article.update({ where: { slug }, data: { ...data, articleTags: { deleteMany: {}, create: tags.map(({ id }) => ({ tagId: id })) } } })
    : await db.article.create({ data: { slug, ...data, articleTags: { create: tags.map(({ id }) => ({ tagId: id })) } } });
  console.log(JSON.stringify({ id: article.id, slug: article.slug, status: article.status, scheduledFor: article.scheduledFor }));
}

try { await schedule(); } finally { await db.$disconnect(); }
