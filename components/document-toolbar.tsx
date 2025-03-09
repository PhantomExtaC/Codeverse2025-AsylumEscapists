"use client"

import { Button } from "@/components/ui/button"
import { Share, Download, History, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function DocumentToolbar({
  onShare,
  onExport,
  onViewHistory,
}: {
  onShare: () => void
  onExport: () => void
  onViewHistory: () => void
}) {
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Document saved",
      description: "Your document has been saved successfully.",
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleSave}>
        <Save className="mr-2 h-4 w-4" />
        Save
      </Button>
      <Button variant="outline" size="sm" onClick={onShare}>
        <Share className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button variant="outline" size="sm" onClick={onViewHistory}>
        <History className="mr-2 h-4 w-4" />
        History
      </Button>
    </div>
  )
}

