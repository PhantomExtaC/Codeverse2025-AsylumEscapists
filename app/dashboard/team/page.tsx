"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Plus, UserPlus, Mail, X } from "lucide-react"
import { toast } from "sonner"

interface TeamMember {
  id: string
  email: string
  role: "admin" | "member"
  status: "active" | "pending"
  joinedAt: string
}

export default function TeamPage() {
  const router = useRouter()
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    // Load team members from localStorage
    const saved = localStorage.getItem("teamMembers")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    // Save team members to localStorage whenever it changes
    localStorage.setItem("teamMembers", JSON.stringify(teamMembers))
  }, [teamMembers])

  const handleInviteMember = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    // Check if email already exists
    if (teamMembers.some(member => member.email === inviteEmail)) {
      toast.error("This email is already part of the team")
      return
    }

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      email: inviteEmail,
      role: "member",
      status: "pending",
      joinedAt: new Date().toISOString()
    }

    setTeamMembers(prev => [...prev, newMember])
    setInviteEmail("")
    setIsInviteDialogOpen(false)
    toast.success(`Invitation sent to ${inviteEmail}`)
  }

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId))
    toast.success("Team member removed")
  }

  const handleToggleRole = (memberId: string) => {
    setTeamMembers(prev =>
      prev.map(member =>
        member.id === memberId
          ? { ...member, role: member.role === "admin" ? "member" : "admin" }
          : member
      )
    )
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Team Management
          </h1>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to collaborate on documents and notes
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="colleague@company.com"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteMember}>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team members and their access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teamMembers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleRole(member.id)}
                      >
                        {member.role}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {member.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <UserPlus className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No team members yet</h3>
              <p className="mt-2 text-muted-foreground">
                Invite your first team member to start collaborating
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 