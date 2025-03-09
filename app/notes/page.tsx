"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Note {
  id: string
  title: string
  content: string
  updatedAt: string
  type: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load documents from localStorage
    const documents = JSON.parse(localStorage.getItem("documents") || "[]")
    // Filter only notes
    const notesList = documents.filter((doc: Note) => doc.type === "note")
    setNotes(notesList)
  }, [])

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <Button onClick={() => router.push("/notes/new")}>New Note</Button>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-accent"
                onClick={() => router.push(`/notes/${note.id}`)}
              >
                <h2 className="font-semibold mb-2">{note.title}</h2>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Last updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 