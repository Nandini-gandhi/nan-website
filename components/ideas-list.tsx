"use client"

import { createIdea, toggleIdea, deleteIdea } from "@/app/actions/ideas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus } from "lucide-react"
import { useState } from "react"

interface Idea {
    id: string
    text: string
    completed: boolean
    createdAt: Date
}

export function IdeasList({ ideas: initialIdeas }: { ideas: Idea[] }) {
    const [ideas, setIdeas] = useState(initialIdeas)
    const [newIdea, setNewIdea] = useState("")

    const handleAdd = async () => {
        if (!newIdea.trim()) return
        const idea = await createIdea(newIdea)
        setIdeas([idea, ...ideas])
        setNewIdea("")
    }

    const handleToggle = async (id: string) => {
        await toggleIdea(id)
        setIdeas(ideas.map(i => i.id === id ? { ...i, completed: !i.completed } : i))
    }

    const handleDelete = async (id: string) => {
        await deleteIdea(id)
        setIdeas(ideas.filter(i => i.id !== id))
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <Input
                    value={newIdea}
                    onChange={(e) => setNewIdea(e.target.value)}
                    placeholder="Add a new idea..."
                    className="bg-white/80 border-blue-200 text-gray-900"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleAdd()
                        }
                    }}
                />
                <Button onClick={handleAdd} disabled={!newIdea.trim()}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
            </div>

            <div className="space-y-2">
                {ideas.map((idea) => (
                    <div
                        key={idea.id}
                        className="flex items-center gap-3 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-blue-100 group"
                    >
                        <Checkbox
                            checked={idea.completed}
                            onCheckedChange={() => handleToggle(idea.id)}
                            className="h-5 w-5"
                        />
                        <span className={`flex-1 text-gray-900 ${idea.completed ? "line-through text-gray-400" : ""}`}>
                            {idea.text}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(idea.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 transition-opacity"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                {ideas.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No ideas yet. Add your first one above!
                    </div>
                )}
            </div>
        </div>
    )
}
