"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"
import { Button } from "@/components/ui/button"
import { Loader2, Wand2 } from "lucide-react"

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-48">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ),
})

interface EditorProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
}

export default function Editor({ value, onChange, readOnly = false }: EditorProps) {
  const [mounted, setMounted] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSummarize = async () => {
    if (!value.trim()) {
      return
    }

    setIsSummarizing(true)
    try {
      // Here you would typically call an AI service to summarize the text
      // For now, we'll just create a simple summary
      const words = value.split(/\s+/)
      const summary = words.slice(0, 50).join(" ") + "..."
      onChange(summary)
    } catch (error) {
      console.error("Failed to summarize:", error)
    } finally {
      setIsSummarizing(false)
    }
  }

  if (!mounted) {
    return null
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSummarize}
          disabled={isSummarizing || !value.trim()}
          className="gap-2"
        >
          {isSummarizing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          Summarize
        </Button>
      </div>
      <div className="editor-container">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          readOnly={readOnly}
          className="bg-background text-foreground"
        />
      </div>
      <style jsx global>{`
        .ql-toolbar {
          background-color: hsl(var(--background));
          border-color: hsl(var(--border)) !important;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .ql-container {
          background-color: hsl(var(--background));
          border-color: hsl(var(--border)) !important;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          min-height: 200px;
          color: hsl(var(--foreground));
        }
        .ql-editor {
          font-size: 1rem;
          line-height: 1.5;
          padding: 1rem;
        }
        .ql-editor p {
          color: hsl(var(--foreground));
        }
        .ql-snow .ql-stroke {
          stroke: hsl(var(--foreground));
        }
        .ql-snow .ql-fill {
          fill: hsl(var(--foreground));
        }
        .ql-snow .ql-picker {
          color: hsl(var(--foreground));
        }
        .ql-snow .ql-picker-options {
          background-color: hsl(var(--background));
          border-color: hsl(var(--border)) !important;
        }
        .ql-snow .ql-picker.ql-expanded .ql-picker-label {
          border-color: hsl(var(--border)) !important;
        }
        .ql-snow .ql-picker.ql-expanded .ql-picker-options {
          border-color: hsl(var(--border)) !important;
        }
        .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
          background-color: hsl(var(--background));
        }
      `}</style>
    </div>
  )
} 