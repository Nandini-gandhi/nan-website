import { cn } from "@/lib/utils"

interface MarkdownViewProps {
    content: string
    className?: string
}

export function MarkdownView({ content, className }: MarkdownViewProps) {
    // Ensure empty paragraphs are visible
    let processedContent = content
    try {
        processedContent = content
            .replace(/<p><\/p>/g, '<p>&nbsp;</p>')
            .replace(/<p>\s*<\/p>/g, '<p>&nbsp;</p>')
    } catch (error) {
        console.error('Error processing content:', error)
        processedContent = content
    }
    
    return (
        <article
            className={cn(
                "prose prose-zinc dark:prose-invert max-w-none break-words",
                "prose-headings:scroll-m-20 prose-headings:font-semibold prose-headings:tracking-tight",
                "prose-h1:text-3xl prose-h1:font-extrabold lg:prose-h1:text-4xl",
                "prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10",
                "prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8",
                "prose-p:leading-7 prose-p:my-4 prose-p:min-h-[1.5em]",
                "prose-strong:font-bold prose-strong:text-gray-900",
                "prose-em:italic prose-em:text-gray-700",
                "prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none",
                "prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto",
                "prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600",
                "prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc prose-ul:space-y-2",
                "prose-ol:my-6 prose-ol:ml-6 prose-ol:list-decimal prose-ol:space-y-2",
                "prose-li:text-gray-700",
                "prose-img:rounded-lg prose-img:border prose-img:border-gray-200 prose-img:shadow-md prose-img:my-6 prose-img:max-w-full prose-img:h-auto",
                "prose-a:text-blue-600 prose-a:underline prose-a:decoration-blue-300 hover:prose-a:text-blue-700",
                "prose-hr:border-gray-300 prose-hr:my-8",
                "[&_img]:max-w-full [&_img]:h-auto",
                className
            )}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: processedContent }}
        />
    )
}
