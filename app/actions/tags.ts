"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getTags() {
    return prisma.tag.findMany({
        orderBy: { name: "asc" },
    })
}

export async function createTag(name: string) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    const tag = await prisma.tag.create({
        data: {
            name,
            slug,
        },
    })
    revalidatePath("/")
    return tag
}

export async function renameTag(id: string, newName: string) {
    const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    const tag = await prisma.tag.update({
        where: { id },
        data: {
            name: newName,
            slug: newSlug,
        },
    })
    revalidatePath("/")
    return tag
}

export async function deleteTag(id: string) {
    await prisma.tag.delete({ where: { id } })
    revalidatePath("/")
}
