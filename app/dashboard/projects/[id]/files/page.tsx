import { ProjectFiles } from "@/components/projects/project-files"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProjectFilesPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/projects/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au projet
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fichiers du projet</h1>
          <p className="text-muted-foreground">Gérez tous les documents et assets</p>
        </div>
      </div>

      <ProjectFiles projectId={params.id} />
    </div>
  )
}
