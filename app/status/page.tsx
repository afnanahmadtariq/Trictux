"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, AlertTriangle, CheckCircle, Play, Filter, RefreshCw } from "lucide-react"

const projectStatuses = [
  {
    id: "PRJ-001",
    name: "E-commerce Platform Redesign",
    client: "TechCorp Inc.",
    company: "Company B",
    phase: "Development",
    progress: 65,
    status: "In Progress",
    lastActivity: "2 hours ago",
    nextMilestone: "Frontend Components",
    dueDate: "2024-02-15",
    risk: "Low",
    teamLead: "Sarah Johnson",
    blockers: [],
  },
  {
    id: "PRJ-002",
    name: "Mobile Banking App",
    client: "FinanceFirst",
    company: "Company C",
    phase: "Testing",
    progress: 85,
    status: "Testing",
    lastActivity: "30 minutes ago",
    nextMilestone: "Security Audit",
    dueDate: "2024-01-28",
    risk: "Medium",
    teamLead: "Mike Chen",
    blockers: ["Pending security review"],
  },
  {
    id: "PRJ-003",
    name: "AI Chatbot Integration",
    client: "ServicePro",
    company: "Company D",
    phase: "Design",
    progress: 25,
    status: "Blocked",
    lastActivity: "1 day ago",
    nextMilestone: "API Design",
    dueDate: "2024-03-10",
    risk: "High",
    teamLead: "Alex Rodriguez",
    blockers: ["Waiting for API specifications", "Client feedback pending"],
  },
  {
    id: "PRJ-004",
    name: "Inventory Management System",
    client: "RetailMax",
    company: "Company B",
    phase: "Deployment",
    progress: 95,
    status: "Deploying",
    lastActivity: "15 minutes ago",
    nextMilestone: "Production Release",
    dueDate: "2024-01-25",
    risk: "Low",
    teamLead: "Emma Wilson",
    blockers: [],
  },
]

const phases = ["Planning", "Design", "Development", "Testing", "Deployment", "Maintenance"]

export default function StatusPage() {
  const [selectedCompany, setSelectedCompany] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const companies = ["All", "Company B", "Company C", "Company D"]
  const statuses = ["All", "In Progress", "Testing", "Blocked", "Deploying"]

  const filteredProjects = projectStatuses.filter((project) => {
    const matchesCompany = selectedCompany === "All" || project.company === selectedCompany
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus
    return matchesCompany && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Progress":
        return <Play className="h-4 w-4 text-blue-600" />
      case "Testing":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Blocked":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "Deploying":
        return <RefreshCw className="h-4 w-4 text-purple-600 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-slate-600" />
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

  const getProgressColor = (progress: number, risk: string) => {
    if (risk === "High") return "bg-red-500"
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-blue-500"
    return "bg-yellow-500"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Real-Time Project Status</h1>
          <p className="text-slate-600 mt-1">
            Live monitoring across all partner companies • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <Filter className="h-4 w-4 text-slate-500" />
            <div className="flex gap-2">
              <span className="text-sm font-medium text-slate-700">Company:</span>
              {companies.map((company) => (
                <Button
                  key={company}
                  variant={selectedCompany === company ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCompany(company)}
                >
                  {company}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-medium text-slate-700">Status:</span>
              {statuses.map((status) => (
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

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Play className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {projectStatuses.filter((p) => p.status === "In Progress").length}
                </p>
                <p className="text-sm text-slate-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {projectStatuses.filter((p) => p.status === "Testing").length}
                </p>
                <p className="text-sm text-slate-600">Testing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {projectStatuses.filter((p) => p.status === "Blocked").length}
                </p>
                <p className="text-sm text-slate-600">Blocked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {projectStatuses.filter((p) => p.status === "Deploying").length}
                </p>
                <p className="text-sm text-slate-600">Deploying</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(project.status)}
                    {project.name}
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-1">
                    {project.client} • {project.company}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={project.status === "Blocked" ? "destructive" : "default"}>{project.status}</Badge>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(project.risk)}`}>
                    {project.risk} Risk
                  </div>
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
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress, project.risk)}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Phase Timeline */}
              <div>
                <p className="text-sm text-slate-600 mb-2">
                  Current Phase: <strong>{project.phase}</strong>
                </p>
                <div className="flex items-center gap-2">
                  {phases.map((phase, index) => {
                    const isActive = phase === project.phase
                    const isCompleted = phases.indexOf(project.phase) > index
                    return (
                      <div key={phase} className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isActive ? "bg-blue-500" : isCompleted ? "bg-green-500" : "bg-slate-300"
                          }`}
                        />
                        {index < phases.length - 1 && (
                          <div className={`w-8 h-0.5 ${isCompleted ? "bg-green-500" : "bg-slate-300"}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                <div>
                  <p className="text-sm text-slate-500">Team Lead</p>
                  <p className="font-medium text-slate-900">{project.teamLead}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Due Date</p>
                  <p className="font-medium text-slate-900">{project.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Next Milestone</p>
                  <p className="font-medium text-slate-900">{project.nextMilestone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Last Activity</p>
                  <p className="font-medium text-slate-900">{project.lastActivity}</p>
                </div>
              </div>

              {/* Blockers */}
              {project.blockers.length > 0 && (
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-sm font-medium text-red-600 mb-2">Active Blockers:</p>
                  <div className="space-y-1">
                    {project.blockers.map((blocker, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-red-700 bg-red-50 p-2 rounded">
                        <AlertTriangle className="h-3 w-3" />
                        {blocker}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-slate-200">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Contact Team
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
