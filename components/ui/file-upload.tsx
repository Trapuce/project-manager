"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, File, ImageIcon, FileText, Archive } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUpload?: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

interface UploadedFile {
  file: File
  id: string
  progress: number
  status: "uploading" | "completed" | "error"
  url?: string
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return ImageIcon
  if (type.includes("pdf") || type.includes("document")) return FileText
  if (type.includes("zip") || type.includes("rar")) return Archive
  return File
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function FileUpload({
  onUpload,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ["image/*", "application/pdf", ".doc", ".docx", ".txt"],
  className,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const { toast } = useToast()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: "uploading" as const,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // Simulate upload process
      newFiles.forEach((uploadFile) => {
        simulateUpload(uploadFile.id)
      })

      onUpload?.(acceptedFiles)
    },
    [onUpload],
  )

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.progress + Math.random() * 30, 100)
            if (newProgress >= 100) {
              clearInterval(interval)
              return {
                ...file,
                progress: 100,
                status: "completed",
                url: `/uploads/${file.file.name}`,
              }
            }
            return { ...file, progress: newProgress }
          }
          return file
        }),
      )
    }, 200)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize: maxSize * 1024 * 1024,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach((rejection) => {
        const errors = rejection.errors.map((error) => error.message).join(", ")
        toast({
          title: "Fichier rejeté",
          description: `${rejection.file.name}: ${errors}`,
          variant: "destructive",
        })
      })
    },
  })

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-primary">Déposez les fichiers ici...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">Glissez-déposez vos fichiers ici</p>
            <p className="text-xs text-muted-foreground">
              ou <span className="text-primary">cliquez pour parcourir</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Max {maxFiles} fichiers, {maxSize}MB chacun
            </p>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Fichiers uploadés</h4>
          {uploadedFiles.map((uploadFile) => {
            const FileIcon = getFileIcon(uploadFile.file.type)
            return (
              <div key={uploadFile.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <FileIcon className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(uploadFile.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatFileSize(uploadFile.file.size)}</p>
                  {uploadFile.status === "uploading" && (
                    <div className="space-y-1">
                      <Progress value={uploadFile.progress} className="h-1" />
                      <p className="text-xs text-muted-foreground">{Math.round(uploadFile.progress)}%</p>
                    </div>
                  )}
                  {uploadFile.status === "completed" && <p className="text-xs text-green-600">Upload terminé</p>}
                  {uploadFile.status === "error" && <p className="text-xs text-red-600">Erreur d'upload</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
