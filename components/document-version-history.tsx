"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

type Version = {
  id: string
  createdAt: string
  createdBy: {
    id: string
    name: string
  }
}

export function DocumentVersionHistory({
  documentId,
  versions,
}: {
  documentId: string
  versions: Version[]
}) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const { toast } = useToast()

  const handleRestore = (versionId: string) => {
    // In a real app, you would restore the document to this version
    toast({
      title: "Version restored",
      description: "The document has been restored to the selected version"
    })
  }\

