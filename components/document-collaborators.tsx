"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { UserPlus, X } from "lucide-react"

type Collaborator = {
  id: string
  name: string
  email: string
  image?: string
  role: "editor" | "viewer" | "owner"
}

export function DocumentCollaborators({
  documentId,
  collaborators,
}: {
  documentId: string
  collaborators: Collaborator[]
}) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"editor" | "viewer">("viewer")
  const [localCollaborators, setLocalCollaborators] = useState<Collaborator[]>(collaborators)
  const { toast } = useToast()

  const handleAddCollaborator = () => {
    if (!email) return

    // Check if email is already a collaborator
    if (localCollaborators.some((c) => c.email === email)) {
      toast({
        title: "Error",
        description: "This user is already a collaborator",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would send an invitation to the user
    const newCollaborator: Collaborator = {
      id: `user-${Date.now()}`,
      name: email.split("@")[0], // Just for demo
      email,
      role,
    }

    setLocalCollaborators([...localCollaborators, newCollaborator])
    setEmail("")
    toast({
      title: "Collaborator added",
      description: `${email} has been added as a ${role}`,
    })
  }

  const handleRemoveCollaborator = (id: string) => {
    setLocalCollaborators(localCollaborators.filter((c) => c.id !== id))
    toast({
      title: "Collaborator removed",
      description: "The collaborator has been removed from this document",
    })
  }

  const handleRoleChange = (id: string, newRole: "editor" | "viewer") => {
    setLocalCollaborators(localCollaborators.map((c) => (c.id === id ? { ...c, role: newRole } : c)))
    toast({
      title: "Role updated",
      description: `Collaborator role has been updated to ${newRole}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-4">Add collaborators</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Select value={role} onValueChange={(value) => setRole(value as "editor" | "viewer")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="editor">Can edit</SelectItem>
              <SelectItem value="viewer">Can view</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddCollaborator}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">People with access</h3>
        </div>
        <div className="divide-y">
          {localCollaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={collaborator.image} alt={collaborator.name} />
                  <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{collaborator.name}</p>
                  <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {collaborator.role !== "owner" ? (
                  <>
                    <Select
                      value={collaborator.role}
                      onValueChange={(value) => handleRoleChange(collaborator.id, value as "editor" | "viewer")}
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="editor">Can edit</SelectItem>
                        <SelectItem value="viewer">Can view</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveCollaborator(collaborator.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <span className="text-xs font-medium">Owner</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

