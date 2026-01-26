"use client"

import { renameTag, deleteTag } from "@/app/actions/tags"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Check, X } from "lucide-react"
import { useState } from "react"

interface Tag {
    id: string
    name: string
    slug: string
}

export function TagManager({ tags: initialTags }: { tags: Tag[] }) {
    const [tags, setTags] = useState(initialTags)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editValue, setEditValue] = useState("")

    const startEdit = (tag: Tag) => {
        setEditingId(tag.id)
        setEditValue(tag.name)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditValue("")
    }

    const saveEdit = async (id: string) => {
        if (!editValue.trim()) return
        const updated = await renameTag(id, editValue)
        setTags(tags.map(t => t.id === id ? updated : t))
        setEditingId(null)
        setEditValue("")
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this tag? Posts with this tag will lose it.")) return
        await deleteTag(id)
        setTags(tags.filter(t => t.id !== id))
    }

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Tags</h3>
            {tags.length === 0 ? (
                <p className="text-gray-500">No tags yet.</p>
            ) : (
                tags.map(tag => (
                    <div
                        key={tag.id}
                        className="flex items-center gap-2 p-3 rounded-xl bg-white/80 border border-blue-100"
                    >
                        {editingId === tag.id ? (
                            <>
                                <Input
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="flex-1 bg-white border-blue-200 text-gray-900"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") saveEdit(tag.id)
                                        if (e.key === "Escape") cancelEdit()
                                    }}
                                    autoFocus
                                />
                                <Button variant="ghost" size="icon" onClick={() => saveEdit(tag.id)} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={cancelEdit} className="text-gray-500 hover:text-gray-700">
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <span className="flex-1 text-gray-900">{tag.name}</span>
                                <span className="text-xs text-gray-400">/{tag.slug}</span>
                                <Button variant="ghost" size="icon" onClick={() => startEdit(tag)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(tag.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    )
}
