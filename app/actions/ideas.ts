"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getIdeas() {
    return prisma.idea.findMany({
        orderBy: { createdAt: "desc" },
    })
}

export async function createIdea(text: string) {
    const idea = await prisma.idea.create({
        data: { text },
    })
    revalidatePath("/ideas")
    return idea
}

export async function toggleIdea(id: string) {
    const idea = await prisma.idea.findUnique({ where: { id } })
    if (!idea) return null

    const updated = await prisma.idea.update({
        where: { id },
        data: { completed: !idea.completed },
    })
    revalidatePath("/ideas")
    return updated
}

export async function deleteIdea(id: string) {
    await prisma.idea.delete({ where: { id } })
    revalidatePath("/ideas")
}
