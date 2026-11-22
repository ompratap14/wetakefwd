import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";

const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("Set DIRECT_DATABASE_URL or DATABASE_URL");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
const text = (value: string, bold = false, italic = false) => ({
  type: "text",
  text: value,
  ...(bold || italic ? {
    marks: [
      ...(bold ? [{ type: "bold" }] : []),
      ...(italic ? [{ type: "italic" }] : []),
    ],
  } : {}),
});
const paragraph = (...content: ReturnType<typeof text>[]) => ({ type: "paragraph", content });
const heading = (value: string, level = 2) => ({ type: "heading", attrs: { level }, content: [text(value)] });
const quote = (...content: ReturnType<typeof text>[]) => ({ type: "blockquote", content: [paragraph(...content)] });
const item = (...content: ReturnType<typeof text>[]) => ({ type: "listItem", content: [paragraph(...content)] });
const bullets = (...content: ReturnType<typeof item>[]) => ({ type: "bulletList", content });

const slug = "30-minute-automation-audit-first-workflow";
// 11:25 AM IST on 23 November 2026. The 11:30 AM IST Vercel cron publishes it.
const scheduledFor = new Date("2026-11-23T05:55:00.000Z");

const body = {
  type: "doc",
  content: [
    paragraph(text("Most automation projects do not fail because the technology is weak. They struggle because the first workflow was chosen without enough evidence.")),
    paragraph(text("A team notices that everyone is busy, buys a new tool and starts connecting systems. Weeks later, the same delays remain because the real bottleneck was unclear ownership, missing information or an exception that still needed a person.")),
    paragraph(text("A 30-minute automation audit helps you choose a better starting point. You do not need specialist software, a long workshop or a complete process map. You need one repeated task, the people who do it and an honest view of where the work slows down.")),
    quote(text("The best first automation is easy to observe, painful enough to matter and narrow enough to improve safely.", true)),

    heading("Before the timer starts"),
    paragraph(text("Bring together one person who does the work and one person who depends on its result. Open a blank document or sheet. Choose a normal working day rather than an ideal version of the process.")),
    paragraph(text("The goal is to identify one workflow that deserves a small pilot. Keep every answer tied to what actually happens.")),

    heading("Minutes 0–5: list the work that repeats"),
    paragraph(text("Write down tasks that happen several times a day or week. Look for actions such as copying enquiry details, sending reminders, checking order status, preparing the same report or answering a familiar customer question.")),
    paragraph(text("Use verbs. “Customer service” is too broad. “Copy website enquiries into the lead sheet” is specific enough to examine.")),
    bullets(
      item(text("What starts the task?", true), text(" A message, form, date, payment or status change?")),
      item(text("Who performs it?", true), text(" Name the role rather than saying “the team.”")),
      item(text("Where does it happen?", true), text(" WhatsApp, email, spreadsheet, CRM or paper?")),
      item(text("What shows it is complete?", true), text(" A reply, updated record, approval or notification?")),
    ),

    heading("Minutes 5–10: score frequency and friction"),
    paragraph(text("Give each task two simple scores from one to five. Frequency measures how often it occurs. Friction measures how much time, delay or frustration it creates.")),
    paragraph(text("A task that happens every day but takes two minutes may still be a good candidate if errors create costly follow-up. A monthly task that takes hours may also matter, but it is harder to learn from quickly.")),
    quote(text("For a first pilot, favour work that repeats often enough to produce feedback within a week.")),

    heading("Minutes 10–15: trace every handoff"),
    paragraph(text("Follow one recent example from start to finish. Mark each moment when the work moves between people or tools. Handoffs are where context disappears.")),
    paragraph(text("A website enquiry may enter an inbox, move to WhatsApp, get copied into a spreadsheet and finally reach a salesperson. If the lead goes quiet, the problem may be the transfer rather than the reply itself.")),
    bullets(
      item(text("Where is information copied manually?")),
      item(text("Where does someone wait for an update?")),
      item(text("Where can two people assume the other person owns the next step?")),
      item(text("Where does a customer have to repeat information?")),
    ),

    heading("Minutes 15–20: find the exceptions"),
    paragraph(text("Ask what makes the task difficult. A routine reminder may be straightforward until a payment is disputed. A chatbot can answer an approved question until a customer needs advice. A document can be classified automatically until a field is missing.")),
    paragraph(text("Write down the three most common exceptions and decide who should handle them. This becomes the human handoff. A useful automation should make that handoff faster and provide the context already collected.")),

    heading("Minutes 20–25: record a baseline"),
    paragraph(text("Measure the current process before changing it. The baseline can be simple, but it must relate to the problem.")),
    bullets(
      item(text("average time to the first useful response;")),
      item(text("number of records copied manually each week;")),
      item(text("enquiries that receive no follow-up;")),
      item(text("appointments missed after no reminder;")),
      item(text("time spent producing a routine report;")),
      item(text("errors or corrections created during a handoff.")),
    ),
    paragraph(text("If the baseline cannot be observed, define how you will collect it for one week. Without a starting point, a new system can feel faster while producing no measurable improvement.")),

    heading("Minutes 25–30: choose the smallest useful pilot"),
    paragraph(text("Select the workflow with strong frequency, visible friction, a clear owner and manageable exceptions. Define the pilot in one sentence.")),
    quote(text("When a new website enquiry arrives, capture the details in the CRM, assign an owner and send a confirmation within two minutes. Escalate incomplete or sensitive enquiries to a person.")),
    paragraph(text("That sentence states the trigger, action, destination, owner and handoff. It gives the team something concrete to test.")),

    heading("The five-question automation fit test"),
    paragraph(text("Before building, answer these questions:")),
    bullets(
      item(text("Does the workflow begin with a clear trigger?", true)),
      item(text("Are the normal steps consistent enough to describe?", true)),
      item(text("Can the required information be accessed reliably?", true)),
      item(text("Is there a named person for exceptions?", true)),
      item(text("Can success be measured within two to four weeks?", true)),
    ),
    paragraph(text("Four or five clear answers usually indicate a sensible pilot. Fewer answers mean the process needs clarification before automation.")),

    heading("What to avoid in the first project"),
    paragraph(text("Do not begin with a workflow that requires frequent judgement, has no owner or depends on data nobody trusts. Avoid replacing several tools at once. Keep financial, legal, safety and sensitive customer decisions with qualified people and explicit review.")),
    paragraph(text("The first project should teach the team how automation behaves in real work. It should be reversible, observable and easy to pause when something unexpected happens.")),

    heading("A seven-day pilot plan"),
    heading("Day 1: confirm the workflow", 3),
    paragraph(text("Review five recent examples with the people who performed the task. Confirm the common path and exceptions.")),
    heading("Days 2–3: build and test", 3),
    paragraph(text("Connect the minimum systems needed. Test normal cases, missing information, duplicate submissions and human escalation.")),
    heading("Days 4–6: run with a limited audience", 3),
    paragraph(text("Use the workflow with a small portion of real work. Keep the previous method available and review every outcome.")),
    heading("Day 7: compare the evidence", 3),
    paragraph(text("Compare response time, completion, errors and staff effort with the baseline. Keep, revise or stop the workflow based on what happened.")),

    heading("Start with the work people already want fixed"),
    paragraph(text("Automation earns trust when the improvement is visible to the people doing the work. One reliable workflow can create time, reduce missed follow-up and reveal where the next improvement should begin.")),
    paragraph(text("Set a 30-minute timer, choose one real example and follow it from trigger to completion. The first worthwhile automation is usually already hiding inside the work your team repeats every day.")),
    paragraph(text("WeTakeFwd helps businesses map, build and improve practical AI, CRM and workflow automation with clear human ownership.", true)),
  ],
};

async function schedule() {
  const author = await db.author.findUnique({ where: { slug: "wetakefwd-editorial-team" } });
  const category = await db.category.findUnique({ where: { slug: "business-technology" } });
  if (!author || !category) throw new Error("Editorial author or Business & Technology category is missing");

  const tagNames = ["AI Automation", "Business Automation", "Workflow", "Small Business", "MSME", "Operations"];
  const tags = await Promise.all(tagNames.map((name) => {
    const tagSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return db.tag.upsert({ where: { slug: tagSlug }, create: { name, slug: tagSlug }, update: { name } });
  }));

  const existing = await db.article.findUnique({ where: { slug } });
  const data = {
    title: "The 30-Minute Automation Audit: Find the First Workflow Worth Fixing",
    subtitle: "A practical exercise for choosing a useful first automation based on real work, visible friction and measurable outcomes.",
    summary: "A step-by-step 30-minute audit that helps small businesses identify the first workflow worth automating and plan a safe, measurable pilot.",
    body: body as Prisma.InputJsonValue,
    coverImageUrl: "/images/automation-audit-indian-business-team.jpg",
    coverImageAlt: "Two Indian colleagues reviewing a workflow together on a laptop",
    status: "SCHEDULED" as const,
    isFeatured: false,
    publishedAt: null,
    scheduledFor,
    seoTitle: "30-Minute Business Automation Audit | WeTakeFwd",
    seoDescription: "Use this 30-minute automation audit to identify repeated work, trace handoffs, measure friction and choose a practical first workflow to improve.",
    canonicalOverride: null,
    sources: [
      {
        title: "Cover photograph by Ketut Subiyanto on Pexels",
        url: "https://www.pexels.com/photo/happy-indian-colleagues-speaking-while-surfing-internet-on-laptop-4308105/",
      },
    ] as Prisma.InputJsonValue,
    authorId: author.id,
    categoryId: category.id,
  };

  const article = existing
    ? await db.article.update({
        where: { slug },
        data: {
          ...data,
          articleTags: { deleteMany: {}, create: tags.map(({ id }) => ({ tagId: id })) },
        },
      })
    : await db.article.create({
        data: {
          slug,
          ...data,
          articleTags: { create: tags.map(({ id }) => ({ tagId: id })) },
        },
      });

  console.log(JSON.stringify({
    id: article.id,
    slug: article.slug,
    status: article.status,
    scheduledFor: article.scheduledFor,
  }));
}

try {
  await schedule();
} finally {
  await db.$disconnect();
}
