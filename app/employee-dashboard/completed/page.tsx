"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Download, FileText, Search, Calendar, User, Star, Trophy, Clock } from "lucide-react"

const completedTasks = [
  {
    id: "TASK-002",
    title: "Database Schema Design",
    project: "E-commerce Platform Redesign",
    client: "TechCorp Inc.",
    description: "Design and implement the database schema for the e-commerce platform",
    completedDate: "2024-02-05",
    assignedBy: "Sarah Johnson",
    estimatedHours: 20,
    loggedHours: 18,
    deliverables: ["Database Schema", "Migration Scripts", "Documentation"],
    submittedFiles: [
      { name: "schema.sql", size: "156 KB", uploadDate: "2024-02-03" },
      { name: "migrations.sql", size: "89 KB", uploadDate: "2024-02-03" },
      { name: "db-docs.pdf", size: "2.1 MB", uploadDate: "2024-02-03" },
    ],
    aiReview: {
      status: "Approved",
      feedback: "Excellent database design. Schema is well-normalized and optimized for performance.",
      score: 95,
      reviewDate: "2024-02-04",
    },
    paymentStatus: "Released",
    paymentAmount: "$2,400",
  },
  {
    id: "TASK-006",
    title: "User Authentication System",
    project: "Mobile Banking App",
    client: "FinanceFirst",
    description: "Implement secure user authentication and authorization system",
    completedDate: "2024-01-28",
    assignedBy: "David Chen",
    estimatedHours: 28,
    loggedHours: 26,
    deliverables: ["Auth Module", "Security Tests", "Documentation"],
    submittedFiles: [
      { name: "auth-module.zip", size: "3.2 MB", uploadDate: "2024-01-26" },
      { name: "security-tests.js", size: "245 KB", uploadDate: "2024-01-27" },
      { name: "auth-docs.pdf", size: "1.8 MB", uploadDate: "2024-01-27" },
    ],
    aiReview: {
      status: "Approved",
      feedback: "Robust authentication system with excellent security practices implemented.",
      score: 92,
      reviewDate: "2024-01-28",
    },
    paymentStatus: "Released",
    paymentAmount: "$3,360",
  },
  {
    id: "TASK-007",
    title: "API Documentation",
    project: "Inventory Management System",
    client: "RetailMax",
    description: "Create comprehensive API documentation for the inventory system",
    completedDate: "2024-01-15",
    assignedBy: "Emma Wilson",
    estimatedHours: 12,
    loggedHours: 14,
    deliverables: ["API Docs", "Code Examples", "Postman Collection"],
    submittedFiles: [
      { name: "api-documentation.pdf", size: "4.1 MB", uploadDate: "2024-01-14" },
      { name: "code-examples.zip", size: "892 KB", uploadDate: "2024-01-14" },
      { name: "postman-collection.json", size: "156 KB", uploadDate: "2024-01-15" },
    ],
    aiReview: {
      status: "Approved",
      feedback: "Comprehensive and well-structured API documentation. Clear examples provided.",
      score: 88,
      reviewDate: "2024-01-15",
    },
    paymentStatus: "Released",
    paymentAmount: "$1,680",
  },
  {
    id: "TASK-008",
    title: "Performance Testing",
    project: "E-commerce Platform Redesign",
    client: "TechCorp Inc.",
    description: "Conduct comprehensive performance testing and optimization",
    completedDate: "2024-01-10",
    assignedBy: "Sarah Johnson",
    estimatedHours: 16,
    loggedHours: 18,
    deliverables: ["Performance Report", "Load Test Results", "Optimization Plan"],
    submittedFiles: [
      { name: "performance-report.pdf", size: "2.8 MB", uploadDate: "2024-01-09" },
      { name: "load-test-results.xlsx", size: "1.2 MB", uploadDate: "2024-01-09" },
      { name: "optimization-plan.docx", size: "456 KB", uploadDate: "2024-01-10" },
    ],
    aiReview: {
      status: "Approved",
      feedback: "Thorough performance analysis with actionable optimization recommendations.",
      score: 90,
      reviewDate: "2024-01-10",
    },
    paymentStatus: "Released",
    paymentAmount: "$2,160",
  },
]

export default function CompletedTasksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projectFilter, setProjectFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const filteredTasks = completedTasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.client.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesProject = projectFilter === "all" || task.project === projectFilter

      return matchesSearch && matchesProject
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime()
        case "score":
          return (b.aiReview.score || 0) - (a.aiReview.score || 0)
        case "payment":
          return (
            Number.parseFloat(b.paymentAmount.replace(/[$,]/g, "")) -
            Number.parseFloat(a.paymentAmount.replace(/[$,]/g, ""))
          )
        default:
          return 0
      }
    })

  const totalEarnings = completedTasks.reduce(
    (sum, task) => sum + Number.parseFloat(task.paymentAmount.replace(/[$,]/g, "")),
    0,
  )
  const averageScore = completedTasks.reduce((sum, task) => sum + (task.aiReview.score || 0), 0) / completedTasks.length
  const totalHours = completedTasks.reduce((sum, task) => sum + task.loggedHours, 0)

  const uniqueProjects = Array.from(new Set(completedTasks.map((task) => task.project)))

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Completed Tasks</h1>
              <p className="text-slate-600 mt-1">Review your completed work and achievements</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{completedTasks.length}</p>
                <p className="text-sm text-slate-600">Tasks Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Trophy className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{averageScore.toFixed(1)}</p>
                <p className="text-sm text-slate-600">Average Score</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalHours}h</p>
                <p className="text-sm text-slate-600">Total Hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">${totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Total Earnings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search completed tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {uniqueProjects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="score">Highest Score</SelectItem>
                  <SelectItem value="payment">Highest Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">
                          {task.project} • {task.client}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      <Badge className="bg-blue-100 text-blue-800">Score: {task.aiReview.score}/100</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* AI Review Feedback */}
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">AI Review Approved</span>
                      <Badge variant="outline">Score: {task.aiReview.score}/100</Badge>
                    </div>
                    <p className="text-sm text-green-800">{task.aiReview.feedback}</p>
                    <p className="text-xs text-green-700 mt-1">Reviewed on {task.aiReview.reviewDate}</p>
                  </div>

                  {/* Task Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-slate-600">Completed</p>
                        <p className="font-medium text-slate-900">{task.completedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-slate-600">Assigned By</p>
                        <p className="font-medium text-slate-900">{task.assignedBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-slate-600">Hours Logged</p>
                        <p className="font-medium text-slate-900">{task.loggedHours}h</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-slate-600">Payment</p>
                        <p className="font-medium text-green-600">{task.paymentAmount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Deliverables</p>
                    <div className="flex flex-wrap gap-2">
                      {task.deliverables.map((deliverable) => (
                        <Badge key={deliverable} variant="outline">
                          {deliverable}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Submitted Files */}
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Submitted Files</p>
                    <div className="space-y-2">
                      {task.submittedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-slate-500">({file.size})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{file.uploadDate}</span>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download All Files
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No completed tasks found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
