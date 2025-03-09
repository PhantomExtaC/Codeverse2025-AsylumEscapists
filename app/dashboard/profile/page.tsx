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
import { ArrowLeft, User, Mail, Save } from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
  name: string
  email: string
  avatar?: string
  role: "admin" | "user"
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>(() => {
    // Load profile from localStorage or set defaults
    const saved = localStorage.getItem("userProfile")
    return saved ? JSON.parse(saved) : {
      name: "",
      email: "",
      role: "user",
      createdAt: new Date().toISOString()
    }
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!profile.email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSaving(true)
    localStorage.setItem("userProfile", JSON.stringify({
      ...profile,
      updatedAt: new Date().toISOString()
    }))

    setTimeout(() => {
      setIsSaving(false)
      toast.success("Profile updated successfully")
    }, 500)
  }

  return (
    <div className="container py-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </label>
              <Input
                placeholder="John Doe"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              View your account details and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Account Type</p>
              <p className="text-sm text-muted-foreground capitalize">{profile.role}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-sm text-muted-foreground">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 