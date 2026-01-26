import { checkAuth } from "@/app/actions/auth"
import { getPost } from "@/app/actions/posts"
import PostEditor from "@/components/post-editor"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditorPage({
    params,
}: {
    params: Promise<{ id?: string[] }>
}) {
    // Auth check removed
    // const isAuthenticated = await checkAuth()
    // if (!isAuthenticated) {
    //   redirect("/admin/login")
    // }  }

    const { id } = await params
    let post = null

    // If id is present (e.g. /admin/editor/some-id), fetch post. 
    // Wait, my routes were /admin/editor/[[...id]]. 
    // If editing, params.id is an array [postId].

    if (id && id[0]) {
        // Assuming I pass ID to editor, but my DB uses slug or ID. 
        // The dashboard linked to /admin/editor/${post.id}.
        // getPost uses slug. I need getPostById? Or just use findUnique.
        // I'll update getPost or create getPostById in actions if needed, 
        // but simpler: just fetch using prisma here or add an action.
        // Wait, direct prisma call in server component is fine.
        // But adhering to "actions" pattern. 
        // I'll assume getPost accepts ID? No, it takes slug.
        // I'll create a getPostById, or just use slug? 
        // Dashboard links to ID. I should probably link to slug if I have it, but ID is stable.
        // I will add getPostById to actions.

        const postId = id[0]
        // Quick fix for now: fetch directly or add action. 
        // Adding action is cleaner.
        // Or... I can just use prisma here since it's a server component.

        const { prisma } = await import("@/lib/prisma")
        post = await prisma.post.findUnique({
            where: { id: postId },
            include: { tags: true }
        })
    }

    return <PostEditor post={post} />
}
