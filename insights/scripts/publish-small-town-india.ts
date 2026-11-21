import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";

const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("Set DIRECT_DATABASE_URL or DATABASE_URL");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
const text = (value: string, bold = false, italic = false, href?: string) => ({
  type: "text",
  text: value,
  ...(bold || italic || href ? { marks: [
    ...(bold ? [{ type: "bold" }] : []),
    ...(italic ? [{ type: "italic" }] : []),
    ...(href ? [{ type: "link", attrs: { href, target: "_blank", rel: "noopener noreferrer" } }] : []),
  ] } : {}),
});
const paragraph = (...content: ReturnType<typeof text>[]) => ({ type: "paragraph", content });
const heading = (value: string) => ({ type: "heading", attrs: { level: 2 }, content: [text(value)] });
const quote = (...content: ReturnType<typeof text>[]) => ({ type: "blockquote", content: [paragraph(...content)] });
const item = (...content: ReturnType<typeof text>[]) => ({ type: "listItem", content: [paragraph(...content)] });
const bullets = (...content: ReturnType<typeof item>[]) => ({ type: "bulletList", content });

const slug = "building-ai-for-small-town-india";
const body = {
  type: "doc",
  content: [
    paragraph(text("When people talk about AI in India, they usually picture Bengaluru startups, big banks and English-speaking tech teams.")),
    paragraph(text("Much of our work at "), text("WeTakeFwd", true), text(" happens somewhere else: a school in Etah, a mobile shop in a small market town, a family-run restaurant. These businesses don't have IT departments. Their owners do sales, accounts and customer service themselves, usually from one phone.")),
    paragraph(text("They've taught us more about building useful technology than any conference ever could.")),
    quote(text("The biggest lesson: ", true), text("small-town businesses don't want AI. "), text("They want their problems to go away.", true), text(" AI is just one way to do that.")),
    paragraph(text("Here's what we've learned.")),

    heading("1. WhatsApp is the real operating system"),
    paragraph(text("We've learned to stop asking customers to download one more app.")),
    paragraph(text("Parents already message the school on WhatsApp. Customers already ask the shop for prices on WhatsApp. Orders, complaints and payment screenshots: it all happens there.")),
    paragraph(text("So we build where people already are. A fee reminder, a result notice or an order confirmation on WhatsApp gets read. The same message inside a new app often never gets seen.")),
    quote(text("If your product needs a new habit before it can help, it's already fighting uphill.", true)),

    heading("2. Start with the problem they say out loud"),
    paragraph(text("No school principal has ever told us, "), text("“We need an AI-powered ERP.”", false, true)),
    paragraph(text("They say things like:")),
    bullets(
      item(text("“Parents keep saying they never got the notice.”", false, true)),
      item(text("“Result week takes our teachers days of copying marks.”", false, true)),
      item(text("“Fee follow-ups take up half our office's time.”", false, true)),
    ),
    paragraph(text("A shop owner says, "), text("“I miss customers who message at night.”", false, true)),
    paragraph(text("When we start with that sentence instead of the technology, everything gets easier: the demo, the price and the decision.")),

    heading("3. Simple beats smart"),
    paragraph(text("A feature nobody uses is worth nothing, however clever it is.")),
    paragraph(text("The tools that stick have "), text("one clear job, a big obvious button, and language the staff are comfortable with", true), text(", often a mix of Hindi and English. A teacher should be able to learn the main task in a few minutes, and a shop assistant shouldn't need a manual.")),
    quote(text("Our test for every screen: ", true), text("could the busiest person in the building use this without calling us?")),

    heading("4. Trust comes before technology"),
    paragraph(text("In smaller towns, business runs on relationships. People buy from people they know, or from people someone they trust recommends.")),
    paragraph(text("That changes how we work:")),
    bullets(
      item(text("We show, we don't pitch. ", true), text("A live demo with the business's own data and its own WhatsApp messages does more than any brochure.")),
      item(text("We start small. ", true), text("One workflow that works builds more trust than ten promised features.")),
      item(text("We pick up the phone. ", true), text("Support means a real person who answers the same day, not a ticket number.")),
    ),

    heading("5. Automation should give owners time back, not replace their people"),
    paragraph(text("The fear we hear most often is, "), text("“Will this replace my staff?”", false, true)),
    paragraph(text("What actually happens is the opposite. The repetitive work, such as reminders, copying data, answering the same ten questions and chasing payments, moves to the system. "), text("The people move to the work that needs a human:", true), text(" talking to parents, serving customers and growing the business.")),
    quote(text("Good automation doesn't remove the personal touch. It makes room for more of it.", true)),

    heading("6. Price in a language business owners understand"),
    paragraph(text("“Per seat, per month, billed annually” means little to most small business owners. "), text("Hours saved, fees collected on time and customers who didn't slip away", true), text(" mean a lot.")),
    paragraph(text("We've learned to talk about the outcome first and the price second, and to make the first step small enough to say yes to.")),

    heading("What this means for anyone building for Bharat"),
    paragraph(text("India's next wave of digital growth won't come only from metros. It will come from millions of schools, shops, clinics and restaurants in towns most tech companies never visit.")),
    paragraph(text("To build for them:")),
    bullets(
      item(text("Meet them on WhatsApp", true), text(", not in a new app.")),
      item(text("Solve the problem they already feel", true), text(", in their words.")),
      item(text("Keep it simple", true), text(" enough for the busiest person in the room.")),
      item(text("Earn trust", true), text(" with results, not jargon.")),
    ),
    paragraph(text("That's what we're building at WeTakeFwd: AI agents, WhatsApp and CRM automation, websites and custom software for businesses across India, including the ones in towns most tech companies never visit.")),
    paragraph(text("If you run a business like this, or work with them, we'd love to hear what's slowing you down. ", true), text("Tell us through "), text("wetakefwd.online", true, false, "https://wetakefwd.online/#contact"), text(".")),
  ],
};

async function publish() {
  const author = await db.author.findUnique({ where: { slug: "wetakefwd-editorial-team" } });
  const category = await db.category.findUnique({ where: { slug: "business-technology" } });
  if (!author || !category) throw new Error("Editorial author or Business & Technology category is missing");

  const tagNames = ["Small Business", "MSME", "AI", "Automation", "WhatsApp", "Digital India", "Bharat"];
  const tags = await Promise.all(tagNames.map((name) => {
    const tagSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return db.tag.upsert({ where: { slug: tagSlug }, create: { name, slug: tagSlug }, update: { name } });
  }));
  const existing = await db.article.findUnique({ where: { slug } });
  const data = {
    title: "Building AI for Small-Town India: What Schools, Shops and Restaurants Taught Us",
    subtitle: "Six lessons from building useful automation for the businesses that power Bharat.",
    summary: "What schools, shops and restaurants in small-town India taught us about WhatsApp, simple automation, trust and building AI that solves real problems.",
    body: body as Prisma.InputJsonValue,
    coverImageUrl: "/images/building-ai-small-town-india.png",
    coverImageAlt: "A school administrator, local shop owner and restaurant worker in a small Indian town using connected phone-based automation",
    status: "PUBLISHED" as const,
    isFeatured: false,
    publishedAt: existing?.publishedAt || new Date(),
    scheduledFor: null,
    seoTitle: "Building AI for Small-Town India | WeTakeFwd",
    seoDescription: "Six lessons from schools, shops and restaurants on building simple, trusted AI and WhatsApp automation for small-town India.",
    canonicalOverride: null,
    sources: [] as Prisma.InputJsonValue,
    authorId: author.id,
    categoryId: category.id,
  };
  const article = existing
    ? await db.article.update({ where: { slug }, data: { ...data, articleTags: { deleteMany: {}, create: tags.map(({ id }) => ({ tagId: id })) } } })
    : await db.article.create({ data: { slug, ...data, articleTags: { create: tags.map(({ id }) => ({ tagId: id })) } } });
  console.log(JSON.stringify({ id: article.id, slug: article.slug, status: article.status }));
}

try { await publish(); } finally { await db.$disconnect(); }
