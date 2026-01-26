import { getPost, getAdjacentPosts } from "@/app/actions/posts"
import { MarkdownView } from "@/components/markdown-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"

export const dynamic = "force-dynamic"

export default async function PostPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const post = await getPost(decodedSlug)

    if (!post) {
        notFound()
    }

    const { next, prev } = await getAdjacentPosts(post.date)

    return (
        <article className="min-h-screen pb-20">
            <header className="mb-10 mt-10 space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={post.date.toISOString()}>
                            {format(new Date(post.date), "MMMM do, yyyy")}
                        </time>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900">
                        {post.title}
                    </h1>
                </div>

                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <Link key={tag.id} href={`/?tag=${tag.slug}`}>
                            <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:from-blue-200 hover:to-cyan-200 transition-all cursor-pointer">
                                #{tag.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </header>

            <MarkdownView content={post.content} className="mb-16" />

            <hr className="my-10 border-border/40" />

            <nav className="flex justify-between items-center gap-4">
                {prev ? (
                    <Link href={`/post/${prev.slug}`} className="flex flex-col group items-start max-w-[45%]">
                        <span className="text-xs text-muted-foreground mb-1 group-hover:text-primary transition-colors flex items-center gap-1">
                            <ArrowLeft className="h-3 w-3" /> Previous
                        </span>
                        <span className="text-sm font-medium line-clamp-2 leading-tight group-hover:underline decoration-border/50 underline-offset-4">
                            {prev.title}
                        </span>
                    </Link>
                ) : <div />}

                {next ? (
                    <Link href={`/post/${next.slug}`} className="flex flex-col group items-end text-right max-w-[45%]">
                        <span className="text-xs text-muted-foreground mb-1 group-hover:text-primary transition-colors flex items-center gap-1">
                            Next <ArrowRight className="h-3 w-3" />
                        </span>
                        <span className="text-sm font-medium line-clamp-2 leading-tight group-hover:underline decoration-border/50 underline-offset-4">
                            {next.title}
                        </span>
                    </Link>
                ) : <div />}
            </nav>
        </article>
    )
}
