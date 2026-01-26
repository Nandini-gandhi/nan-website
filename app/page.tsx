import { FeedHeader } from "@/components/feed-header"
import { SearchFilter } from "@/components/search-filter"
import { getPosts } from "@/app/actions/posts"
import { getTags } from "@/app/actions/tags"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const tagSlug = typeof resolvedSearchParams.tag === "string" ? resolvedSearchParams.tag : undefined
  const query = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined

  const [posts, tags] = await Promise.all([
    getPosts(tagSlug, query),
    getTags(),
  ])

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)]">
      <FeedHeader />
      <SearchFilter tags={tags} />

      <div className="space-y-8 mt-8">
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No posts found.</p>
        ) : (
          posts.map((post) => (
            <Link key={post.id} href={`/post/${post.slug}`} className="block group">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-xl">
                <CardHeader className="p-0 mb-3">
                  <div className="text-sm text-muted-foreground mb-2 font-mono">
                    {format(new Date(post.date), "MMMM do, yyyy")}
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  {post.summary && (
                    <p className="text-muted-foreground leading-relaxed">
                      {post.summary}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: { id: string; name: string; slug: string }, index: number) => {
                      const colors = [
                        "bg-blue-500 text-white",
                        "bg-amber-400 text-amber-900",
                        "bg-emerald-500 text-white",
                        "bg-purple-500 text-white",
                        "bg-rose-500 text-white"
                      ]
                      return (
                        <span
                          key={tag.id}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${colors[index % colors.length]}`}
                        >
                          #{tag.name}
                        </span>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
