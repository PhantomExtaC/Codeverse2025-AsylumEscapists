"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, FileText, Plus, Folder, Share2, Users, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Note {
  id: string
  title: string
  content: string
  updatedAt: string
  createdBy: string
  shared: boolean
  sharedWith: string[]
  lastEditedBy: string
  folder: string
  type: 'note' | 'document'
}

export default function FolderPage() {
  const params = useParams()
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [newSubfolderName, setNewSubfolderName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [shareEmail, setShareEmail] = useState("")
  const folderName = decodeURIComponent(params.name as string)

  useEffect(() => {
    // Load notes from localStorage
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Note[]
    const folderNotes = savedDocs.filter(doc => doc.folder === folderName)
    setNotes(folderNotes)
  }, [folderName])

  const handleCreateNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "Untitled Note",
      content: "",
      updatedAt: new Date().toISOString(),
      createdBy: "Current User",
      shared: false,
      sharedWith: [],
      lastEditedBy: "Current User",
      folder: folderName,
      type: "note"
    }

    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Note[]
    const updatedDocs = [newNote, ...savedDocs]
    localStorage.setItem("documents", JSON.stringify(updatedDocs))
    setNotes(prev => [newNote, ...prev])
    router.push(`/notes/${newNote.id}`)
  }

  const handleCreateSubfolder = () => {
    if (!newSubfolderName.trim()) return

    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Note[]
    const updatedDocs = savedDocs.map(doc => {
      if (doc.folder === folderName) {
        return { ...doc, folder: `${folderName}/${newSubfolderName}` }
      }
      return doc
    })

    localStorage.setItem("documents", JSON.stringify(updatedDocs))
    setNewSubfolderName("")
    setIsDialogOpen(false)
    router.refresh()
  }

  const handleShareNote = () => {
    if (!shareEmail.trim() || !shareEmail.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    if (!selectedNote) return

    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Note[]
    const updatedDocs = savedDocs.map(doc => {
      if (doc.id === selectedNote.id) {
        return {
          ...doc,
          shared: true,
          sharedWith: [...(doc.sharedWith || []), shareEmail]
        }
      }
      return doc
    })

    localStorage.setItem("documents", JSON.stringify(updatedDocs))
    setNotes(prev => prev.map(note => 
      note.id === selectedNote.id
        ? { ...note, shared: true, sharedWith: [...(note.sharedWith || []), shareEmail] }
        : note
    ))
    setShareEmail("")
    setIsShareDialogOpen(false)
    setSelectedNote(null)
    toast.success(`Note shared with ${shareEmail}`)
  }

  const handleMoveToTrash = (note: Note) => {
    // Add to trash
    const trashedNote = {
      ...note,
      deletedAt: new Date().toISOString()
    }
    const savedTrashedNotes = JSON.parse(localStorage.getItem("trashedNotes") || "[]")
    localStorage.setItem("trashedNotes", JSON.stringify([trashedNote, ...savedTrashedNotes]))

    // Remove from documents
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Note[]
    const updatedDocs = savedDocs.filter(doc => doc.id !== note.id)
    localStorage.setItem("documents", JSON.stringify(updatedDocs))

    setNotes(prev => prev.filter(n => n.id !== note.id))
    toast.success(`Moved "${note.title}" to trash`)
  }

  const subfolders = Array.from(
    new Set(notes.map(note => {
      const parts = note.folder.split('/')
      return parts.length > 1 ? parts[1] : null
    }).filter(Boolean))
  )

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Folder className="h-6 w-6" />
            {folderName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Folder className="mr-2 h-4 w-4" />
                New Subfolder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Subfolder</DialogTitle>
                <DialogDescription>
                  Create a subfolder within {folderName}
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Subfolder name"
                value={newSubfolderName}
                onChange={(e) => setNewSubfolderName(e.target.value)}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSubfolder}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleCreateNote}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      {subfolders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Subfolders</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subfolders.map(subfolder => (
              <Card key={subfolder}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5" />
                    {subfolder}
                  </CardTitle>
                  <CardDescription>
                    {notes.filter(n => n.folder === `${folderName}/${subfolder}`).length} notes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => router.push(`/dashboard/folders/${encodeURIComponent(`${folderName}/${subfolder}`)}`)}
                  >
                    View Subfolder
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Notes</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.filter(note => note.folder === folderName).map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {note.title}
                  {note.shared && (
                    <Users className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardTitle>
                <CardDescription>
                  Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                  {note.lastEditedBy && ` by ${note.lastEditedBy}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/notes/${note.id}`}>
                  <Button variant="ghost" className="w-full">View Note</Button>
                </Link>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedNote(note)
                    setIsShareDialogOpen(true)
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveToTrash(note)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {notes.filter(note => note.folder === folderName).length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No notes in this folder</h3>
            <p className="mt-2 text-muted-foreground">
              Create your first note to get started
            </p>
          </div>
        )}
      </div>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Note</DialogTitle>
            <DialogDescription>
              Share "{selectedNote?.title}" with team members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedNote?.sharedWith && selectedNote.sharedWith.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Shared with:</h4>
                <div className="space-y-1">
                  {selectedNote.sharedWith.map(email => (
                    <div key={email} className="text-sm text-muted-foreground">
                      {email}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                placeholder="colleague@company.com"
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsShareDialogOpen(false)
              setSelectedNote(null)
              setShareEmail("")
            }}>
              Cancel
            </Button>
            <Button onClick={handleShareNote}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 