import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";

const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("Set DIRECT_DATABASE_URL or DATABASE_URL");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
const text = (value: string, bold = false, href?: string, external = true) => ({
  type: "text", text: value,
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

const slug = "ai-voice-agents-business-india-cost-guide";
const body = {
  type: "doc",
  content: [
    paragraph(text("An AI voice agent can answer or place a phone call, understand what the other person says, retrieve approved information, use business tools and decide when a person should take over. For an Indian business, that can mean confirming an appointment after hours, qualifying an enquiry, sharing an order update or routing a service request without keeping a customer in a queue.")),
    paragraph(text("The technology is becoming easier to buy. The difficult questions are operational: "), text("Which calls should be automated? What does one completed call really cost? What information may the agent use? And where must a person remain responsible?", true)),
    paragraph(text("This guide gives business owners a practical way to evaluate AI voice agents in India. Pricing and regulations change, so verify current provider rates and obtain appropriate legal or compliance advice for your use case before launch.")),
    quote(text("A voice agent is valuable when it completes one controlled call outcome reliably—not when it merely sounds human.")),

    heading("What is an AI voice agent?"),
    paragraph(text("A traditional IVR asks the caller to press a number. A scripted voice bot follows a narrow decision tree. An AI voice agent can work with varied language, maintain context and use tools while pursuing a defined outcome.")),
    paragraph(text("A production voice agent normally combines five layers:")),
    bullets(
      item(text("Telephony: ", true), text("the phone number, carrier connection, routing and call recording configuration.")),
      item(text("Speech recognition: ", true), text("turning the caller’s speech into text across accents, languages and noisy environments.")),
      item(text("Agent logic: ", true), text("instructions, knowledge, tools, permissions and the decision process for each call.")),
      item(text("Voice generation: ", true), text("turning the response into natural speech at a usable speed.")),
      item(text("Business integration: ", true), text("calendar, CRM, ticketing, payment status, order data or another approved system.")),
    ),
    paragraph(text("If the system only answers a static list of questions, a simpler voice bot may be enough. An agent becomes useful when the workflow requires interpretation and several connected steps.")),

    heading("Where businesses can use voice agents"),
    heading("1. Appointment booking and reminders", 3),
    paragraph(text("Clinics, diagnostic centres, salons, consultants and service businesses can use an agent to check actual availability, confirm a slot, send the record to the calendar and transfer unusual requests to reception. It must never invent availability or provide medical advice.")),
    heading("2. Lead qualification", 3),
    paragraph(text("An agent can call an opted-in lead, ask a small set of relevant questions, record the answers in a CRM and assign qualified opportunities. The goal is not to pressure a prospect; it is to make the next human conversation better informed.")),
    heading("3. Order and service updates", 3),
    paragraph(text("Customers can check a delivery, installation or repair status without waiting for an operator. The agent should retrieve the status from the source system and transfer the call when records are missing or disputed.")),
    heading("4. Payment reminders", 3),
    paragraph(text("A controlled agent can communicate an approved reminder and offer a route to a person. It should not negotiate, threaten, disclose information to the wrong recipient or make an unverified financial commitment.")),
    heading("5. Customer support triage", 3),
    paragraph(text("The agent can identify the issue, collect the account or order reference, answer routine questions and create a structured ticket. Complaints, safety issues, cancellations, refunds and emotionally difficult conversations need clear escalation rules.")),

    heading("How much does an AI voice agent cost in India?"),
    paragraph(text("There is no single per-minute number. A quote can include only the AI platform while excluding telephony, phone numbers, recording, CRM work, setup, testing and ongoing monitoring.")),
    paragraph(text("As one current reference point, Sarvam’s official India pricing listed end-to-end voice-agent usage from ₹3.50 per minute on pay-as-you-go to ₹3.15 per minute on its Growth plan when checked on 28 November 2026. Sarvam states that telephony and phone numbers are additional. Twilio’s official India page separately prices outbound calling, recordings, transcription, media streaming and other voice services. These examples show why two advertised rates may not describe the same system.")),
    paragraph(text("Treat provider rates as time-sensitive examples, not a universal market price. Verify them on the vendor’s current page before budgeting.")),

    heading("The seven parts of the real cost"),
    numbers(
      item(text("Agent minutes. ", true), text("Usually measured in connected minutes and sometimes rounded into billing pulses.")),
      item(text("Telephony. ", true), text("Outbound or inbound call charges, phone numbers, SIP or carrier fees.")),
      item(text("Platform commitment. ", true), text("Monthly minimums, credits, concurrency and calls-per-minute limits.")),
      item(text("Implementation. ", true), text("Conversation design, integrations, knowledge preparation, testing and analytics.")),
      item(text("Recording and data. ", true), text("Storage, transcription, retention, access control and deletion.")),
      item(text("Monitoring. ", true), text("Reviewing failed calls, changing instructions, checking integrations and handling incidents.")),
      item(text("Human operations. ", true), text("The people who receive escalations, review quality and own the outcome.")),
    ),
    paragraph(text("A useful monthly model is: "), text("connected minutes × complete per-minute usage + telephony + platform fee + monitoring + an allocated share of implementation", true), text(". Build three scenarios—low, expected and peak volume—and include failed calls and testing.")),

    heading("Questions every quote should answer"),
    bullets(
      item(text("Does the price include telephony, speech recognition, language model and voice generation?")),
      item(text("How is a minute rounded, and are unanswered or transferred calls charged?")),
      item(text("What are the concurrency and calls-per-minute limits?")),
      item(text("Who owns the phone number, recordings, transcripts and configuration?")),
      item(text("Which integrations, languages, testing and reporting are included?")),
      item(text("What happens when the provider, model or telecom rate changes?")),
      item(text("How quickly can a caller reach a person?")),
    ),

    heading("Compliance and trust in India"),
    paragraph(text("Voice automation is not a shortcut around commercial communication rules. TRAI’s customer preference framework covers voice calls, auto-dialler calls and robo calls, and its regulations address unsolicited commercial communication. TRAI’s 2025 amendment also states that senders using auto-diallers or robo-calls must notify the originating access provider in advance.")),
    paragraph(text("The Digital Personal Data Protection Act, 2023 provides the framework for processing digital personal data for lawful purposes. Voice-agent projects may process phone numbers, recordings, transcripts, preferences and account information. Define the lawful purpose, notice, access, retention and deletion process with qualified advice appropriate to the deployment.")),
    paragraph(text("This article is operational guidance, not legal advice. The business deploying the agent remains responsible for its calling practices, data processing and customer experience.")),

    heading("Controls a production agent needs"),
    bullets(
      item(text("Identity: ", true), text("clearly disclose that the caller is interacting with an automated system when appropriate.")),
      item(text("Consent and preference: ", true), text("use the correct permission, calling category, timing and opt-out process.")),
      item(text("Minimum access: ", true), text("give the agent only the information and actions required for the call.")),
      item(text("Confirmation: ", true), text("repeat important names, dates, amounts and appointments before writing them.")),
      item(text("Escalation: ", true), text("transfer uncertainty, distress, complaints and consequential decisions to a person.")),
      item(text("Auditability: ", true), text("retain the logs needed to review performance while applying an appropriate retention policy.")),
      item(text("Evaluation: ", true), text("test difficult accents, background noise, interruptions, mixed languages and unexpected requests.")),
    ),
    paragraph(text("OpenAI’s agent-building guidance recommends layered guardrails and human intervention when failure thresholds are exceeded or an action is high risk. NIST’s AI Risk Management Framework offers a broader structure for identifying and managing AI risk.")),

    heading("A practical 30-day pilot"),
    heading("Week 1: choose one call outcome", 3),
    paragraph(text("Select a narrow workflow such as appointment confirmation. Record current call volume, connection rate, handling time, completion rate, transfer rate and the cost of missed outcomes.")),
    heading("Week 2: design the conversation and handoff", 3),
    paragraph(text("Write the approved information, required confirmations, prohibited actions and exact transfer conditions. Connect only the minimum read or write tools needed.")),
    heading("Week 3: simulate difficult calls", 3),
    paragraph(text("Test language switching, silence, interruptions, incorrect details, angry callers, noisy environments and requests outside scope. Staff who handle these calls today should review the results.")),
    heading("Week 4: launch with supervision", 3),
    paragraph(text("Start with limited hours, opted-in users or a small call segment. Review failures daily. Expand only when the agent improves the target outcome without creating unacceptable complaints, corrections or risk.")),

    heading("What to measure"),
    bullets(
      item(text("Outcome completion rate—not only calls answered")),
      item(text("Transfer rate and whether transfers include useful context")),
      item(text("Correction, complaint and opt-out rate")),
      item(text("Average cost per completed outcome")),
      item(text("Latency, interruption handling and call abandonment")),
      item(text("Booking, collection, qualification or resolution result")),
    ),
    paragraph(text("A voice agent that completes cheap minutes but creates wrong bookings is expensive. Measure the business outcome and the customer consequence together.")),

    heading("Frequently asked questions"),
    heading("Can an AI voice agent speak Hindi and regional languages?", 3),
    paragraph(text("Yes, platforms increasingly support Indian languages. Test the exact languages, accents, code-switching and vocabulary used by your customers rather than relying only on a vendor demonstration.")),
    heading("Can it connect to a CRM or calendar?", 3),
    paragraph(text("Yes, when the system provides a suitable API or integration. Start with read access where possible, validate fields and require confirmation before important writes.")),
    heading("Should callers be able to reach a person?", 3),
    paragraph(text("Yes. The handoff should be easy, especially for complaints, sensitive matters, repeated misunderstanding and requests outside the agent’s authority.")),
    heading("Is a voice agent cheaper than a human caller?", 3),
    paragraph(text("Sometimes, but cost per minute is the wrong measure on its own. Compare cost per correctly completed outcome, customer experience, compliance, supervision and the value of the calls that still require people.")),

    heading("The next move"),
    paragraph(text("AI voice agents are most useful when the call has a clear purpose, reliable information and a designed human exit. Start with one measurable workflow and make the agent earn greater responsibility through evidence.")),
    paragraph(text("If your first question is whether the job needs an agent at all, read "), text("AI Agent vs Chatbot", true, "https://www.wetakefwd.online/guides/ai-agent-vs-chatbot", false), text(". To plan a controlled implementation, explore "), text("AI agent development at WeTakeFWD", true, "https://www.wetakefwd.online/ai-agent-development", false), text(".")),

    heading("Sources"),
    bullets(
      item(text("Sarvam — Voice Agents pricing", false, "https://docs.sarvam.ai/voice-agents/pricing")),
      item(text("Twilio — Programmable Voice pricing in India", false, "https://www.twilio.com/en-us/voice/pricing/in")),
      item(text("TRAI — Customer Preference Registration Facility", false, "https://trai.gov.in/preference-registration")),
      item(text("TRAI — Telecom Commercial Communications Customer Preference Regulations", false, "https://www.trai.gov.in/tcccpr")),
      item(text("India Code — Digital Personal Data Protection Act, 2023", false, "https://www.indiacode.nic.in/indiacode/handle/123456789/22037?view_type=browse")),
      item(text("OpenAI — A practical guide to building AI agents", false, "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/")),
      item(text("NIST — AI Risk Management Framework", false, "https://www.nist.gov/itl/ai-risk-management-framework")),
    ),
  ],
};

async function publish() {
  const author = await db.author.findUnique({ where: { slug: "wetakefwd-editorial-team" } });
  const category = await db.category.findUnique({ where: { slug: "artificial-intelligence" } });
  if (!author || !category) throw new Error("Editorial author or Artificial Intelligence category is missing");

  const tagNames = ["AI voice agents", "Voice AI India", "Business automation", "AI agents", "Customer operations"];
  const tags = await Promise.all(tagNames.map((name) => {
    const tagSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return db.tag.upsert({ where: { slug: tagSlug }, create: { name, slug: tagSlug }, update: { name } });
  }));

  const existing = await db.article.findUnique({ where: { slug } });
  await db.article.updateMany({ where: { isFeatured: true, slug: { not: slug } }, data: { isFeatured: false } });
  const data = {
    title: "AI Voice Agents for Business in India",
    subtitle: "A practical guide to use cases, real cost components, Indian compliance and a controlled 30-day launch plan.",
    summary: "How AI voice agents work, what they cost in India, where businesses can use them and the controls required for a safe, measurable launch.",
    body: body as Prisma.InputJsonValue,
    coverImageUrl: "/images/ai-voice-agents-business-india-2026.webp",
    coverImageAlt: "Indian clinic receptionist handling a customer call while recording an appointment at the front desk",
    status: "PUBLISHED" as const,
    isFeatured: true,
    publishedAt: existing?.publishedAt || new Date(),
    scheduledFor: null,
    seoTitle: "AI Voice Agents in India: Cost, Uses and 2026 Guide",
    seoDescription: "AI voice agents in India explained: current cost components, business use cases, TRAI and data considerations, controls and a practical 30-day pilot.",
    canonicalOverride: null,
    sources: [
      { title: "Sarvam Voice Agents pricing", url: "https://docs.sarvam.ai/voice-agents/pricing" },
      { title: "Twilio Voice pricing in India", url: "https://www.twilio.com/en-us/voice/pricing/in" },
      { title: "TRAI Customer Preference Registration", url: "https://trai.gov.in/preference-registration" },
      { title: "TRAI TCCCPR", url: "https://www.trai.gov.in/tcccpr" },
      { title: "Digital Personal Data Protection Act, 2023", url: "https://www.indiacode.nic.in/indiacode/handle/123456789/22037?view_type=browse" },
      { title: "OpenAI practical guide to building agents", url: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/" },
      { title: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
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
