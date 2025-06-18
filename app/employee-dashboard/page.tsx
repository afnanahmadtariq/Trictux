"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle, Clock, Upload, FileText, Target, MessageSquare, Download, Send, Brain } from "lucide-react"

const employeeTasks = [
  {
    id: "TASK-001",
    title: "Frontend Components Development",
    project: "E-commerce Platform Redesign",
    client: "TechCorp Inc.",
    description: "Develop reusable frontend components and implement core UI",
    status: "In Progress",
    priority: "High",
    dueDate: "2024-02-25",
    progress: 75,
    assignedBy: "Sarah Johnson",
    estimatedHours: 40,
    loggedHours: 30,
    deliverables: ["Component Library", "Core UI Implementation", "Responsive Design"],
    submittedFiles: [
      { name: "component-library.zip", size: "12.4 MB", uploadDate: "2024-02-20" },
      { name: "ui-demo.mp4", size: "8.7 MB", uploadDate: "2024-02-22" },
    ],
    aiReview: {
      status: "Pending",
      feedback: null,
    },
  },
  {
    id: "TASK-002",
    title: "Database Schema Design",
    project: "E-commerce Platform Redesign",
    client: "TechCorp Inc.",
    description: "Design and implement the database schema for the e-commerce platform",
    status: "Completed",
    priority: "High",
    dueDate: "2024-02-05",
    progress: 100,
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
  },
  {
    id: "TASK-003",
    title: "API Integration Testing",
    project: "Inventory Management System",
    client: "RetailMax",
    description: "Test and validate API integrations for the inventory system",
    status: "Pending",
    priority: "Medium",
    dueDate: "2024-03-01",
    progress: 0,
    assignedBy: "Emma Wilson",
    estimatedHours: 16,
    loggedHours: 0,
    deliverables: ["Test Reports", "API Documentation", "Integration Guide"],
    submittedFiles: [],
    aiReview: {
      status: "Not Started",
      feedback: null,
    },
  },
]

export default function EmployeeDashboard() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [submissionNotes, setSubmissionNotes] = useState("")

  const completedTasks = employeeTasks.filter((task) => task.status === "Completed").length
  const inProgressTasks = employeeTasks.filter((task) => task.status === "In Progress").length
  const totalHours = employeeTasks.reduce((sum, task) => sum + task.loggedHours, 0)
  const pendingReviews = employeeTasks.filter((task) => task.aiReview.status === "Pending").length

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewFiles(Array.from(event.target.files))
    }
  }

  const handleSubmitMilestone = (taskId: string) => {
    // Simulate instant AI review
    const task = employeeTasks.find((t) => t.id === taskId)
    if (task) {
      task.aiReview.status = "Under AI Review"
      task.status = "Under Review"

      // Simulate AI processing
      setTimeout(() => {
        task.aiReview.status = "Approved"
        task.aiReview.feedback = "AI analysis complete. All deliverables meet requirements."
        task.aiReview.score = Math.floor(Math.random() * 20) + 80 // 80-100 score
        task.aiReview.reviewDate = new Date().toISOString().split("T")[0]
        task.status = "Completed"
        alert("AI review completed! Milestone approved and payment released.")
      }, 3000) // 3 second AI review simulation
    }
    setSubmitDialogOpen(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "In Progress":
        return <Target className="h-4 w-4 text-blue-600" />
      case "Under Review":
        return <Brain className="h-4 w-4 text-purple-600 animate-pulse" />
      case "Pending":
        return <Clock className="h-4 w-4 text-slate-600" />
      default:
        return <Clock className="h-4 w-4 text-slate-600" />
    }
  }

  const getAIReviewStatus = (review: any) => {
    switch (review.status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800">AI Approved</Badge>
      case "Under AI Review":
        return <Badge className="bg-purple-100 text-purple-800">AI Reviewing...</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
      default:
        return <Badge variant="outline">Not Started</Badge>
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
              <p className="text-slate-600 mt-1">Track your tasks and submit milestone deliverables</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Team Chat
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600">
                <Upload className="h-4 w-4" />
                Submit Work
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-50">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{inProgressTasks}</p>
                    <p className="text-sm text-slate-600">Active Tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-50">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{completedTasks}</p>
                    <p className="text-sm text-slate-600">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-50">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{totalHours}</p>
                    <p className="text-sm text-slate-600">Hours Logged</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-yellow-50">
                    <Brain className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{pendingReviews}</p>
                    <p className="text-sm text-slate-600">Pending AI Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks */}
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Tasks</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              <div className="space-y-4">
                {employeeTasks
                  .filter((task) => task.status === "In Progress")
                  .map((task) => (
                    <Card key={task.id} className="border-slate-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(task.status)}
                            <div>
                              <CardTitle className="text-lg">{task.title}</CardTitle>
                              <p className="text-sm text-slate-600 mt-1">
                                {task.project} • {task.client}
                              </p>
                              <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={task.priority === "High" ? "destructive" : "default"}>
                              {task.priority}
                            </Badge>
                            {getAIReviewStatus(task.aiReview)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600">Progress</span>
                            <span className="font-medium text-slate-900">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Due Date</p>
                            <p className="font-medium text-slate-900">{task.dueDate}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Assigned By</p>
                            <p className="font-medium text-slate-900">{task.assignedBy}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Estimated Hours</p>
                            <p className="font-medium text-slate-900">{task.estimatedHours}h</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Logged Hours</p>
                            <p className="font-medium text-slate-900">{task.loggedHours}h</p>
                          </div>
                        </div>

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

                        {task.submittedFiles.length > 0 && (
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
                                  <span className="text-xs text-slate-500">{file.uploadDate}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-3 border-t border-slate-200">
                          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2">
                                <Upload className="h-4 w-4" />
                                Upload Files
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Upload Files</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="files">Select Files</Label>
                                  <Input id="files" type="file" multiple onChange={handleFileUpload} className="mt-1" />
                                </div>
                                {newFiles.length > 0 && (
                                  <div>
                                    <p className="text-sm text-slate-600 mb-2">Selected Files:</p>
                                    <div className="space-y-1">
                                      {newFiles.map((file, index) => (
                                        <p key={index} className="text-sm text-slate-900">
                                          {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <Button className="w-full">Upload Files</Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" className="gap-2">
                                <Send className="h-4 w-4" />
                                Submit for Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Submit Milestone for AI Review</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="notes">Submission Notes</Label>
                                  <Textarea
                                    id="notes"
                                    value={submissionNotes}
                                    onChange={(e) => setSubmissionNotes(e.target.value)}
                                    placeholder="Add any notes about your submission..."
                                    rows={3}
                                  />
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Brain className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-900">AI Review Process</span>
                                  </div>
                                  <p className="text-xs text-blue-800">
                                    Your submission will be instantly reviewed by our AI system. The review typically
                                    takes 2-3 seconds and will analyze your deliverables against project requirements.
                                  </p>
                                </div>
                                <Button
                                  className="w-full"
                                  onClick={() => handleSubmitMilestone(task.id)}
                                  disabled={task.submittedFiles.length === 0}
                                >
                                  Submit for AI Review
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm" className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Ask Question
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="space-y-4">
                {employeeTasks
                  .filter((task) => task.status === "Completed")
                  .map((task) => (
                    <Card key={task.id} className="border-slate-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(task.status)}
                            <div>
                              <CardTitle className="text-lg">{task.title}</CardTitle>
                              <p className="text-sm text-slate-600 mt-1">
                                {task.project} • {task.client}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            {getAIReviewStatus(task.aiReview)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {task.aiReview.status === "Approved" && (
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-900">AI Review Approved</span>
                              {task.aiReview.score && <Badge variant="outline">Score: {task.aiReview.score}/100</Badge>}
                            </div>
                            <p className="text-sm text-green-800">{task.aiReview.feedback}</p>
                            <p className="text-xs text-green-700 mt-1">Reviewed on {task.aiReview.reviewDate}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Completed Date</p>
                            <p className="font-medium text-slate-900">{task.dueDate}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Total Hours</p>
                            <p className="font-medium text-slate-900">{task.loggedHours}h</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download Files
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
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              <div className="space-y-4">
                {employeeTasks
                  .filter((task) => task.aiReview.status === "Pending" || task.aiReview.status === "Under AI Review")
                  .map((task) => (
                    <Card key={task.id} className="border-slate-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Brain className="h-4 w-4 text-purple-600 animate-pulse" />
                            <div>
                              <CardTitle className="text-lg">{task.title}</CardTitle>
                              <p className="text-sm text-slate-600 mt-1">
                                {task.project} • {task.client}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800">AI Reviewing...</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-purple-600 animate-pulse" />
                            <span className="text-sm font-medium text-purple-900">AI Analysis in Progress</span>
                          </div>
                          <p className="text-sm text-purple-800">
                            Your submission is being analyzed by our AI system. This usually takes 2-3 seconds.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
