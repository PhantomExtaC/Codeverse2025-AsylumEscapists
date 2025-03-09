"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
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
import { Folder, Plus, FileText } from "lucide-react"

interface Document {
  id: string
  title: string
  content: string
  updatedAt: string
  createdBy: string
  shared: boolean
  starred: boolean
  folder: string
  type: 'note' | 'document'
}

interface FolderData {
  name: string
  documents: Document[]
}

export default function FoldersPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [newFolderName, setNewFolderName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Document[]
    setDocuments(savedDocs)
  }, [])

  const folders = documents.reduce((acc, doc) => {
    const folder = acc.find((f) => f.name === doc.folder)
    if (folder) {
      folder.documents.push(doc)
    } else {
      acc.push({ name: doc.folder, documents: [doc] })
    }
    return acc
  }, [] as FolderData[])

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return

    const updatedDocs = documents.map((doc) => {
      if (doc.folder === "My Notes") {
        return { ...doc, folder: newFolderName }
      }
      return doc
    })

    setDocuments(updatedDocs)
    localStorage.setItem("documents", JSON.stringify(updatedDocs))
    setNewFolderName("")
    setIsDialogOpen(false)
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Folders</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Enter a name for your new folder.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder) => (
          <Card key={folder.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                {folder.name}
              </CardTitle>
              <CardDescription>
                {folder.documents.length} document{folder.documents.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {folder.documents.slice(0, 3).map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/notes/${doc.id}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <FileText className="h-4 w-4" />
                    {doc.title}
                  </Link>
                ))}
                {folder.documents.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    +{folder.documents.length - 3} more
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {folders.length === 0 && (
        <div className="text-center py-12">
          <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No folders yet</h2>
          <p className="mt-2 text-muted-foreground">
            Create your first folder to organize your documents.
          </p>
        </div>
      )}
    </div>
  )
} 