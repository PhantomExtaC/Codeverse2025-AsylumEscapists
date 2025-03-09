"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Plus, Search, Star, Clock, Folder, MoreVertical, Trash, Share, Copy, Users } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

import { MobileDashboardNav } from "@/components/mobile-dashboard-nav"

interface Document {
  id: string
  title: string
  content?: string
  updatedAt: string
  createdBy: string
  shared: boolean
  starred: boolean
  folder: string
  type?: 'note' | 'document'
}

// Update mock documents to include type
const mockDocuments: Document[] = [
  {
    id: "doc-1",
    title: "Project Proposal",
    updatedAt: "2024-02-25T14:30:00Z",
    createdBy: "John Doe",
    shared: true,
    starred: true,
    folder: "Work",
    type: "document"
  },
  {
    id: "doc-2",
    title: "Meeting Notes",
    updatedAt: "2024-02-24T10:15:00Z",
    createdBy: "John Doe",
    shared: true,
    starred: false,
    folder: "Work",
    type: "document"
  },
  {
    id: "doc-3",
    title: "Budget Planning",
    updatedAt: "2024-02-23T16:45:00Z",
    createdBy: "John Doe",
    shared: false,
    starred: true,
    folder: "Finance",
    type: "document"
  },
  {
    id: "doc-4",
    title: "Marketing Strategy",
    updatedAt: "2024-02-22T09:20:00Z",
    createdBy: "John Doe",
    shared: true,
    starred: false,
    folder: "Marketing",
    type: "document"
  },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const { user } = useAuth()
  

  // Load documents from localStorage on component mount
  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Document[]
    setDocuments([...mockDocuments, ...savedDocs])
  }, [])

  // Filter documents based on search query and active tab
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "shared") return matchesSearch && doc.shared
    if (activeTab === "starred") return matchesSearch && doc.starred
    if (activeTab === "recent") return matchesSearch // In a real app, you'd filter by date
    if (activeTab === "notes") return matchesSearch && doc.type === "note"

    return matchesSearch
  })

  const handleCreateDocument = () => {
    const newDoc: Document = {
      id: `doc-${documents.length + 1}`,
      title: "Untitled Document",
      updatedAt: new Date().toISOString(),
      createdBy: user?.name || "Unknown",
      shared: false,
      starred: false,
      folder: "My Documents",
      type: "document"
    }

    setDocuments([newDoc, ...documents])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="flex flex-col">
      <div className="md:hidden">
        <MobileDashboardNav />
      </div>
      <div className="container py-6 md:py-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/notes">
                    <FileText className="mr-2 h-4 w-4" />
                    View Notes
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/notes/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Note
                  </Link>
                </Button>
              </div>
            </div>
            <Button onClick={handleCreateDocument}>
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </Button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              {filteredDocuments.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredDocuments.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No documents found"
                  description="Create a new document or try a different search term."
                  action={
                    <Button onClick={handleCreateDocument}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Document
                    </Button>
                  }
                />
              )}
            </TabsContent>
            <TabsContent value="notes" className="mt-6">
              {filteredDocuments.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredDocuments.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              ) : (
                <EmptyState title="No notes found" description="Notes you've created will appear here." />
              )}
            </TabsContent>
            <TabsContent value="shared" className="mt-6">
              {filteredDocuments.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredDocuments.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              ) : (
                <EmptyState title="No shared documents" description="Documents shared with you will appear here." />
              )}
            </TabsContent>
            <TabsContent value="starred" className="mt-6">
              {filteredDocuments.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredDocuments.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              ) : (
                <EmptyState title="No starred documents" description="Star documents to add them to this list." />
              )}
            </TabsContent>
            <TabsContent value="recent" className="mt-6">
              {filteredDocuments.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredDocuments.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No recent documents"
                  description="Documents you've recently viewed or edited will appear here."
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function DocumentCard({ document }: { document: Document }) {
 

  const handleStar = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
   
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
  }
  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
  }

  return (
    <Link href={document.type === "note" ? `/notes/${document.id}` : `/document/${document.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:border-primary/50">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1 text-base">{document.title}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-1">
                <Folder className="h-3 w-3" />
                <span className="text-xs">{document.folder}</span>
              </div>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleStar}>
                <Star className="mr-2 h-4 w-4" />
                {document.starred ? "Remove from starred" : "Add to starred"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          {document.type === "note" ? (
            <div className="h-24 rounded-md border bg-muted/50 p-3 overflow-hidden">
              <div className="line-clamp-4 text-sm text-muted-foreground" 
                   dangerouslySetInnerHTML={{ __html: document.content || "" }} />
            </div>
          ) : (
            <div className="h-24 rounded-md border bg-muted/50 flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground/70" />
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
             
            </div>
            {document.shared && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Shared</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <FileText className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  )
}


