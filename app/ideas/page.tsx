import { getIdeas } from "@/app/actions/ideas"
import { IdeasList } from "@/components/ideas-list"

export const dynamic = "force-dynamic"

export default async function IdeasPage() {
    const ideas = await getIdeas()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Ideas</h1>
            </div>

            <p className="text-gray-600">
                A simple checklist for all your ideas, thoughts, and to-dos.
            </p>

            <IdeasList ideas={ideas} />
        </div>
    )
}
