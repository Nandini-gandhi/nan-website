"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPosts(tagSlug?: string, query?: string) {
    const where: any = { published: true }

    if (tagSlug) {
        where.tags = {
            some: {
                slug: tagSlug,
            },
        }
    }

    if (query) {
        where.OR = [
            { title: { contains: query } }, // Case insensitive usually depends on DB, SQLite is case-insensitive for ASCII by default
            { content: { contains: query } },
            { summary: { contains: query } },
        ]
    }

    return prisma.post.findMany({
        where,
        include: { tags: true },
        orderBy: { date: "desc" },
    })
}

export async function getPost(slug: string) {
    return prisma.post.findUnique({
        where: { slug },
        include: { tags: true },
    })
}

export async function createPost(data: {
    title: string
    slug: string
    content: string
    summary?: string
    tags: string[] // array of tag IDs
    date?: Date
}) {
    // Sanitize slug to ensure no spaces or special characters
    const sanitizedSlug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

    const post = await prisma.post.create({
        data: {
            title: data.title,
            slug: sanitizedSlug,
            content: data.content,
            summary: data.summary,
            date: data.date || new Date(),
            published: true, // Auto publish for now, or make optional
            tags: {
                connect: data.tags.map((id) => ({ id })),
            },
        },
    })
    revalidatePath("/")
    revalidatePath("/admin")
    return post
}

export async function updatePost(id: string, data: {
    title: string
    slug: string
    content: string
    summary?: string
    tags: string[] // array of tag IDs
    date?: Date
}) {
    // Sanitize slug to ensure no spaces or special characters
    const sanitizedSlug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

    // First, disconnect all existing tags
    await prisma.post.update({
        where: { id },
        data: {
            tags: {
                set: [],
            },
        },
    })

    // Then update the post with new data and tags
    const post = await prisma.post.update({
        where: { id },
        data: {
            title: data.title,
            slug: sanitizedSlug,
            content: data.content,
            summary: data.summary,
            date: data.date || new Date(),
            tags: {
                connect: data.tags.map((id) => ({ id })),
            },
        },
    })
    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath(`/post/${sanitizedSlug}`)
    return post
}

export async function getAdjacentPosts(date: Date) {
    const [next, prev] = await Promise.all([
        prisma.post.findFirst({
            where: { date: { gt: date }, published: true },
            orderBy: { date: "asc" },
            select: { title: true, slug: true },
        }),
        prisma.post.findFirst({
            where: { date: { lt: date }, published: true },
            orderBy: { date: "desc" },
            select: { title: true, slug: true },
        }),
    ])
    return { next, prev }
}

export async function getAllPostsForAdmin() {
    return prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: { tags: true },
    })
}

export async function deletePost(id: string) {
    await prisma.post.delete({
        where: { id },
    })
    revalidatePath("/")
    revalidatePath("/admin")
}

export async function getPostsByMonth(year: number, month: number) {
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0, 23, 59, 59)

    return prisma.post.findMany({
        where: {
            published: true,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: { tags: true },
        orderBy: { date: "asc" },
    })
}
