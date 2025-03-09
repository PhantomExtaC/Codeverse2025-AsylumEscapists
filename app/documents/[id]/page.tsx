"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { doc, onSnapshot, updateDoc, addDoc, documentsRef } from "@/lib/firebase"
import { db } from "@/lib/firebase"
import { ShareDocument } from "@/components/share-document"
import { useAuth } from "@/lib/auth"

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => <div className="min-h-[500px] border rounded-lg bg-gray-50 animate-pulse" />,
})

interface DocumentData {
  title: string
  content: string
  createdBy: string
  collaborators: string[]
  lastEditedBy: string
  updatedAt: string
}

export default function DocumentPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [document, setDocument] = useState<DocumentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id || !user) return

    if (id === "new") {
      setDocument({
        title: "Untitled Document",
        content: "",
        createdBy: user.email || "",
        collaborators: [],
        lastEditedBy: user.email || "",
        updatedAt: new Date().toISOString()
      })
      setLoading(false)
      return
    }

    const docRef = doc(db, "documents", id as string)
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as DocumentData
        if (data.createdBy === user.email || data.collaborators.includes(user.email)) {
          setDocument(data)
        } else {
          setError("You don't have permission to view this document")
        }
      } else {
        setError("Document not found")
      }
      setLoading(false)
    }, (error) => {
      console.error("Error fetching document:", error)
      setError("Error loading document")
      setLoading(false)
    })

    return () => unsubscribe()
  }, [id, user])

  const handleContentChange = async (content: string) => {
    if (!user || !document) return

    try {
      if (id === "new") {
        // Create new document
        const newDoc = await addDoc(documentsRef, {
          ...document,
          content,
          lastEditedBy: user.email,
          updatedAt: new Date().toISOString()
        })
        router.push(`/documents/${newDoc.id}`)
      } else {
        // Update existing document
        const docRef = doc(db, "documents", id as string)
        await updateDoc(docRef, {
          content,
          lastEditedBy: user.email,
          updatedAt: new Date().toISOString()
        })
      }
    } catch (err) {
      console.error("Error updating document:", err)
      setError("Failed to save changes")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>
  }

  if (!document) {
    return <div className="flex items-center justify-center min-h-screen">Document not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{document.title}</h1>
        <div className="flex items-center gap-4">
          {id !== "new" && (
            <ShareDocument 
              documentId={id as string} 
              currentCollaborators={document.collaborators} 
            />
          )}
          <div className="text-sm text-gray-500">
            Last edited by {document.lastEditedBy}
          </div>
        </div>
      </div>
      <Editor
        value={document.content}
        onChange={handleContentChange}
        readOnly={id !== "new" && document.createdBy !== user.email && !document.collaborators.includes(user.email)}
      />
    </div>
  )
} 