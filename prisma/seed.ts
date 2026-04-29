import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const PASSWORD = "reflection";

const av = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
    seed,
  )}&backgroundColor=eef2e9,f4eede,f5e6e0,e9eaf3,e3edf2`;

async function main() {
  console.log("Seeding…");
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  const users = [
    {
      username: "maya",
      email: "maya@dogud.demo",
      name: "Maya Alvarez",
      bio: "Trying to see myself through clearer eyes.",
      avatar: av("maya-2"),
    },
    {
      username: "jordan",
      email: "jordan@dogud.demo",
      name: "Jordan Pak",
      bio: "Curious about the gap between how I show up and how I think I show up.",
      avatar: av("jordan-7"),
    },
    {
      username: "sami",
      email: "sami@dogud.demo",
      name: "Sami Okafor",
      bio: "Collecting honest reflections from people I trust.",
      avatar: av("sami-3"),
    },
    {
      username: "lena",
      email: "lena@dogud.demo",
      name: "Lena Brooks",
      bio: "Reading people for a living. Curious how they read me.",
      avatar: av("lena-9"),
    },
    {
      username: "theo",
      email: "theo@dogud.demo",
      name: "Theo Reyes",
      bio: "Quiet on purpose.",
      avatar: av("theo-4"),
    },
  ];

  const userMap = new Map<string, string>();
  for (const u of users) {
    const created = await db.user.upsert({
      where: { username: u.username },
      update: {},
      create: { ...u, passwordHash },
    });
    userMap.set(u.username, created.id);
    console.log(`  user @${u.username}`);
  }

  // wipe any existing demo prompts/responses for idempotent re-seed
  await db.response.deleteMany({
    where: { responder: { email: { endsWith: "@dogud.demo" } } },
  });
  await db.prompt.deleteMany({
    where: { author: { email: { endsWith: "@dogud.demo" } } },
  });

  const prompts: { key: string; data: any }[] = [
    {
      key: "p1",
      data: {
        authorId: userMap.get("maya")!,
        question: "What's something you think I'm quietly really good at?",
        category: "hidden-talents",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80&auto=format&fit=crop",
      },
    },
    {
      key: "p2",
      data: {
        authorId: userMap.get("jordan")!,
        question: "If you had to describe me in three words, what would they be?",
        category: "personality",
      },
    },
    {
      key: "p3",
      data: {
        authorId: userMap.get("sami")!,
        question: "What's the first impression you remember getting from me?",
        category: "first-impressions",
        image:
          "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80&auto=format&fit=crop",
      },
    },
    {
      key: "p4",
      data: {
        authorId: userMap.get("lena")!,
        question: "Where do you think I shine without realizing it?",
        category: "strengths",
      },
    },
    {
      key: "p5",
      data: {
        authorId: userMap.get("theo")!,
        question: "What's one thing you think I'm still figuring out?",
        category: "growth",
      },
    },
  ];

  const promptMap = new Map<string, string>();
  for (const p of prompts) {
    const created = await db.prompt.create({ data: p.data });
    promptMap.set(p.key, created.id);
    console.log(`  prompt ${p.key}`);
  }

  const responses = [
    {
      promptKey: "p1",
      responder: "jordan",
      text: "You make people feel like the most interesting person in the room without trying. It's a kind of generosity people don't usually name.",
      traits: ["generous", "thoughtful"],
      pinned: true,
    },
    {
      promptKey: "p1",
      responder: "lena",
      text: "Reading the temperature of a group. You always seem to know who needs to be pulled into the conversation.",
      traits: ["thoughtful", "kind"],
    },
    {
      promptKey: "p2",
      responder: "sami",
      text: "Steady. Funny in the dry way. Quietly competitive.",
      traits: ["steady", "funny", "driven"],
    },
    {
      promptKey: "p2",
      responder: "maya",
      text: "Honest, loyal, curious — in that order.",
      traits: ["honest", "loyal", "curious"],
      pinned: true,
    },
    {
      promptKey: "p3",
      responder: "theo",
      text: "I remember thinking you were going to be intimidating, and then within five minutes realizing you were the warmest person in the room.",
      traits: ["kind", "honest"],
    },
    {
      promptKey: "p4",
      responder: "maya",
      text: "You translate complicated ideas into something a tired person at the back of the room can still follow. That's rarer than you think.",
      traits: ["thoughtful", "creative"],
    },
    {
      promptKey: "p5",
      responder: "jordan",
      text: "When to stop optimizing and just enjoy the thing you've already built. You're closer than you think.",
      traits: ["honest"],
    },
  ];

  for (const r of responses) {
    await db.response.create({
      data: {
        promptId: promptMap.get(r.promptKey)!,
        responderId: userMap.get(r.responder)!,
        text: r.text,
        traits: r.traits,
        pinned: r.pinned ?? false,
      },
    });
  }
  console.log(`  ${responses.length} responses`);
  console.log("Done.");
  console.log(`\nDemo accounts (password: "${PASSWORD}"):`);
  for (const u of users) console.log(`  ${u.email}  /  @${u.username}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
