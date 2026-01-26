"use client"

import { deletePost } from "@/app/actions/posts"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"

export function DeletePostButton({ postId }: { postId: string }) {
    const [confirming, setConfirming] = useState(false)

    const handleDelete = async () => {
        await deletePost(postId)
    }

    if (confirming) {
        return (
            <div className="flex items-center gap-2">
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                    Confirm
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                    Cancel
                </Button>
            </div>
        )
    }

    return (
        <Button variant="ghost" size="icon" onClick={() => setConfirming(true)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}
