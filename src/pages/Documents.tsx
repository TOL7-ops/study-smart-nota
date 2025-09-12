import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, 
  Search,
  Filter,
  Download,
  Share,
  MoreHorizontal,
  Plus,
  Calendar,
  BookOpen,
  Eye,
  Trash2
} from "lucide-react"
import { Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Document {
  id: string
  title: string
  type: string
  course: string
  uploadDate: string
  status: 'processed' | 'processing' | 'error'
  pages: number
  size: string
  summary?: string
  flashcards?: number
}

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const documents: Document[] = [
    {
      id: "1",
      title: "Introduction to Machine Learning - Chapter 3",
      type: "PDF",
      course: "CS 229",
      uploadDate: "2024-01-15",
      status: "processed",
      pages: 24,
      size: "2.3 MB",
      summary: "Covers supervised learning algorithms including linear regression, logistic regression, and neural networks.",
      flashcards: 15
    },
    {
      id: "2",
      title: "Organic Chemistry Lecture Notes",
      type: "DOCX",
      course: "CHEM 101",
      uploadDate: "2024-01-14",
      status: "processing",
      pages: 18,
      size: "1.8 MB"
    },
    {
      id: "3",
      title: "World History - Industrial Revolution",
      type: "PDF",
      course: "HIST 200",
      uploadDate: "2024-01-13",
      status: "processed",
      pages: 32,
      size: "4.1 MB",
      summary: "Comprehensive overview of the Industrial Revolution from 1760-1840, covering technological advances and social changes.",
      flashcards: 22
    },
    {
      id: "4",
      title: "Calculus II - Integration Techniques",
      type: "PDF",
      course: "MATH 201",
      uploadDate: "2024-01-12",
      status: "processed",
      pages: 15,
      size: "1.2 MB",
      summary: "Detailed explanations of integration by parts, partial fractions, and trigonometric substitution.",
      flashcards: 18
    },
    {
      id: "5",
      title: "Physics Lab Report Template",
      type: "DOCX",
      course: "PHYS 101",
      uploadDate: "2024-01-11",
      status: "error",
      pages: 5,
      size: "0.8 MB"
    }
  ]

  const courses = ["all", "CS 229", "CHEM 101", "HIST 200", "MATH 201", "PHYS 101"]
  const statuses = ["all", "processed", "processing", "error"]

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCourse = selectedCourse === "all" || doc.course === selectedCourse
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus
    
    return matchesSearch && matchesCourse && matchesStatus
  })

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'processed':
        return <Badge className="bg-success text-success-foreground">Processed</Badge>
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground mt-1">Manage your uploaded study materials and AI-generated content</p>
          </div>
          <Link to="/upload">
            <Button className="bg-primary hover:bg-primary-light">
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search documents, courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course} value={course}>
                      {course === "all" ? "All Courses" : course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Document List */}
        <div className="grid gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground truncate">{doc.title}</h3>
                        {getStatusBadge(doc.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {doc.course}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </span>
                        <span>{doc.pages} pages</span>
                        <span>{doc.size}</span>
                      </div>
                      
                      {doc.summary && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {doc.summary}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4">
                        {doc.status === 'processed' && (
                          <>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Summary
                            </Button>
                            {doc.flashcards && (
                              <Button variant="outline" size="sm">
                                <BookOpen className="h-4 w-4 mr-2" />
                                {doc.flashcards} Flashcards
                              </Button>
                            )}
                          </>
                        )}
                        {doc.status === 'processing' && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin mr-2" />
                            Processing document...
                          </div>
                        )}
                        {doc.status === 'error' && (
                          <Button variant="outline" size="sm" className="text-destructive border-destructive">
                            Retry Processing
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCourse !== "all" || selectedStatus !== "all" 
                  ? "Try adjusting your filters or search terms"
                  : "Upload your first document to get started with AI-powered studying"
                }
              </p>
              {!searchQuery && selectedCourse === "all" && selectedStatus === "all" && (
                <Link to="/upload">
                  <Button className="bg-primary hover:bg-primary-light">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Card */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Document Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{documents.length}</div>
                <div className="text-sm text-muted-foreground">Total Documents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {documents.filter(d => d.status === 'processed').length}
                </div>
                <div className="text-sm text-muted-foreground">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {documents.reduce((sum, doc) => sum + (doc.flashcards || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Flashcards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {documents.reduce((sum, doc) => sum + doc.pages, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Pages</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}