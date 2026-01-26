"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Tag } from "@prisma/client"
import { Book, Lightbulb, Monitor, Globe, Check } from "lucide-react"

interface SearchFilterProps {
    tags: Tag[]
}

const tagIcons: { [key: string]: React.ReactNode } = {
    "books": <Book className="h-4 w-4" />,
    "ideas": <Lightbulb className="h-4 w-4" />,
    "tech": <Monitor className="h-4 w-4" />,
    "world-news": <Globe className="h-4 w-4" />,
}

const tagColors: { [key: string]: string } = {
    "books": "bg-amber-100 text-amber-800 hover:bg-amber-200",
    "ideas": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "tech": "bg-sky-100 text-sky-800 hover:bg-sky-200",
    "world-news": "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
}

export function SearchFilter({ tags }: SearchFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentTag = searchParams.get("tag")
    const currentQuery = searchParams.get("q") || ""

    const [query, setQuery] = React.useState(currentQuery)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (query) {
                params.set("q", query)
            } else {
                params.delete("q")
            }
            router.push(`/?${params.toString()}`, { scroll: false })
        }, 300)

        return () => clearTimeout(timer)
    }, [query, router, searchParams])

    const toggleTag = (slug: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (slug === null || currentTag === slug) {
            params.delete("tag")
        } else {
            params.set("tag", slug)
        }
        router.push(`/?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="mb-8 space-y-4">
            <Input
                placeholder="Search posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="max-w-md bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 shadow-sm rounded-xl h-14 text-lg pl-5"
            />
            <div className="flex flex-wrap gap-2">
                {/* All button */}
                <button
                    onClick={() => toggleTag(null)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105",
                        !currentTag
                            ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                            : "border border-blue-200 bg-white/80 hover:bg-blue-50 hover:border-blue-300"
                    )}
                >
                    <Check className="h-4 w-4" />
                    All
                </button>

                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.slug)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                            currentTag === tag.slug
                                ? "ring-2 ring-offset-2 ring-blue-500 shadow-md"
                                : "",
                            tagColors[tag.slug] || "bg-card text-foreground border border-border/50 hover:bg-accent"
                        )}
                    >
                        {tagIcons[tag.slug] || null}
                        {tag.name}
                    </button>
                ))}
            </div>
        </div>
    )
}
