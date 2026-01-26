"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay } from "date-fns"

interface Post {
    id: string
    title: string
    slug: string
    date: Date
    tags: { id: string; name: string; slug: string }[]
}

interface CalendarGridProps {
    posts: Post[]
    currentDate: Date
    onMonthChange: (date: Date) => void
}

// Tag colors for dots
const tagColors: { [key: string]: string } = {
    "books": "bg-amber-500",
    "ideas": "bg-yellow-500",
    "tech": "bg-sky-500",
    "world-news": "bg-emerald-500",
}

function getTagColor(slug: string): string {
    return tagColors[slug] || "bg-blue-500"
}

export function CalendarGrid({ posts, currentDate, onMonthChange }: CalendarGridProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const startDayOfWeek = getDay(monthStart)

    // Get posts for selected date
    const selectedPosts = selectedDate
        ? posts.filter(p => isSameDay(new Date(p.date), selectedDate))
        : []

    const prevMonth = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        onMonthChange(newDate)
    }

    const nextMonth = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        onMonthChange(newDate)
    }

    return (
        <div className="space-y-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-semibold text-gray-900">
                    {format(currentDate, "MMMM yyyy")}
                </h2>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 p-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: startDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {days.map(day => {
                        const dayPosts = posts.filter(p => isSameDay(new Date(p.date), day))
                        const hasPost = dayPosts.length > 0
                        const isSelected = selectedDate && isSameDay(day, selectedDate)

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => setSelectedDate(day)}
                                className={`
                                    aspect-square rounded-xl flex flex-col items-center justify-center p-1
                                    transition-all hover:bg-blue-50
                                    ${isToday(day) ? "ring-2 ring-blue-400" : ""}
                                    ${isSelected ? "bg-blue-100" : ""}
                                `}
                            >
                                <span className={`text-sm ${isToday(day) ? "font-bold text-blue-600" : "text-gray-700"}`}>
                                    {format(day, "d")}
                                </span>
                                {hasPost && (
                                    <div className="flex gap-0.5 mt-1">
                                        {dayPosts.slice(0, 3).map((post, i) => {
                                            const tagSlug = post.tags[0]?.slug || "default"
                                            return (
                                                <span
                                                    key={i}
                                                    className={`w-1.5 h-1.5 rounded-full ${getTagColor(tagSlug)}`}
                                                />
                                            )
                                        })}
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Selected Date Posts */}
            {selectedDate && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </h3>
                    {selectedPosts.length > 0 ? (
                        <div className="space-y-2">
                            {selectedPosts.map(post => (
                                <Link key={post.id} href={`/post/${post.slug}`}>
                                    <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-blue-100 hover:shadow-md transition-all">
                                        <div className="font-medium text-gray-900">{post.title}</div>
                                        <div className="flex gap-1 mt-2">
                                            {post.tags.map(tag => (
                                                <span
                                                    key={tag.id}
                                                    className={`px-2 py-0.5 rounded-full text-xs text-white ${getTagColor(tag.slug)}`}
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No posts on this day.</p>
                    )}
                </div>
            )}
        </div>
    )
}
