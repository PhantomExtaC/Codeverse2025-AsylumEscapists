"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DocumentEditor } from "@/components/document-editor"

export default function NewNotePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a title for your note.")
      return
    }

    try {
      setIsSaving(true)
      // Create a new document with the note content
      const newDoc = {
        id: `note-${Date.now()}`,
        title: title.trim(),
        content: content,
        updatedAt: new Date().toISOString(),
        createdBy: "Current User",
        shared: false,
        sharedWith: [],
        lastEditedBy: "Current User",
        starred: false,
        folder: "Notes",
        type: "note"
      }

      // Get existing documents from localStorage
      const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]")
      
      // Add new document to the array
      const updatedDocs = [newDoc, ...existingDocs]
      
      // Save back to localStorage
      localStorage.setItem("documents", JSON.stringify(updatedDocs))
      console.log("Document saved:", newDoc)
      
      router.push("/notes")
    } catch (error) {
      console.error("Error saving document:", error)
      alert("Error saving the note. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">New Note</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/notes")}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />
          <div className="min-h-[500px] border rounded-lg p-4">
            <DocumentEditor
              initialContent={content}
              onChange={setContent}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 