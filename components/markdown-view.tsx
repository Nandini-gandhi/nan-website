import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface MarkdownViewProps {
    content: string
    className?: string
}

export function MarkdownView({ content, className }: MarkdownViewProps) {
    return (
        <article
            className={cn(
                "prose prose-zinc dark:prose-invert max-w-none break-words",
                "prose-headings:scroll-m-20 prose-headings:font-semibold prose-headings:tracking-tight",
                "prose-h1:text-3xl prose-h1:font-extrabold lg:prose-h1:text-4xl",
                "prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10",
                "prose-p:leading-7 prose-p:not-first:mt-6",
                "prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic",
                "prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc",
                "prose-img:rounded-md prose-img:border",
                className
            )}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
    )
}
