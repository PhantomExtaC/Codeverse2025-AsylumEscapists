"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Editor from "@/components/editor"
import { ArrowLeft, Save, Users, UserPlus, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

interface TeamMember {
  id: string
  email: string
  role: "admin" | "member"
  status: "active" | "pending"
  joinedAt: string
}

export default function NotePage() {
  const params = useParams()
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [isCollaborateDialogOpen, setIsCollaborateDialogOpen] = useState(false)
  const [collaboratorEmail, setCollaboratorEmail] = useState("")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load note from localStorage
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Note[]
    const currentNote = savedDocs.find(doc => doc.id === params.id)
    if (currentNote) {
      setNote(currentNote)
    }

    // Load team members
    const savedTeamMembers = JSON.parse(localStorage.getItem("teamMembers") || "[]") as TeamMember[]
    setTeamMembers(savedTeamMembers)
  }, [params.id])

  const handleSave = () => {
    if (!note) return

    setIsSaving(true)
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Note[]
    const updatedDocs = savedDocs.map(doc =>
      doc.id === note.id ? { ...note, updatedAt: new Date().toISOString() } : doc
    )
    localStorage.setItem("documents", JSON.stringify(updatedDocs))
    
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Note saved successfully")
    }, 500)
  }

  const handleAddCollaborator = () => {
    if (!collaboratorEmail.trim() || !collaboratorEmail.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    if (!note) return

    // Check if email is already a collaborator
    if (note.sharedWith.includes(collaboratorEmail)) {
      toast.error("This person is already a collaborator")
      return
    }

    // Check if email exists in team members
    const isTeamMember = teamMembers.some(member => member.email === collaboratorEmail)
    if (!isTeamMember) {
      toast.error("This person is not a team member. Add them to your team first.")
      return
    }

    const updatedNote = {
      ...note,
      shared: true,
      sharedWith: [...note.sharedWith, collaboratorEmail]
    }

    // Update in localStorage
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Note[]
    const updatedDocs = savedDocs.map(doc =>
      doc.id === note.id ? updatedNote : doc
    )
    localStorage.setItem("documents", JSON.stringify(updatedDocs))

    setNote(updatedNote)
    setCollaboratorEmail("")
    toast.success(`Added ${collaboratorEmail} as a collaborator`)
  }

  const handleRemoveCollaborator = (email: string) => {
    if (!note) return

    const updatedNote = {
      ...note,
      sharedWith: note.sharedWith.filter(e => e !== email),
      shared: note.sharedWith.length > 1
    }

    // Update in localStorage
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Note[]
    const updatedDocs = savedDocs.map(doc =>
      doc.id === note.id ? updatedNote : doc
    )
    localStorage.setItem("documents", JSON.stringify(updatedDocs))

    setNote(updatedNote)
    toast.success(`Removed ${email} from collaborators`)
  }

  if (!note) {
    return (
      <div className="container py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Note not found</h1>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Input
            type="text"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="text-2xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCollaborateDialogOpen} onOpenChange={setIsCollaborateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Collaborators
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Note Collaborators</DialogTitle>
                <DialogDescription>
                  Add or remove collaborators for this note
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {note.sharedWith?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Collaborators</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {note.sharedWith.map(email => (
                        <div key={email} className="flex items-center justify-between">
                          <span className="text-sm">{email}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCollaborator(email)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="colleague@company.com"
                    type="email"
                    value={collaboratorEmail}
                    onChange={(e) => setCollaboratorEmail(e.target.value)}
                  />
                  <Button onClick={handleAddCollaborator}>
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Editor
        value={note.content}
        onChange={(content) => setNote({ ...note, content })}
      />

      <div className="mt-4 text-sm text-muted-foreground">
        Last updated: {new Date(note.updatedAt).toLocaleString()}
        {note.lastEditedBy && ` by ${note.lastEditedBy}`}
      </div>
    </div>
  )
} 