import "dotenv/config"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
})

async function main() {
    const techTag = await prisma.tag.upsert({
        where: { slug: "tech" },
        update: {},
        create: { name: "Tech", slug: "tech" },
    })

    const booksTag = await prisma.tag.upsert({
        where: { slug: "books" },
        update: {},
        create: { name: "Books", slug: "books" },
    })

    const worldNewsTag = await prisma.tag.upsert({
        where: { slug: "world-news" },
        update: {},
        create: { name: "World News", slug: "world-news" },
    })

    const ideasTag = await prisma.tag.upsert({
        where: { slug: "ideas" },
        update: {},
        create: { name: "Ideas", slug: "ideas" },
    })

    await prisma.post.upsert({
        where: { slug: "building-a-digital-garden" },
        update: {},
        create: {
            title: "Building a Digital Garden",
            slug: "building-a-digital-garden",
            summary: "Why I decided to start documenting my daily learnings and the tech stack I chose.",
            content: `
# The Concept

A digital garden is a place where ideas can grow. Unlike a blog, which is chronological and "finished", a garden is ever-evolving.

## The Stack

For this project, I chose:
- **Next.js** for the framework
- **Tailwind CSS** for styling
- **SQLite** for the database
- **Prisma** for the ORM

It feels incredibly snappy and easy to maintain.
      `,
            tags: { connect: [{ id: techTag.id }, { id: ideasTag.id }] },
            published: true,
            date: new Date(),
        },
    })

    await prisma.post.upsert({
        where: { slug: "reading-atomic-habits" },
        update: {},
        create: {
            title: "Reflections on Atomic Habits",
            slug: "reading-atomic-habits",
            summary: "Key takeaways from James Clear's bestseller.",
            content: `
# 1% Better Every Day

The core idea is that massive success doesn't require massive action. It requires small, consistent improvements.

> "You do not rise to the level of your goals. You fall to the level of your systems."

## Identity-Based Habits

Focus on who you want to become, not just what you want to achieve.
      `,
            tags: { connect: [{ id: booksTag.id }] },
            published: true,
            date: new Date(Date.now() - 86400000), // Yesterday
        },
    })

    await prisma.post.upsert({
        where: { slug: "future-of-ai" },
        update: {},
        create: {
            title: "The Future of AI Agents",
            slug: "future-of-ai",
            summary: "How autonomous agents are changing software development.",
            content: `
AI is moving from "chatbots" to "agents" that can execute tasks. This shift is fundamental.

We are seeing agents that can:
1. Plan complex workflows
2. Execute code
3. Verify their own work

Exciting times ahead!
      `,
            tags: { connect: [{ id: techTag.id }, { id: worldNewsTag.id }] },
            published: true,
            date: new Date(Date.now() - 172800000), // 2 days ago
        },
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
