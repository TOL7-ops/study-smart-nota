import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Upload,
  Calendar,
  Clock,
  Star,
  Plus
} from "lucide-react"
import { Link } from "react-router-dom"

export default function Dashboard() {
  const recentDocuments = [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      type: "PDF",
      uploadDate: "2024-01-15",
      status: "processed",
      course: "CS 229"
    },
    {
      id: 2,
      title: "Organic Chemistry Notes",
      type: "DOCX",
      uploadDate: "2024-01-14",
      status: "processing",
      course: "CHEM 101"
    },
    {
      id: 3,
      title: "World History Chapter 12",
      type: "PDF",
      uploadDate: "2024-01-13",
      status: "processed",
      course: "HIST 200"
    }
  ]

  const stats = [
    {
      title: "Documents",
      value: "24",
      change: "+3 this week",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Flashcards",
      value: "186",
      change: "+12 this week",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Study Hours",
      value: "32h",
      change: "+5h this week",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Average Score",
      value: "87%",
      change: "+4% this month",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
            <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
          </div>
          <Link to="/upload">
            <Button className="bg-primary hover:bg-primary-light">
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-success">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Documents */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Documents</CardTitle>
                  <CardDescription>Your latest uploads and study materials</CardDescription>
                </div>
                <Link to="/documents">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-card hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{doc.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary">{doc.course}</Badge>
                          <Badge variant={doc.status === 'processed' ? 'default' : 'secondary'}>
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Study Session */}
            <Card className="bg-gradient-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <BookOpen className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">Quick Study</h3>
                </div>
                <p className="text-primary-foreground/90 mb-4">
                  Review your flashcards or start a new study session
                </p>
                <Link to="/flashcards">
                  <Button variant="secondary" className="w-full">
                    Start Studying
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <Card className="border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Upload New Document</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop or click to upload
                </p>
                <Link to="/upload">
                  <Button variant="outline" className="w-full">
                    Choose File
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Study Streak */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-lg font-semibold">Study Streak</h3>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">7</div>
                  <p className="text-sm text-muted-foreground">days in a row</p>
                  <p className="text-xs text-success mt-2">Keep it up! 🔥</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}