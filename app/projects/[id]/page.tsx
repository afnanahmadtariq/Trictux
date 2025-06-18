"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Upload,
  MessageSquare,
  Edit,
  Play,
  Target,
  Brain,
  AlertTriangle,
  Zap,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock data - in real app, this would come from API
const projectsData = {
  "PRJ-001": {
    id: "PRJ-001",
    name: "E-commerce Platform Redesign",
    description: "Complete redesign of the e-commerce platform with modern UI/UX and improved performance",
    client: {
      id: "CLI-001",
      name: "TechCorp Inc.",
      contact: "john.smith@techcorp.com",
    },
    company: {
      id: "COMP-B",
      name: "Company B",
      contact: "sarah.johnson@companyb.com",
    },
    status: "In Progress",
    priority: "High",
    phase: "Development",
    progress: 65,
    budget: 85000,
    spent: 55250,
    startDate: "2024-01-10",
    endDate: "2024-03-15",
    teamLead: "Sarah Johnson",
    teamSize: 5,
    risk: "Low",
    tags: ["React", "Node.js", "E-commerce", "UI/UX"],
    milestones: [
      {
        id: "MS-001",
        title: "Project Planning & Requirements",
        description: "Complete project planning, requirements gathering, and technical specifications",
        status: "Completed",
        dueDate: "2024-01-20",
        completedDate: "2024-01-18",
        budget: 15000,
        payment: {
          amount: 15000,
          status: "Paid",
          paidDate: "2024-01-20",
          method: "Bank Transfer",
          aiVerification: {
            status: "Verified",
            score: 95,
            verifiedDate: "2024-01-19",
            analysis: "All deliverables meet requirements. Documentation is comprehensive and well-structured.",
          },
        },
        deliverables: ["Project Requirements Document", "Technical Specifications", "UI/UX Wireframes"],
        submittedFiles: [
          { name: "requirements.pdf", size: "2.4 MB", uploadDate: "2024-01-18" },
          { name: "technical-specs.pdf", size: "1.8 MB", uploadDate: "2024-01-18" },
          { name: "wireframes.fig", size: "5.2 MB", uploadDate: "2024-01-18" },
        ],
      },
      {
        id: "MS-002",
        title: "Database Design & Backend Setup",
        description: "Design database schema and set up backend infrastructure",
        status: "Completed",
        dueDate: "2024-02-05",
        completedDate: "2024-02-03",
        budget: 20000,
        payment: {
          amount: 20000,
          status: "Paid",
          paidDate: "2024-02-05",
          method: "Bank Transfer",
          aiVerification: {
            status: "Verified",
            score: 92,
            verifiedDate: "2024-02-04",
            analysis:
              "Database schema is well-designed. API documentation is complete. Minor optimization suggestions provided.",
          },
        },
        deliverables: ["Database Schema", "API Documentation", "Backend Infrastructure"],
        submittedFiles: [
          { name: "database-schema.sql", size: "156 KB", uploadDate: "2024-02-03" },
          { name: "api-docs.pdf", size: "3.1 MB", uploadDate: "2024-02-03" },
          { name: "infrastructure-setup.md", size: "45 KB", uploadDate: "2024-02-03" },
        ],
      },
      {
        id: "MS-003",
        title: "Frontend Components Development",
        description: "Develop reusable frontend components and implement core UI",
        status: "Under Review",
        dueDate: "2024-02-25",
        completedDate: "2024-02-24",
        budget: 25000,
        payment: {
          amount: 25000,
          status: "Under AI Review",
          paidDate: null,
          method: "Bank Transfer",
          aiVerification: {
            status: "In Progress",
            score: null,
            verifiedDate: null,
            analysis: "AI analysis in progress. Reviewing component architecture and code quality...",
          },
        },
        deliverables: ["Component Library", "Core UI Implementation", "Responsive Design"],
        submittedFiles: [
          { name: "component-library.zip", size: "12.4 MB", uploadDate: "2024-02-24" },
          { name: "ui-implementation.zip", size: "8.7 MB", uploadDate: "2024-02-24" },
          { name: "responsive-demo.mp4", size: "25.3 MB", uploadDate: "2024-02-24" },
        ],
      },
      {
        id: "MS-004",
        title: "Integration & Testing",
        description: "Integrate frontend with backend and conduct comprehensive testing",
        status: "Pending",
        dueDate: "2024-03-10",
        completedDate: null,
        budget: 25000,
        payment: {
          amount: 25000,
          status: "Not Due",
          paidDate: null,
          method: "Bank Transfer",
          aiVerification: {
            status: "Pending",
            score: null,
            verifiedDate: null,
            analysis: null,
          },
        },
        deliverables: ["Integrated Application", "Test Reports", "Performance Metrics"],
        submittedFiles: [],
      },
    ],
    team: [
      { name: "Sarah Johnson", role: "Project Lead", email: "sarah@companyb.com" },
      { name: "Mike Davis", role: "Frontend Developer", email: "mike@companyb.com" },
      { name: "Lisa Chen", role: "Backend Developer", email: "lisa@companyb.com" },
      { name: "Tom Wilson", role: "UI/UX Designer", email: "tom@companyb.com" },
      { name: "Anna Rodriguez", role: "QA Engineer", email: "anna@companyb.com" },
    ],
    timeline: [
      {
        date: "2024-02-24",
        event: "Milestone 3 submitted for review",
        type: "milestone",
        description: "Frontend Components Development submitted for AI verification",
      },
      {
        date: "2024-02-05",
        event: "Payment released",
        type: "payment",
        description: "$20,000 payment released for Milestone 2 after AI verification",
      },
      {
        date: "2024-02-03",
        event: "Milestone 2 completed",
        type: "milestone",
        description: "Database Design & Backend Setup completed",
      },
      {
        date: "2024-01-20",
        event: "Payment released",
        type: "payment",
        description: "$15,000 payment released for Milestone 1",
      },
    ],
  },
  "PRJ-002": {
    id: "PRJ-002",
    name: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication",
    client: {
      id: "CLI-002",
      name: "FinanceFirst",
      contact: "projects@financefirst.com",
    },
    company: {
      id: "COMP-C",
      name: "Company C",
      contact: "mike.chen@companyc.com",
    },
    status: "Testing",
    priority: "Critical",
    phase: "Testing",
    progress: 85,
    budget: 120000,
    spent: 102000,
    startDate: "2023-11-15",
    endDate: "2024-02-28",
    teamLead: "Mike Chen",
    teamSize: 7,
    risk: "Medium",
    tags: ["React Native", "Node.js", "Security"],
    milestones: [
      {
        id: "MS-005",
        title: "Security Implementation",
        description: "Implement biometric authentication and security features",
        status: "Completed",
        dueDate: "2024-01-15",
        completedDate: "2024-01-12",
        budget: 30000,
        payment: {
          amount: 30000,
          status: "Paid",
          paidDate: "2024-01-15",
          method: "Bank Transfer",
          aiVerification: {
            status: "Verified",
            score: 98,
            verifiedDate: "2024-01-13",
            analysis: "Excellent security implementation. All security standards met and exceeded.",
          },
        },
        deliverables: ["Biometric Auth Module", "Security Documentation", "Penetration Test Results"],
        submittedFiles: [
          { name: "biometric-auth.zip", size: "8.9 MB", uploadDate: "2024-01-12" },
          { name: "security-docs.pdf", size: "4.2 MB", uploadDate: "2024-01-12" },
          { name: "pentest-results.pdf", size: "2.1 MB", uploadDate: "2024-01-12" },
        ],
      },
    ],
    team: [
      { name: "Mike Chen", role: "Project Lead", email: "mike@companyc.com" },
      { name: "Jennifer Wu", role: "Mobile Developer", email: "jennifer@companyc.com" },
      { name: "David Park", role: "Security Engineer", email: "david@companyc.com" },
    ],
    timeline: [
      {
        date: "2024-01-15",
        event: "Payment released",
        type: "payment",
        description: "$30,000 payment released for Security Implementation milestone",
      },
    ],
  },
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const project = projectsData[projectId as keyof typeof projectsData]
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null)
  const [aiAnalysisOpen, setAiAnalysisOpen] = useState(false)

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h1>
          <p className="text-slate-600 mb-4">The project you're looking for doesn't exist.</p>
          <Link href="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  const completedMilestones = project.milestones.filter((m) => m.status === "Completed").length
  const totalPayments = project.milestones.reduce((sum, m) => sum + m.payment.amount, 0)
  const paidAmount = project.milestones
    .filter((m) => m.payment.status === "Paid")
    .reduce((sum, m) => sum + m.payment.amount, 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Under Review":
        return <Brain className="h-4 w-4 text-purple-600" />
      case "In Progress":
        return <Play className="h-4 w-4 text-blue-600" />
      case "Pending":
        return <Clock className="h-4 w-4 text-slate-600" />
      default:
        return <Clock className="h-4 w-4 text-slate-600" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-600 bg-green-50"
      case "Under AI Review":
        return "text-purple-600 bg-purple-50"
      case "Pending":
        return "text-yellow-600 bg-yellow-50"
      case "Not Due":
        return "text-slate-600 bg-slate-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  const getAIVerificationIcon = (status: string) => {
    switch (status) {
      case "Verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "In Progress":
        return <Brain className="h-4 w-4 text-purple-600 animate-pulse" />
      case "Failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-slate-600" />
    }
  }

  const handleApprovePayment = (milestoneId: string) => {
    // In real app, this would make an API call
    console.log("Approving payment for milestone:", milestoneId)
    // Update milestone payment status
  }

  const handleRejectMilestone = (milestoneId: string) => {
    // In real app, this would make an API call
    console.log("Rejecting milestone:", milestoneId)
    // Update milestone status and send feedback
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
                <Badge
                  variant={
                    project.priority === "Critical"
                      ? "destructive"
                      : project.priority === "High"
                        ? "default"
                        : "secondary"
                  }
                >
                  {project.priority}
                </Badge>
                <Badge variant={project.status === "Blocked" ? "destructive" : "default"}>{project.status}</Badge>
              </div>
              <p className="text-slate-600 mb-3">{project.description}</p>
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <Link href={`/clients/${project.client.id}`} className="hover:text-blue-600 transition-colors">
                  <span className="font-medium">Client:</span> {project.client.name}
                </Link>
                <Link href={`/companies/${project.company.id}`} className="hover:text-blue-600 transition-colors">
                  <span className="font-medium">Company:</span> {project.company.name}
                </Link>
                <span>
                  <span className="font-medium">Team Lead:</span> {project.teamLead}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Contact Team
              </Button>
              <Link href={`/projects/${project.id}/edit`}>
                <Button className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Project
                </Button>
              </Link>
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
                    <p className="text-2xl font-bold text-slate-900">${(project.budget / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-slate-600">Total Budget</p>
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
                    <p className="text-2xl font-bold text-slate-900">{project.teamSize}</p>
                    <p className="text-sm text-slate-600">Team Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Details Tabs */}
          <Tabs defaultValue="milestones" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="milestones">Milestones & AI Review</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="milestones" className="space-y-6">
              <div className="space-y-4">
                {project.milestones.map((milestone, index) => (
                  <Card key={milestone.id} className="border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(milestone.status)}
                          <div>
                            <CardTitle className="text-lg">{milestone.title}</CardTitle>
                            <p className="text-sm text-slate-600 mt-1">{milestone.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={milestone.status === "Completed" ? "default" : "secondary"}>
                            {milestone.status}
                          </Badge>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(milestone.payment.status)}`}
                          >
                            {milestone.payment.status}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-slate-600">Due Date</p>
                          <p className="font-medium text-slate-900">{milestone.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Budget</p>
                          <p className="font-medium text-slate-900">${milestone.budget.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Payment Status</p>
                          <p className="font-medium text-slate-900">{milestone.payment.status}</p>
                        </div>
                      </div>

                      {/* AI Verification Section */}
                      {milestone.payment.aiVerification && (
                        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                          <div className="flex items-center gap-2 mb-3">
                            {getAIVerificationIcon(milestone.payment.aiVerification.status)}
                            <h4 className="font-medium text-slate-900">AI Verification</h4>
                            {milestone.payment.aiVerification.score && (
                              <Badge variant="outline">Score: {milestone.payment.aiVerification.score}/100</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{milestone.payment.aiVerification.analysis}</p>
                          {milestone.payment.aiVerification.status === "Verified" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="gap-2"
                                onClick={() => handleApprovePayment(milestone.id)}
                                disabled={milestone.payment.status === "Paid"}
                              >
                                <DollarSign className="h-4 w-4" />
                                {milestone.payment.status === "Paid" ? "Payment Released" : "Release Payment"}
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="gap-2">
                                    <Eye className="h-4 w-4" />
                                    View Analysis
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>AI Verification Details</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Verification Score</Label>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                                          <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${milestone.payment.aiVerification.score}%` }}
                                          />
                                        </div>
                                        <span className="text-sm font-medium">
                                          {milestone.payment.aiVerification.score}/100
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Analysis Report</Label>
                                      <Textarea
                                        value={milestone.payment.aiVerification.analysis || ""}
                                        readOnly
                                        className="mt-1"
                                        rows={4}
                                      />
                                    </div>
                                    <div>
                                      <Label>Verified Date</Label>
                                      <p className="text-sm text-slate-600 mt-1">
                                        {milestone.payment.aiVerification.verifiedDate}
                                      </p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                          {milestone.payment.aiVerification.status === "In Progress" && (
                            <div className="flex items-center gap-2 text-purple-600">
                              <Zap className="h-4 w-4 animate-pulse" />
                              <span className="text-sm">AI analysis in progress...</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-slate-600 mb-2">Deliverables</p>
                        <div className="flex flex-wrap gap-2">
                          {milestone.deliverables.map((deliverable) => (
                            <Badge key={deliverable} variant="outline">
                              {deliverable}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Submitted Files */}
                      {milestone.submittedFiles.length > 0 && (
                        <div>
                          <p className="text-sm text-slate-600 mb-2">Submitted Files</p>
                          <div className="space-y-2">
                            {milestone.submittedFiles.map((file, fileIndex) => (
                              <div
                                key={fileIndex}
                                className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-slate-500" />
                                  <span className="text-sm font-medium">{file.name}</span>
                                  <span className="text-xs text-slate-500">({file.size})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500">{file.uploadDate}</span>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {milestone.status === "Completed" && (
                        <div className="pt-3 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-green-600">✓ Completed on {milestone.completedDate}</div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="gap-2">
                                <Download className="h-4 w-4" />
                                Download All
                              </Button>
                              <Button variant="outline" size="sm" className="gap-2">
                                <FileText className="h-4 w-4" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {milestone.status === "Under Review" && (
                        <div className="pt-3 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-purple-600">
                              🔍 Under AI review since {milestone.completedDate}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Contact Team
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {milestone.status === "Pending" && (
                        <div className="pt-3 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-600">⏳ Awaiting completion</div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="gap-2">
                                <Upload className="h-4 w-4" />
                                Upload Files
                              </Button>
                              <Button variant="outline" size="sm" className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Discuss
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Payment Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-900">${totalPayments.toLocaleString()}</p>
                      <p className="text-sm text-slate-600">Total Contract Value</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">${paidAmount.toLocaleString()}</p>
                      <p className="text-sm text-slate-600">Paid Amount</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">
                        ${(totalPayments - paidAmount).toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-600">Remaining</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {project.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium text-slate-900">{milestone.title}</h3>
                          <p className="text-sm text-slate-600">Due: {milestone.dueDate}</p>
                          {milestone.payment.aiVerification?.status === "Verified" && (
                            <div className="flex items-center gap-1 mt-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600">AI Verified</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">${milestone.payment.amount.toLocaleString()}</p>
                          <div
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(milestone.payment.status)}`}
                          >
                            {milestone.payment.status}
                          </div>
                          {milestone.payment.paidDate && (
                            <p className="text-xs text-slate-500 mt-1">Paid: {milestone.payment.paidDate}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Project Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.team.map((member) => (
                      <div
                        key={member.email}
                        className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{member.name}</h3>
                          <p className="text-sm text-slate-600">{member.role}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.timeline.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${event.type === "milestone" ? "bg-blue-500" : "bg-green-500"}`}
                          />
                          {index < project.timeline.length - 1 && <div className="w-0.5 h-8 bg-slate-200 mt-2" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-slate-900">{event.event}</h3>
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">{event.description}</p>
                          <p className="text-xs text-slate-500">{event.date}</p>
                        </div>
                      </div>
                    ))}
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
