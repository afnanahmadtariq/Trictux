"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

const projects = [
  {
    id: "PRJ-001",
    name: "E-commerce Platform Redesign",
    description: "Complete redesign of the e-commerce platform with modern UI/UX",
    client: {
      id: "CLI-001",
      name: "TechCorp Inc.",
    },
    company: {
      id: "COMP-B",
      name: "Company B",
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
    milestones: 4,
    completedMilestones: 2,
    nextMilestone: "Frontend Components",
    risk: "Low",
    tags: ["React", "Node.js", "E-commerce"],
  },
  {
    id: "PRJ-002",
    name: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication",
    client: {
      id: "CLI-002",
      name: "FinanceFirst",
    },
    company: {
      id: "COMP-C",
      name: "Company C",
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
    milestones: 5,
    completedMilestones: 4,
    nextMilestone: "Security Audit",
    risk: "Medium",
    tags: ["React Native", "Node.js", "Security"],
  },
  {
    id: "PRJ-003",
    name: "AI Chatbot Integration",
    description: "Integration of AI-powered chatbot for customer support",
    client: {
      id: "CLI-003",
      name: "ServicePro",
    },
    company: {
      id: "COMP-D",
      name: "Company D",
    },
    status: "Blocked",
    priority: "Medium",
    phase: "Design",
    progress: 25,
    budget: 45000,
    spent: 11250,
    startDate: "2024-01-05",
    endDate: "2024-04-10",
    teamLead: "Alex Rodriguez",
    teamSize: 3,
    milestones: 3,
    completedMilestones: 0,
    nextMilestone: "API Design",
    risk: "High",
    tags: ["AI", "Python", "APIs"],
  },
  {
    id: "PRJ-004",
    name: "Inventory Management System",
    description: "Real-time inventory tracking and management system",
    client: {
      id: "CLI-004",
      name: "RetailMax",
    },
    company: {
      id: "COMP-B",
      name: "Company B",
    },
    status: "Deploying",
    priority: "High",
    phase: "Deployment",
    progress: 95,
    budget: 65000,
    spent: 61750,
    startDate: "2023-12-01",
    endDate: "2024-01-25",
    teamLead: "Emma Wilson",
    teamSize: 4,
    milestones: 4,
    completedMilestones: 4,
    nextMilestone: "Production Release",
    risk: "Low",
    tags: ["Vue.js", "MySQL", "Real-time"],
  },
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedPriority, setSelectedPriority] = useState("All")

  const statuses = ["All", "Planning", "In Progress", "Testing", "Blocked", "Deploying", "Completed"]
  const priorities = ["All", "Critical", "High", "Medium", "Low"]

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.company.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus
    const matchesPriority = selectedPriority === "All" || project.priority === selectedPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0)
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0)
  const totalMilestones = projects.reduce((sum, project) => sum + project.milestones, 0)
  const completedMilestones = projects.reduce((sum, project) => sum + project.completedMilestones, 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Progress":
        return <Play className="h-4 w-4 text-blue-600" />
      case "Testing":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Blocked":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "Deploying":
        return <Clock className="h-4 w-4 text-purple-600" />
      default:
        return <FolderKanban className="h-4 w-4 text-slate-600" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-red-600 bg-red-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-green-600 bg-green-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Project Management</h1>
              <p className="text-slate-600 mt-1">Track and manage all projects across your network</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
              <Link href="/projects/create">
                <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600">
                  <Plus className="h-4 w-4" />
                  New Project
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
                    <FolderKanban className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
                    <p className="text-sm text-slate-600">Total Projects</p>
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
                      {completedMilestones}/{totalMilestones}
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
                    <p className="text-2xl font-bold text-slate-900">${(totalBudget / 1000).toFixed(0)}K</p>
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
                    <p className="text-2xl font-bold text-slate-900">
                      {projects.reduce((sum, project) => sum + project.teamSize, 0)}
                    </p>
                    <p className="text-sm text-slate-600">Team Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search projects, clients, companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    {statuses.slice(0, 5).map((status) => (
                      <Button
                        key={status}
                        variant={selectedStatus === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedStatus(status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="border-slate-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(project.status)}
                        <CardTitle className="text-lg">
                          <Link href={`/projects/${project.id}`} className="hover:text-blue-600 transition-colors">
                            {project.name}
                          </Link>
                        </CardTitle>
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
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <Link href={`/clients/${project.client.id}`} className="hover:text-blue-600 transition-colors">
                          {project.client.name}
                        </Link>
                        <span>•</span>
                        <Link
                          href={`/companies/${project.company.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {project.company.name}
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={project.status === "Blocked" ? "destructive" : "default"}>{project.status}</Badge>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(project.risk)}`}>
                        {project.risk} Risk
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/projects/${project.id}`} className="gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/projects/${project.id}/edit`} className="gap-2">
                              <Edit className="h-4 w-4" />
                              Edit Project
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-medium text-slate-900">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-200">
                    <div>
                      <p className="text-sm text-slate-600">Budget</p>
                      <p className="font-semibold text-slate-900">${(project.budget / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Spent</p>
                      <p className="font-semibold text-slate-900">${(project.spent / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Team Size</p>
                      <p className="font-semibold text-slate-900">{project.teamSize} members</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Milestones</p>
                      <p className="font-semibold text-slate-900">
                        {project.completedMilestones}/{project.milestones}
                      </p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center justify-between text-sm text-slate-600 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {project.startDate} - {project.endDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {project.teamLead}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <Link href={`/projects/${project.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                    <Button size="sm" className="flex-1 gap-2">
                      <Building2 className="h-4 w-4" />
                      Contact Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
