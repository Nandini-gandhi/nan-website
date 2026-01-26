"use client"

import { useEffect, useState } from "react"
import { CalendarGrid } from "@/components/calendar-grid"
import { getPostsByMonth } from "@/app/actions/posts"

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true)
            const data = await getPostsByMonth(currentDate.getFullYear(), currentDate.getMonth())
            setPosts(data)
            setLoading(false)
        }
        fetchPosts()
    }, [currentDate])

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Calendar</h1>
            <p className="text-gray-600">
                View all your learnings organized by date. Colored dots indicate different tags.
            </p>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : (
                <CalendarGrid
                    posts={posts}
                    currentDate={currentDate}
                    onMonthChange={setCurrentDate}
                />
            )}
        </div>
    )
}
