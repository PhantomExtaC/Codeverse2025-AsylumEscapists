"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { doc, updateDoc, arrayUnion } from "@/lib/firebase"
import { db } from "@/lib/firebase"
import { Share } from "lucide-react"

interface ShareDocumentProps {
  documentId: string
  currentCollaborators: string[]
}

export function ShareDocument({ documentId, currentCollaborators }: ShareDocumentProps) {
  const [email, setEmail] = useState("")
  const [isSharing, setIsSharing] = useState(false)
  const [error, setError] = useState("")

  const handleShare = async () => {
    if (!email) return

    setIsSharing(true)
    setError("")

    try {
      const docRef = doc(db, "documents", documentId)
      await updateDoc(docRef, {
        collaborators: arrayUnion(email),
        updatedAt: new Date().toISOString()
      })
      setEmail("")
    } catch (err) {
      setError("Failed to share document. Please try again.")
      console.error("Error sharing document:", err)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Share with email</label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleShare} disabled={isSharing}>
                {isSharing ? "Sharing..." : "Share"}
              </Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          {currentCollaborators.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Current collaborators</label>
              <ul className="space-y-2">
                {currentCollaborators.map((collaborator) => (
                  <li key={collaborator} className="text-sm">
                    {collaborator}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 