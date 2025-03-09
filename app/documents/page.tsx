"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, Search, Star, Share2, Folder, Plus } from "lucide-react"

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

export default function DocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"title" | "updatedAt">("updatedAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Document[]
    setDocuments(savedDocs)
  }, [])

  const filteredDocuments = documents
    .filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.folder.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      }
      return sortOrder === "asc"
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

  const toggleStar = (docId: string) => {
    const updatedDocs = documents.map((doc) =>
      doc.id === docId ? { ...doc, starred: !doc.starred } : doc
    )
    setDocuments(updatedDocs)
    localStorage.setItem("documents", JSON.stringify(updatedDocs))
  }

  const toggleShare = (docId: string) => {
    const updatedDocs = documents.map((doc) =>
      doc.id === docId ? { ...doc, shared: !doc.shared } : doc
    )
    setDocuments(updatedDocs)
    localStorage.setItem("documents", JSON.stringify(updatedDocs))
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Documents</h1>
        <Button onClick={() => router.push("/notes/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setSortBy(sortBy === "title" ? "updatedAt" : "title")
            setSortOrder("asc")
          }}
        >
          Sort by {sortBy === "title" ? "Date" : "Name"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Folder</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleStar(doc.id)}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        doc.starred ? "fill-yellow-400 text-yellow-400" : ""
                      }`}
                    />
                  </Button>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/notes/${doc.id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    {doc.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    {doc.folder}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleShare(doc.id)}
                    >
                      <Share2
                        className={`h-4 w-4 ${
                          doc.shared ? "text-blue-500" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredDocuments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No documents found. Create your first document!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 