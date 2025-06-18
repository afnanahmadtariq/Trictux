"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FolderKanban,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

const assignedProjects = [
  {
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
    teamLead: "Sarah Johnson",
    teamSize: 5,
    currentMilestone: "Frontend Components Development",
    nextDeadline: "2024-02-25",
    description: "Complete redesign of the e-commerce platform with modern UI/UX",
    tags: ["React", "Node.js", "E-commerce"],
    milestones: [
      { title: "Planning", status: "Completed", dueDate: "2024-01-20" },
      { title: "Backend Setup", status: "Completed", dueDate: "2024-02-05" },
      { title: "Frontend Development", status: "In Progress", dueDate: "2024-02-25" },
      { title: "Testing & Deployment", status: "Pending", dueDate: "2024-03-10" },
    ],
  },
  {
    id: "PRJ-004",
    name: "Inventory Management System",
    client: "RetailMax",
    clientContact: "tech@retailmax.com",
    status: "Testing",
    priority: "High",
    progress: 95,
    budget: 65000,
    spent: 61750,
    deadline: "2024-01-25",
    startDate: "2023-12-01",
    teamLead: "Emma Wilson",
    teamSize: 4,
    currentMilestone: "Production Release",
    nextDeadline: "2024-01-25",
    description: "Real-time inventory tracking and management system",
    tags: ["Vue.js", "MySQL", "Real-time"],
    milestones: [
      { title: "System Design", status: "Completed", dueDate: "2023-12-15" },
      { title: "Core Development", status: "Completed", dueDate: "2024-01-05" },
      { title: "Integration Testing", status: "Completed", dueDate: "2024-01-15" },
      { title: "Production Release", status: "In Progress", dueDate: "2024-01-25" },
    ],
  },
  {
    id: "PRJ-007",
    name: "Customer Portal Development",
    client: "ServiceHub",
    clientContact: "dev@servicehub.com",
    status: "Planning",
    priority: "Medium",
    progress: 15,
    budget: 45000,
    spent: 6750,
    deadline: "2024-04-15",
    startDate: "2024-01-20",
    teamLead: "Mike Davis",
    teamSize: 3,
    currentMilestone: "Requirements Analysis",
    nextDeadline: "2024-02-10",
    description: "Self-service customer portal with ticketing system",
    tags: ["React", "Python", "APIs"],
    milestones: [
      { title: "Requirements Analysis", status: "In Progress", dueDate: "2024-02-10" },
      { title: "UI/UX Design", status: "Pending", dueDate: "2024-02-25" },
      { title: "Development", status: "Pending", dueDate: "2024-03-20" },
      { title: "Testing & Launch", status: "Pending", dueDate: "2024-04-10" },
    ],
  },
]

export default function CompanyProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const filteredProjects = assignedProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "Testing":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Planning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <FolderKanban className="h-4 w-4 text-slate-600" />
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-blue-500"
    return "bg-yellow-500"
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Assigned Projects</h1>
              <p className="text-slate-600 mt-1">Manage your active project assignments</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Submit Deliverable
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search and Filters */}
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  {["All", "In Progress", "Testing", "Planning"].map((status) => (
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
            </CardContent>
          </Card>

          {/* Projects List */}
          <Tabs defaultValue="grid" className="space-y-6">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="border-slate-200 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(project.status)}
                          <div>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <p className="text-sm text-slate-600 mt-1">{project.client}</p>
                            <p className="text-sm text-slate-500 mt-1">{project.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={project.priority === "High" ? "destructive" : "default"}>
                            {project.priority}
                          </Badge>
                          <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
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
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Budget</p>
                          <p className="font-medium text-slate-900">${(project.budget / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Spent</p>
                          <p className="font-medium text-slate-900">${(project.spent / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Team Lead</p>
                          <p className="font-medium text-slate-900">{project.teamLead}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Team Size</p>
                          <p className="font-medium text-slate-900">{project.teamSize} members</p>
                        </div>
                      </div>

                      {/* Current Milestone */}
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Current Milestone</p>
                        <p className="text-sm text-blue-800">{project.currentMilestone}</p>
                        <p className="text-xs text-blue-700 mt-1">Due: {project.nextDeadline}</p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-slate-200">
                        <Link href={`/company-dashboard/projects/${project.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </Link>
                        <Button size="sm" className="flex-1 gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Contact Client
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(project.status)}
                        <div>
                          <h3 className="font-semibold text-slate-900">{project.name}</h3>
                          <p className="text-sm text-slate-600">
                            {project.client} • {project.teamLead}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">{project.progress}%</p>
                          <p className="text-xs text-slate-600">Progress</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">{project.nextDeadline}</p>
                          <p className="text-xs text-slate-600">Next Deadline</p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/company-dashboard/projects/${project.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
