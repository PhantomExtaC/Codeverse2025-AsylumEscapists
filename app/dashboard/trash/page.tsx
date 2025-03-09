"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { ArrowLeft, Trash2, RotateCcw, FileText } from "lucide-react"
import { toast } from "sonner"

interface Note {
  id: string
  title: string
  content: string
  updatedAt: string
  createdBy: string
  deletedAt: string
  folder: string
  type: 'note' | 'document'
}

export default function TrashPage() {
  const router = useRouter()
  const [trashedNotes, setTrashedNotes] = useState<Note[]>(() => {
    // Load trashed notes from localStorage
    const saved = localStorage.getItem("trashedNotes")
    return saved ? JSON.parse(saved) : []
  })
  const [isConfirmingEmpty, setIsConfirmingEmpty] = useState(false)

  useEffect(() => {
    // Save trashed notes whenever they change
    localStorage.setItem("trashedNotes", JSON.stringify(trashedNotes))
  }, [trashedNotes])

  const handleRestore = (note: Note) => {
    // Remove from trash
    setTrashedNotes(prev => prev.filter(n => n.id !== note.id))

    // Add back to documents
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Note[]
    const restoredNote = {
      ...note,
      deletedAt: undefined
    }
    localStorage.setItem("documents", JSON.stringify([restoredNote, ...savedDocs]))

    toast.success(`Restored "${note.title}"`)
  }

  const handleDelete = (note: Note) => {
    setTrashedNotes(prev => prev.filter(n => n.id !== note.id))
    toast.success(`Permanently deleted "${note.title}"`)
  }

  const handleEmptyTrash = () => {
    setTrashedNotes([])
    setIsConfirmingEmpty(false)
    toast.success("Trash emptied successfully")
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trash2 className="h-6 w-6" />
            Trash
          </h1>
        </div>
        {trashedNotes.length > 0 && (
          <Dialog open={isConfirmingEmpty} onOpenChange={setIsConfirmingEmpty}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                Empty Trash
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Empty Trash</DialogTitle>
                <DialogDescription>
                  Are you sure you want to permanently delete all items in the trash? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmingEmpty(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleEmptyTrash}>
                  Empty Trash
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trashedNotes.map(note => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {note.title}
              </CardTitle>
              <CardDescription>
                Deleted: {new Date(note.deletedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {note.content.replace(/<[^>]*>/g, '')}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRestore(note)}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(note)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {trashedNotes.length === 0 && (
        <div className="text-center py-12">
          <Trash2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Trash is empty</h3>
          <p className="mt-2 text-muted-foreground">
            Items in trash will be automatically deleted after 30 days
          </p>
        </div>
      )}
    </div>
  )
} 