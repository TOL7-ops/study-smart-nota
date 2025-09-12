import { useState, useCallback } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Upload as UploadIcon, 
  FileText, 
  Image, 
  File,
  X,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"

interface UploadedFile {
  id: string
  file: File
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  course?: string
}

export default function Upload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragActive, setIsDragActive] = useState(false)

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'uploading',
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach(uploadedFile => {
      simulateUpload(uploadedFile.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 20, 100)
          const newStatus = newProgress === 100 ? 'processing' : 'uploading'
          
          if (newProgress === 100) {
            setTimeout(() => {
              setFiles(prev => prev.map(f => 
                f.id === fileId ? { ...f, status: 'completed' } : f
              ))
            }, 2000)
          }
          
          return { ...file, progress: newProgress, status: newStatus }
        }
        return file
      }))
    }, 500)

    setTimeout(() => clearInterval(interval), 3000)
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const updateCourse = (fileId: string, course: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, course } : file
    ))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    if (['pdf'].includes(extension || '')) return FileText
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension || '')) return Image
    return File
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return Clock
      case 'completed':
        return CheckCircle
      case 'error':
        return AlertCircle
      default:
        return Clock
    }
  }

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return 'text-blue-500'
      case 'completed':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Upload Documents</h1>
          <p className="text-muted-foreground mt-1">Upload your study materials to get AI-powered summaries and flashcards</p>
        </div>

        {/* Upload Area */}
        <Card className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors">
          <CardContent className="p-8">
            <div
              className={`text-center ${isDragActive ? 'bg-primary/5 rounded-lg p-4' : ''}`}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <UploadIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {isDragActive ? 'Drop files here' : 'Upload your documents'}
              </h3>
              <p className="text-muted-foreground mb-6">
                Drag and drop files or click to browse. Supports PDF, DOCX, PPTX, TXT, and images.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.pptx,.txt,.png,.jpg,.jpeg,.gif,.webp"
                  onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload">
                  <Button asChild className="bg-primary hover:bg-primary-light cursor-pointer">
                    <span>Choose Files</span>
                  </Button>
                </Label>
                <Button variant="outline">
                  Take Photo
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Maximum file size: 50MB per file
              </p>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Files</CardTitle>
              <CardDescription>
                Track the progress of your document uploads and processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((uploadedFile) => {
                  const FileIcon = getFileIcon(uploadedFile.file.name)
                  const StatusIcon = getStatusIcon(uploadedFile.status)
                  
                  return (
                    <div key={uploadedFile.id} className="flex items-center space-x-4 p-4 rounded-lg border bg-gradient-card">
                      <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <FileIcon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium truncate">{uploadedFile.file.name}</p>
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={`h-4 w-4 ${getStatusColor(uploadedFile.status)}`} />
                            <Badge variant={uploadedFile.status === 'completed' ? 'default' : 'secondary'}>
                              {uploadedFile.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeFile(uploadedFile.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {uploadedFile.status !== 'completed' && (
                          <Progress value={uploadedFile.progress} className="mb-2" />
                        )}
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            {(uploadedFile.file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          
                          {uploadedFile.status === 'completed' && (
                            <Select
                              value={uploadedFile.course}
                              onValueChange={(value) => updateCourse(uploadedFile.id, value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select course" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cs229">CS 229 - Machine Learning</SelectItem>
                                <SelectItem value="chem101">CHEM 101 - General Chemistry</SelectItem>
                                <SelectItem value="hist200">HIST 200 - World History</SelectItem>
                                <SelectItem value="math201">MATH 201 - Calculus II</SelectItem>
                                <SelectItem value="phys101">PHYS 101 - Physics I</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {files.some(f => f.status === 'completed') && (
                <div className="mt-6 pt-4 border-t">
                  <Button className="w-full bg-primary hover:bg-primary-light">
                    Process Documents
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tips Card */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Tips for Better Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Upload clear, high-quality documents for better AI processing
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Tag your documents with course names to organize your study materials
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Break down large documents into chapters for more focused summaries
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Supported formats: PDF, DOCX, PPTX, TXT, PNG, JPG, JPEG, GIF, WEBP
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}