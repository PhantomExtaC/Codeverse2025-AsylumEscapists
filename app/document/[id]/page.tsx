"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Editor from "@/components/editor"
import { ArrowLeft, Save, Plus, Folder } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Note {
  id: string
  title: string
  content: string
  updatedAt: string
  folder: string
}

interface DocumentData {
  id: string
  title: string
  notes: Note[]
  folders: string[]
}

export default function DocumentPage() {
  const params = useParams()
  const router = useRouter()
  const [document, setDocument] = useState<DocumentData>({
    id: params.id as string,
    title: "My Document",
    notes: [],
    folders: ["Work", "Personal", "Finance"]
  })
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load document data from localStorage
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]")
    const doc = savedDocs.find((d: any) => d.id === params.id)
    if (doc) {
      setDocument(doc)
    }
  }, [params.id])

  const handleCreateNote = (folder: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "Untitled Note",
      content: "",
      updatedAt: new Date().toISOString(),
      folder
    }

    setDocument(prev => ({
      ...prev,
      notes: [...prev.notes, newNote]
    }))
  }

  const handleSaveNote = (noteId: string, content: string) => {
    setDocument(prev => ({
      ...prev,
      notes: prev.notes.map(note =>
        note.id === noteId
          ? { ...note, content, updatedAt: new Date().toISOString() }
          : note
      )
    }))
  }

  const filteredNotes = selectedFolder
    ? document.notes.filter(note => note.folder === selectedFolder)
    : document.notes

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Input
            type="text"
            value={document.title}
            onChange={(e) => setDocument(prev => ({ ...prev, title: e.target.value }))}
            className="text-2xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          />
        </div>
        <Button onClick={() => {
          localStorage.setItem("documents", JSON.stringify([document]))
          setIsSaving(true)
          setTimeout(() => setIsSaving(false), 1000)
        }} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Folders</CardTitle>
              <CardDescription>Organize your notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedFolder === null ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFolder(null)}
              >
                <Folder className="mr-2 h-4 w-4" />
                All Notes
              </Button>
              {document.folders.map(folder => (
                <Button
                  key={folder}
                  variant={selectedFolder === folder ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder(folder)}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  {folder}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {selectedFolder ? selectedFolder : "All Notes"}
            </h2>
            <Button onClick={() => handleCreateNote(selectedFolder || "Work")}>
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </div>

          {filteredNotes.map(note => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle>
                  <Input
                    type="text"
                    value={note.title}
                    onChange={(e) => {
                      setDocument(prev => ({
                        ...prev,
                        notes: prev.notes.map(n =>
                          n.id === note.id
                            ? { ...n, title: e.target.value }
                            : n
                        )
                      }))
                    }}
                    className="text-xl font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                  />
                </CardTitle>
                <CardDescription>
                  Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Editor
                  value={note.content}
                  onChange={(content) => handleSaveNote(note.id, content)}
                  readOnly={false}
                />
              </CardContent>
            </Card>
          ))}

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No notes yet</h3>
              <p className="text-muted-foreground mt-2">
                Create your first note in this {selectedFolder ? `${selectedFolder} folder` : "document"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 