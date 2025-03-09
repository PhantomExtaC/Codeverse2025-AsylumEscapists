import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { FileText, Users, History, Download, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">nosaic</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Collaborate on Documents in Real-Time
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Create, edit, and share documents with your team. Work together in real-time and stay organized.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Powerful Features for Seamless Collaboration
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Everything you need to create, manage, and collaborate on documents with your team.
                  </p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 text-center">
                  <Users className="h-10 w-10 text-primary" />
                  <h3 className="text-xl font-bold">Real-Time Collaboration</h3>
                  <p className="text-sm text-muted-foreground">
                    Work together with your team in real-time with live cursors and presence.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 text-center">
                  <History className="h-10 w-10 text-primary" />
                  <h3 className="text-xl font-bold">Version History</h3>
                  <p className="text-sm text-muted-foreground">
                    Track changes and revert to previous versions of your documents.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 text-center">
                  <Shield className="h-10 w-10 text-primary" />
                  <h3 className="text-xl font-bold">Access Control</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage permissions for viewing and editing your documents.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 text-center">
                  <Download className="h-10 w-10 text-primary" />
                  <h3 className="text-xl font-bold">Export Options</h3>
                  <p className="text-sm text-muted-foreground">
                    Export your documents in PDF, DOCX, and other formats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 nosaic. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline underline-offset-4">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

