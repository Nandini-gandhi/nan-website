"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { Link } from "@tiptap/extension-link"
import { Underline } from "@tiptap/extension-underline"
import { Color } from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import { Button } from "@/components/ui/button"
import { 
    Bold, 
    Italic, 
    Underline as UnderlineIcon, 
    Strikethrough, 
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Image as ImageIcon,
    Link as LinkIcon,
    Undo,
    Redo
} from "lucide-react"

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {
                    HTMLAttributes: {
                        class: 'my-2',
                    },
                },
                hardBreak: {
                    keepMarks: false,
                },
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg my-4',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                },
            }),
            Underline,
            TextStyle,
            Color,
        ],
        content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            onChange(html)
        },
        editorProps: {
            attributes: {
                class: 'prose prose-zinc max-w-none focus:outline-none min-h-[400px] px-4 py-3',
            },
            handlePaste: (view, event) => {
                // Handle image paste
                const items = Array.from(event.clipboardData?.items || [])
                for (const item of items) {
                    if (item.type.indexOf('image') === 0) {
                        event.preventDefault()
                        const file = item.getAsFile()
                        if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                                const img = new window.Image()
                                img.onload = () => {
                                    // Compress pasted image
                                    const canvas = document.createElement('canvas')
                                    let width = img.width
                                    let height = img.height
                                    
                                    // Max dimensions
                                    const maxWidth = 1200
                                    const maxHeight = 1200
                                    
                                    if (width > maxWidth || height > maxHeight) {
                                        if (width > height) {
                                            height = (height / width) * maxWidth
                                            width = maxWidth
                                        } else {
                                            width = (width / height) * maxHeight
                                            height = maxHeight
                                        }
                                    }
                                    
                                    canvas.width = width
                                    canvas.height = height
                                    
                                    const ctx = canvas.getContext('2d')
                                    ctx?.drawImage(img, 0, 0, width, height)
                                    
                                    // Convert to base64 with compression
                                    const compressedUrl = canvas.toDataURL('image/jpeg', 0.8)
                                    editor?.chain().focus().setImage({ src: compressedUrl }).run()
                                }
                                img.src = e.target?.result as string
                            }
                            reader.readAsDataURL(file)
                        }
                        return true
                    }
                }
                return false
            },
        },
    })

    if (!editor) {
        return null
    }

    const addImage = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image is too large. Please use an image smaller than 5MB.')
                    return
                }
                
                const reader = new FileReader()
                reader.onload = (e) => {
                    const img = new window.Image()
                    img.onload = () => {
                        // Compress image if it's large
                        const canvas = document.createElement('canvas')
                        let width = img.width
                        let height = img.height
                        
                        // Max dimensions
                        const maxWidth = 1200
                        const maxHeight = 1200
                        
                        if (width > maxWidth || height > maxHeight) {
                            if (width > height) {
                                height = (height / width) * maxWidth
                                width = maxWidth
                            } else {
                                width = (width / height) * maxHeight
                                height = maxHeight
                            }
                        }
                        
                        canvas.width = width
                        canvas.height = height
                        
                        const ctx = canvas.getContext('2d')
                        ctx?.drawImage(img, 0, 0, width, height)
                        
                        // Convert to base64 with compression
                        const compressedUrl = canvas.toDataURL('image/jpeg', 0.8)
                        editor.chain().focus().setImage({ src: compressedUrl }).run()
                    }
                    img.src = e.target?.result as string
                }
                reader.readAsDataURL(file)
            }
        }
        input.click()
    }

    const addLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) {
            return
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const addColor = () => {
        const color = window.prompt('Enter color (e.g., #3b82f6, blue, rgb(59, 130, 246))')
        if (color) {
            editor.chain().focus().setColor(color).run()
        }
    }

    return (
        <div className="border border-blue-200 rounded-xl bg-white/80 overflow-hidden">
            <div className="border-b border-blue-200 p-2 flex flex-wrap gap-1 bg-gray-50/50">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-blue-100' : ''}
                    title="Bold (Cmd+B)"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-blue-100' : ''}
                    title="Italic (Cmd+I)"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive('underline') ? 'bg-blue-100' : ''}
                    title="Underline (Cmd+U)"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? 'bg-blue-100' : ''}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-gray-300 mx-1" />
                
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'bg-blue-100' : ''}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-blue-100' : ''}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-gray-300 mx-1" />
                
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-blue-100' : ''}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-blue-100' : ''}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'bg-blue-100' : ''}
                    title="Quote"
                >
                    <Quote className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-gray-300 mx-1" />
                
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                    title="Add Image"
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addLink}
                    className={editor.isActive('link') ? 'bg-blue-100' : ''}
                    title="Add Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addColor}
                    title="Text Color"
                >
                    <span className="text-sm font-semibold">A</span>
                </Button>
                
                <div className="w-px h-6 bg-gray-300 mx-1" />
                
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo (Cmd+Z)"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo (Cmd+Shift+Z)"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
            
            <EditorContent editor={editor} className="bg-white text-gray-900" />
        </div>
    )
}
