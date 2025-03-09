"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, Star, Share2, Clock, Trash, Settings, Users, FolderOpen, Plus } from "lucide-react"

const navItems = [
  {
    title: "All Documents",
    href: "/dashboard",
    icon: FileText,
  },
  {
    title: "Shared with me",
    href: "/dashboard/shared",
    icon: Share2,
  },
  {
    title: "Starred",
    href: "/dashboard/starred",
    icon: Star,
  },
  {
    title: "Recent",
    href: "/dashboard/recent",
    icon: Clock,
  },
  {
    title: "Trash",
    href: "/dashboard/trash",
    icon: Trash,
  },
]

const folderItems = [
  {
    title: "Work",
    href: "/dashboard/folders/work",
    icon: FolderOpen,
  },
  {
    title: "Personal",
    href: "/dashboard/folders/personal",
    icon: FolderOpen,
  },
  {
    title: "Finance",
    href: "/dashboard/folders/finance",
    icon: FolderOpen,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex flex-col gap-1">
        <Link href="/document/new">
          <Button className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        </Link>
      </div>
      <div className="py-2">
        <nav className="grid gap-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="py-2">
        <h3 className="mb-2 px-3 text-sm font-semibold">Folders</h3>
        <nav className="grid gap-1">
          {folderItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
          <Button variant="ghost" className="flex items-center gap-3 justify-start px-3 py-2 text-sm font-medium">
            <Plus className="h-4 w-4" />
            Add Folder
          </Button>
        </nav>
      </div>
      <div className="mt-auto">
        <nav className="grid gap-1">
          <Link
            href="/dashboard/team"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/dashboard/team" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Users className="h-4 w-4" />
            Team
          </Link>
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === "/dashboard/settings" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>
    </div>
  )
}

