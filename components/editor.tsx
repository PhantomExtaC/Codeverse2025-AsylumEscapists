"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill")
    return function comp({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />
    }
  },
  { ssr: false }
)

interface EditorProps {
  value: string
  onChange: (content: string) => void
  readOnly?: boolean
}

export default function Editor({ value, onChange, readOnly = false }: EditorProps) {
  const [mounted, setMounted] = useState(false)
  const quillRef = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const modules = {
    toolbar: readOnly ? false : [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["clean"],
    ],
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "align",
  ]

  if (!mounted) {
    return <div className="min-h-[500px] border rounded-lg bg-gray-50 animate-pulse" />
  }

  return (
    <div className="min-h-[500px] border rounded-lg">
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        readOnly={readOnly}
        className="h-[450px]"
      />
    </div>
  )
} 