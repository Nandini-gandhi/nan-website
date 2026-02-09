"use client"

import { createPost, updatePost } from "@/app/actions/posts"
import { createTag, getTags } from "@/app/actions/tags"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Tag = { id: string; name: string; slug: string }

export default function PostEditor({ post }: { post?: any }) {
    const router = useRouter()
    const [title, setTitle] = useState(post?.title || "")
    const [slug, setSlug] = useState(post?.slug || "")
    const [content, setContent] = useState(post?.content || "")
    const [summary, setSummary] = useState(post?.summary || "")
    const [tags, setTags] = useState<Tag[]>(post?.tags || [])
    const [availableTags, setAvailableTags] = useState<Tag[]>([])
    const [tagInput, setTagInput] = useState("")
    const [showTagDropdown, setShowTagDropdown] = useState(false)

    useEffect(() => {
        getTags().then(setAvailableTags as any)
    }, [])

    // Auto-generate slug from title if empty
    useEffect(() => {
        if (!post && !slug && title) {
            setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
        }
    }, [title, post, slug])

    const handleCreateTag = async () => {
        if (!tagInput) return
        const newTag = await createTag(tagInput) as Tag
        setTags([...tags, newTag])
        setAvailableTags([...availableTags, newTag])
        setTagInput("")
    }

    const handleAddTag = (tag: Tag) => {
        if (!tags.find((t) => t.id === tag.id)) {
            setTags([...tags, tag])
        }
        setTagInput("")
    }

    const [saving, setSaving] = useState(false)

    const handleSubmit = async () => {
        if (!title || !content) {
            alert("Title and content are required")
            return
        }
        setSaving(true)
        try {
            const postData = {
                title,
                slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                content,
                summary,
                tags: tags.map(t => t.id),
            }

            if (post?.id) {
                // Update existing post
                await updatePost(post.id, postData)
            } else {
                // Create new post
                await createPost(postData)
            }
            
            router.push("/admin")
            router.refresh()
        } catch (error) {
            console.error("Error saving post:", error)
            alert("Error saving post. Check console for details.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{post ? "Edit Post" : "New Post"}</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="title" className="text-gray-700">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Entry Title" className="bg-white/80 border-blue-200 text-gray-900" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="slug" className="text-gray-700">Slug</Label>
                    <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="entry-slug" className="bg-white/80 border-blue-200 text-gray-900" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="summary" className="text-gray-700">Summary (Optional)</Label>
                    <Input id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary for preview" className="bg-white/80 border-blue-200 text-gray-900" />
                </div>

                <div className="grid gap-2">
                    <Label className="text-gray-700">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <Badge key={tag.id} variant="secondary" className="cursor-pointer" onClick={() => setTags(tags.filter(t => t.id !== tag.id))}>
                                {tag.name} ×
                            </Badge>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Search or add tags..."
                                className="bg-white/80 border-blue-200 text-gray-900"
                                onFocus={() => setShowTagDropdown(true)}
                                onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
                            />
                            {/* Dropdown showing available tags */}
                            {showTagDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-blue-200 shadow-lg z-20 max-h-48 overflow-y-auto">
                                    {availableTags
                                        .filter(t => !tags.find(selected => selected.id === t.id))
                                        .filter(t => !tagInput || t.name.toLowerCase().includes(tagInput.toLowerCase()))
                                        .map(tag => (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => handleAddTag(tag)}
                                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center justify-between"
                                            >
                                                {tag.name}
                                                <span className="text-xs text-gray-400">click to add</span>
                                            </button>
                                        ))}
                                    {tagInput && !availableTags.find(t => t.name.toLowerCase() === tagInput.toLowerCase()) && (
                                        <button
                                            type="button"
                                            onClick={handleCreateTag}
                                            className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 font-medium"
                                        >
                                            + Create "{tagInput}"
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="content" className="text-gray-700">Content (Markdown)</Label>
                    <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[400px] font-mono bg-white/80 border-blue-200 text-gray-900"
                        placeholder="# Today I learned..."
                    />
                </div>
            </div>
        </div>
    )
}
