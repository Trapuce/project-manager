"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/ui/file-upload"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Upload, Search, MoreHorizontal, Download, Eye, Trash2, Share, Folder } from "lucide-react"

interface ProjectFilesProps {
  projectId: string
}

const files = [
  {
    id: 1,
    name: "Cahier des charges.pdf",
    type: "application/pdf",
    size: "3.2 MB",
    uploadedBy: "Alice Dupont",
    uploadedAt: "2023-12-10",
    category: "Documentation",
    url: "/uploads/cahier-charges.pdf",
  },
  {
    id: 2,
    name: "Maquettes-homepage.fig",
    type: "application/figma",
    size: "12.8 MB",
    uploadedBy: "Charlie Bernard",
    uploadedAt: "2023-12-12",
    category: "Design",
    url: "/uploads/maquettes.fig",
  },
  {
    id: 3,
    name: "API-endpoints.json",
    type: "application/json",
    size: "45 KB",
    uploadedBy: "Bob Martin",
    uploadedAt: "2023-12-14",
    category: "Développement",
    url: "/uploads/api-endpoints.json",
  },
  {
    id: 4,
    name: "Tests-utilisateurs.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: "2.1 MB",
    uploadedBy: "Grace Bernard",
    uploadedAt: "2023-12-15",
    category: "Tests",
    url: "/uploads/tests-utilisateurs.xlsx",
  },
  {
    id: 5,
    name: "Logo-variations.zip",
    type: "application/zip",
    size: "8.7 MB",
    uploadedBy: "Charlie Bernard",
    uploadedAt: "2023-12-16",
    category: "Assets",
    url: "/uploads/logo-variations.zip",
  },
]

const categories = ["Tous", "Documentation", "Design", "Développement", "Tests", "Assets"]

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return "🖼️"
  if (type.includes("pdf")) return "📄"
  if (type.includes("figma")) return "🎨"
  if (type.includes("json")) return "📋"
  if (type.includes("spreadsheet") || type.includes("excel")) return "📊"
  if (type.includes("zip") || type.includes("rar")) return "📦"
  return "📎"
}

export function ProjectFiles({ projectId }: ProjectFilesProps) {
  const [showUpload, setShowUpload] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [searchQuery, setSearchQuery] = useState("")

  const handleFileUpload = (uploadedFiles: File[]) => {
    console.log("Files uploaded to project:", uploadedFiles)
    setShowUpload(false)
  }

  const filteredFiles = files.filter((file) => {
    const matchesCategory = selectedCategory === "Tous" || file.category === selectedCategory
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fichiers du projet</CardTitle>
              <CardDescription>Gérez tous les documents et assets du projet</CardDescription>
            </div>
            <Button onClick={() => setShowUpload(!showUpload)}>
              <Upload className="mr-2 h-4 w-4" />
              {showUpload ? "Annuler" : "Uploader"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showUpload && (
            <FileUpload
              onUpload={handleFileUpload}
              maxFiles={10}
              maxSize={50}
              acceptedTypes={[
                "image/*",
                "application/pdf",
                ".doc",
                ".docx",
                ".txt",
                ".zip",
                ".rar",
                ".json",
                ".xlsx",
                ".xls",
                ".fig",
              ]}
            />
          )}

          {/* Filtres et recherche */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher un fichier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Liste des fichiers */}
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-lg">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">{file.name}</p>
                      <Badge variant="outline">{file.category}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>Par {file.uploadedBy}</span>
                      <span>•</span>
                      <span>{file.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Prévisualiser
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="mr-2 h-4 w-4" />
                      Partager
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-8">
              <Folder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun fichier trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
