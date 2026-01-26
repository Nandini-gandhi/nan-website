import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PenTool, Home, Lightbulb, Calendar } from "lucide-react"

export function Navbar() {
    return (
        <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-blue-100">
            <div className="container mx-auto max-w-5xl px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Daily Learnings
                        </h1>
                    </Link>

                    <nav className="flex items-center gap-1">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-100 text-gray-700">
                                <Home className="h-4 w-4" />
                                <span className="hidden md:inline">Home</span>
                            </Button>
                        </Link>
                        <Link href="/ideas">
                            <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-100 text-gray-700">
                                <Lightbulb className="h-4 w-4" />
                                <span className="hidden md:inline">Ideas</span>
                            </Button>
                        </Link>
                        <Link href="/calendar">
                            <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-100 text-gray-700">
                                <Calendar className="h-4 w-4" />
                                <span className="hidden md:inline">Calendar</span>
                            </Button>
                        </Link>
                        <div className="w-px h-6 bg-blue-200 mx-2 hidden md:block" />
                        <Link href="/admin">
                            <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-100 text-blue-600">
                                <PenTool className="h-4 w-4" />
                                <span className="hidden md:inline">Write</span>
                            </Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}

