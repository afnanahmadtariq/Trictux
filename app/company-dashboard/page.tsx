"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderKanban, Users, CheckCircle, Plus, MessageSquare, Eye, UserPlus, Target } from "lucide-react"
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
    deadline: "2024-03-15",
    teamLead: "Sarah Johnson",
    teamSize: 5,
    currentMilestone: "Frontend Components Development",
    milestones: [
      {
        id: "MS-001",
        title: "Project Planning & Requirements",
        status: "Completed",
        dueDate: "2024-01-20",
        assignedTo: ["sarah.johnson", "mike.davis"],
      },
      {
        id: "MS-002",
        title: "Database Design & Backend Setup",
        status: "Completed",
        dueDate: "2024-02-05",
        assignedTo: ["lisa.chen"],
      },
      {
        id: "MS-003",
        title: "Frontend Components Development",
        status: "In Progress",
        dueDate: "2024-02-25",
        assignedTo: ["mike.davis", "tom.wilson"],
      },
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
    deadline: "2024-01-25",
    teamLead: "Emma Wilson",
    teamSize: 4,
    currentMilestone: "Production Release",
    milestones: [
      {
        id: "MS-010",
        title: "Production Release",
        status: "In Progress",
        dueDate: "2024-01-25",
        assignedTo: ["emma.wilson", "anna.rodriguez"],
      },
    ],
  },
]

const teamMembers = [
  {
    id: "sarah.johnson",
    name: "Sarah Johnson",
    role: "Project Lead",
    email: "sarah@companyb.com",
    skills: ["React", "Node.js", "Project Management"],
    currentTasks: 3,
    availability: "Available",
  },
  {
    id: "mike.davis",
    name: "Mike Davis",
    role: "Frontend Developer",
    email: "mike@companyb.com",
    skills: ["React", "TypeScript", "CSS"],
    currentTasks: 2,
    availability: "Busy",
  },
  {
    id: "lisa.chen",
    name: "Lisa Chen",
    role: "Backend Developer",
    email: "lisa@companyb.com",
    skills: ["Node.js", "PostgreSQL", "APIs"],
    currentTasks: 1,
    availability: "Available",
  },
  {
    id: "tom.wilson",
    name: "Tom Wilson",
    role: "UI/UX Designer",
    email: "tom@companyb.com",
    skills: ["Figma", "UI Design", "UX Research"],
    currentTasks: 2,
    availability: "Available",
  },
  {
    id: "anna.rodriguez",
    name: "Anna Rodriguez",
    role: "QA Engineer",
    email: "anna@companyb.com",
    skills: ["Testing", "Automation", "Quality Assurance"],
    currentTasks: 1,
    availability: "Available",
  },
]

export default function CompanyDashboard() {
  const [selectedProject, setSelectedProject] = useState(assignedProjects[0])

  const totalTasks = teamMembers.reduce((sum, member) => sum + member.currentTasks, 0)
  const availableMembers = teamMembers.filter((member) => member.availability === "Available").length

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Company B Dashboard</h1>
              <p className="text-slate-600 mt-1">Manage your assigned projects and team</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Client Chat
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600">
                <UserPlus className="h-4 w-4" />
                Add Team Member
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
                    <FolderKanban className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{assignedProjects.length}</p>
                    <p className="text-sm text-slate-600">Active Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-50">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{teamMembers.length}</p>
                    <p className="text-sm text-slate-600">Team Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-50">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{totalTasks}</p>
                    <p className="text-sm text-slate-600">Active Tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-yellow-50">
                    <CheckCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{availableMembers}</p>
                    <p className="text-sm text-slate-600">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="team">Team Management</TabsTrigger>
              <TabsTrigger value="tasks">Task Assignment</TabsTrigger>
              <TabsTrigger value="clients">Client Communication</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {assignedProjects.map((project) => (
                  <Card key={project.id} className="border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <p className="text-sm text-slate-600 mt-1">Client: {project.client}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={project.priority === "High" ? "default" : "secondary"}>
                            {project.priority}
                          </Badge>
                          <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium text-slate-900">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Budget</p>
                          <p className="font-medium text-slate-900">${(project.budget / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Deadline</p>
                          <p className="font-medium text-slate-900">{project.deadline}</p>
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

                      <div>
                        <p className="text-sm text-slate-600 mb-2">Current Milestone</p>
                        <p className="font-medium text-slate-900">{project.currentMilestone}</p>
                      </div>

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

            <TabsContent value="team" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <CardTitle className="text-base">{member.name}</CardTitle>
                            <p className="text-sm text-slate-600">{member.role}</p>
                          </div>
                        </div>
                        <Badge variant={member.availability === "Available" ? "default" : "secondary"}>
                          {member.availability}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Current Tasks</span>
                        <span className="font-medium text-slate-900">{member.currentTasks}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Plus className="h-4 w-4" />
                          Assign Task
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Task Assignment</CardTitle>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Task
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignedProjects.map((project) =>
                      project.milestones.map((milestone) => (
                        <div key={milestone.id} className="p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium text-slate-900">{milestone.title}</h3>
                              <p className="text-sm text-slate-600">{project.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={milestone.status === "Completed" ? "default" : "secondary"}>
                                {milestone.status}
                              </Badge>
                              <span className="text-sm text-slate-600">{milestone.dueDate}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-600">Assigned to:</span>
                              <div className="flex gap-1">
                                {milestone.assignedTo.map((memberId) => {
                                  const member = teamMembers.find((m) => m.id === memberId)
                                  return (
                                    <Badge key={memberId} variant="outline" className="text-xs">
                                      {member?.name.split(" ")[0]}
                                    </Badge>
                                  )
                                })}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="gap-2">
                                <Users className="h-4 w-4" />
                                Reassign
                              </Button>
                              <Button variant="outline" size="sm" className="gap-2">
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      )),
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {assignedProjects.map((project) => (
                  <Card key={project.id} className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-lg">{project.client}</CardTitle>
                      <p className="text-sm text-slate-600">{project.name}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Contact:</span>
                        <span className="text-sm font-medium text-slate-900">{project.clientContact}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Project Status:</span>
                        <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Send Message
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Eye className="h-4 w-4" />
                          View Project
                        </Button>
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
