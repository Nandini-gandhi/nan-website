"use client"
import { format } from "date-fns"

export function FeedHeader() {
    const today = new Date()

    return (
        <div className="mb-12 mt-6">
            <h2 className="text-5xl font-bold text-gray-900 mb-3">
                Things I learned today
            </h2>
            <p className="text-xl text-blue-600">
                {format(today, "EEEE, MMMM do, yyyy")}
            </p>
        </div>
    )
}
