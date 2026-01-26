import { getAllPostsForAdmin } from "@/app/actions/posts"
import { getTags } from "@/app/actions/tags"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeletePostButton } from "@/components/delete-post-button"
import { TagManager } from "@/components/tag-manager"
import { format } from "date-fns"
import { Plus, Edit } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
    const posts = await getAllPostsForAdmin()
    const tags = await getTags()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <div className="flex gap-2">
                    <Link href="/admin/editor">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Post
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                <CardHeader>
                    <CardTitle className="text-gray-900">All Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {posts.map((post: any) => (
                            <div
                                key={post.id}
                                className="flex items-center justify-between rounded-lg border border-blue-100 p-4 bg-white/50"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900">{post.title}</span>
                                        <Badge variant={post.published ? "default" : "secondary"}>
                                            {post.published ? "Published" : "Draft"}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {format(new Date(post.date), "PPP")}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Link href={`/admin/editor/${post.id}`}>
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <DeletePostButton postId={post.id} />
                                </div>
                            </div>
                        ))}
                        {posts.length === 0 && (
                            <div className="text-center py-8 text-gray-500">No posts yet.</div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                <CardContent className="pt-6">
                    <TagManager tags={tags} />
                </CardContent>
            </Card>
        </div>
    )
}

