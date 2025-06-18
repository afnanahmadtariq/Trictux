"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Upload,
  MessageSquare,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Target,
  Send,
  FileText,
  Download,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock project data
const projectData = {
  "PRJ-001": {
    id: "PRJ-001",
    name: "E-commerce Platform Redesign",
    client: "TechCorp Inc.",
    clientContact: "john.smith@techcorp.com",
    status: "In Progress",
    priority: "High",
    progress: 65,
    budget: 85000,
    spent: 55250,
    deadline: "2024-03-15",
    startDate: "2024-01-10",
    description: "Complete redesign of the e-commerce platform with modern UI/UX and improved performance",
    milestones: [
      {
        id: "MS-001",
        title: "Project Planning & Requirements",
        status: "Completed",
        dueDate: "2024-01-20",
        completedDate: "2024-01-18",
        budget: 15000,
        assignedTo: ["Sarah Johnson", "Mike Davis"],
        deliverables: ["Requirements Document", "Technical Specifications", "Project Timeline"],
      },
      {
        id: "MS-002",
        title: "Database Design & Backend Setup",
        status: "Completed",
        dueDate: "2024-02-05",
        completedDate: "2024-02-03",
        budget: 20000,
        assignedTo: ["Lisa Chen"],
        deliverables: ["Database Schema", "API Documentation", "Backend Infrastructure"],
      },
      {
        id: "MS-003",
        title: "Frontend Components Development",
        status: "In Progress",
        dueDate: "2024-02-25",
        budget: 25000,
        assignedTo: ["Mike Davis", "Tom Wilson"],
        deliverables: ["Component Library", "Core UI Implementation", "Responsive Design"],
      },
      {
        id: "MS-004",
        title: "Integration & Testing",
        status: "Pending",
        dueDate: "2024-03-10",
        budget: 25000,
        assignedTo: ["Anna Rodriguez", "Emma Wilson"],
        deliverables: ["Integrated Application", "Test Reports", "Performance Metrics"],
      },
    ],
    team: [
      { name: "Sarah Johnson", role: "Project Lead", email: "sarah@companyb.com", avatar: "SJ" },
      { name: "Mike Davis", role: "Frontend Developer", email: "mike@companyb.com", avatar: "MD" },
      { name: "Lisa Chen", role: "Backend Developer", email: "lisa@companyb.com", avatar: "LC" },
      { name: "Tom Wilson", role: "UI/UX Designer", email: "tom@companyb.com", avatar: "TW" },
      { name: "Anna Rodriguez", role: "QA Engineer", email: "anna@companyb.com", avatar: "AR" },
    ],
  },
}

export default function CompanyProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const project = projectData[projectId as keyof typeof projectData]
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [message, setMessage] = useState("")

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h1>
          <Link href="/company-dashboard/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  const completedMilestones = project.milestones.filter((m) => m.status === "Completed").length
  const activeMilestone = project.milestones.find((m) => m.status === "In Progress")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files))
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/company-dashboard/projects">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
                <Badge variant={project.priority === "High" ? "destructive" : "default"}>{project.priority}</Badge>
                <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>{project.status}</Badge>
              </div>
              <p className="text-slate-600 mb-3">{project.description}</p>
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <span>
                  <strong>Client:</strong> {project.client}
                </span>
                <span>
                  <strong>Deadline:</strong> {project.deadline}
                </span>
                <span>
                  <strong>Budget:</strong> ${(project.budget / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message Client
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Message to {project.client}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows={4}
                      />
                    </div>
                    <Button className="w-full gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Deliverable
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Project Deliverable</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="files">Select Files</Label>
                      <Input id="files" type="file" multiple onChange={handleFileUpload} />
                    </div>
                    {selectedFiles.length > 0 && (
                      <div>
                        <p className="text-sm text-slate-600 mb-2">Selected Files:</p>
                        <div className="space-y-1">
                          {selectedFiles.map((file, index) => (
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
                    <p className="text-2xl font-bold text-slate-900">{project.progress}%</p>
                    <p className="text-sm text-slate-600">Progress</p>
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
                    <p className="text-2xl font-bold text-slate-900">
                      {completedMilestones}/{project.milestones.length}
                    </p>
                    <p className="text-sm text-slate-600">Milestones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-50">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">${(project.spent / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-slate-600">Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-yellow-50">
                    <Users className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{project.team.length}</p>
                    <p className="text-sm text-slate-600">Team Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Details */}
          <Tabs defaultValue="milestones" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>

            <TabsContent value="milestones" className="space-y-4">
              {project.milestones.map((milestone, index) => (
                <Card key={milestone.id} className="border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {milestone.status === "Completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        ) : milestone.status === "In Progress" ? (
                          <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                        ) : (
                          <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
                        )}
                        <div>
                          <CardTitle className="text-lg">{milestone.title}</CardTitle>
                          <p className="text-sm text-slate-600 mt-1">Due: {milestone.dueDate}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={milestone.status === "Completed" ? "default" : "secondary"}>
                          {milestone.status}
                        </Badge>
                        <span className="text-sm font-medium text-slate-900">
                          ${(milestone.budget / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Assigned To:</p>
                      <div className="flex flex-wrap gap-2">
                        {milestone.assignedTo.map((person) => (
                          <Badge key={person} variant="outline">
                            {person}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Deliverables:</p>
                      <div className="flex flex-wrap gap-2">
                        {milestone.deliverables.map((deliverable) => (
                          <Badge key={deliverable} variant="outline">
                            {deliverable}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* File Upload Section for Completed Milestones */}
                    {milestone.status === "Completed" && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">Milestone Completed</span>
                        </div>

                        {/* Mock uploaded files */}
                        <div className="space-y-2 mb-3">
                          <p className="text-sm text-green-800 mb-2">Submitted Files:</p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between p-2 bg-white border border-green-200 rounded text-sm">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-green-600" />
                                <span>{milestone.deliverables[0]?.toLowerCase().replace(/\s+/g, "-")}.zip</span>
                                <span className="text-xs text-slate-500">(2.4 MB)</span>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="gap-2">
                                <Upload className="h-4 w-4" />
                                Upload Additional Files
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Upload Files for {milestone.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="milestone-files">Select Files</Label>
                                  <Input id="milestone-files" type="file" multiple />
                                </div>
                                <div>
                                  <Label htmlFor="upload-notes">Notes (Optional)</Label>
                                  <Textarea
                                    id="upload-notes"
                                    placeholder="Add any notes about the uploaded files..."
                                    rows={3}
                                  />
                                </div>
                                <Button className="w-full">Upload Files</Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" className="gap-2">
                                <Send className="h-4 w-4" />
                                Send for Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Submit Milestone for Client Review</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                  <h4 className="font-medium text-blue-900 mb-2">Milestone: {milestone.title}</h4>
                                  <p className="text-sm text-blue-800">
                                    This will send the completed milestone and all uploaded files to the client for
                                    review and approval.
                                  </p>
                                </div>

                                <div>
                                  <Label htmlFor="review-message">Message to Client</Label>
                                  <Textarea
                                    id="review-message"
                                    placeholder="Add a message for the client about this milestone completion..."
                                    rows={4}
                                    defaultValue={`Hi ${project.client},

We've completed the "${milestone.title}" milestone for the ${project.name} project. Please review the submitted deliverables and let us know if you have any feedback.

All deliverables have been uploaded and are ready for your review.

Best regards,
${project.team[0]?.name || "Project Team"}`}
                                  />
                                </div>

                                <div className="p-3 bg-yellow-50 rounded-lg">
                                  <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> Once submitted for review, the client will be notified and
                                    can approve or request changes to this milestone.
                                  </p>
                                </div>

                                <Button className="w-full gap-2">
                                  <Send className="h-4 w-4" />
                                  Submit for Client Review
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    )}

                    {milestone.status === "In Progress" && (
                      <div className="flex gap-2 pt-3 border-t border-slate-200">
                        <Button size="sm" className="gap-2">
                          <Upload className="h-4 w-4" />
                          Upload Work
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Update Status
                        </Button>
                      </div>
                    )}
                    {milestone.status === "Completed" && milestone.completedDate && (
                      <div className="text-sm text-green-600 pt-3 border-t border-slate-200">
                        ✓ Completed on {milestone.completedDate}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.team.map((member) => (
                  <Card key={member.email} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900">{member.name}</h3>
                          <p className="text-sm text-slate-600">{member.role}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="communication" className="space-y-4">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Client Communication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">Contact: {project.clientContact}</span>
                      <span className="text-sm text-slate-600">Last contact: 2 days ago</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Regular project updates and milestone reviews scheduled weekly.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Send Update
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule Meeting
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
