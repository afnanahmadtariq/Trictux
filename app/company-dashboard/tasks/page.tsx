"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Target, Plus, Search, Filter, CheckCircle, Clock, AlertTriangle, Edit, Trash2, UserPlus } from "lucide-react"

const tasks = [
  {
    id: "TASK-001",
    title: "Frontend Components Development",
    description: "Develop reusable frontend components for the e-commerce platform",
    project: "E-commerce Platform Redesign",
    assignedTo: ["Mike Davis", "Tom Wilson"],
    status: "In Progress",
    priority: "High",
    dueDate: "2024-02-25",
    progress: 75,
    estimatedHours: 40,
    loggedHours: 30,
    tags: ["React", "Components", "UI"],
  },
  {
    id: "TASK-002",
    title: "API Integration Testing",
    description: "Test and validate API integrations for inventory system",
    project: "Inventory Management System",
    assignedTo: ["Anna Rodriguez"],
    status: "Testing",
    priority: "Medium",
    dueDate: "2024-02-20",
    progress: 90,
    estimatedHours: 16,
    loggedHours: 14,
    tags: ["Testing", "APIs", "Integration"],
  },
  {
    id: "TASK-003",
    title: "Database Schema Optimization",
    description: "Optimize database queries and improve performance",
    project: "E-commerce Platform Redesign",
    assignedTo: ["Lisa Chen"],
    status: "Completed",
    priority: "High",
    dueDate: "2024-02-15",
    progress: 100,
    estimatedHours: 24,
    loggedHours: 22,
    tags: ["Database", "Performance", "SQL"],
  },
  {
    id: "TASK-004",
    title: "User Authentication Module",
    description: "Implement secure user authentication and authorization",
    project: "Customer Portal Development",
    assignedTo: ["Sarah Johnson"],
    status: "Planning",
    priority: "High",
    dueDate: "2024-03-05",
    progress: 10,
    estimatedHours: 32,
    loggedHours: 3,
    tags: ["Security", "Authentication", "Backend"],
  },
]

const teamMembers = [
  { id: "sarah", name: "Sarah Johnson", role: "Project Lead" },
  { id: "mike", name: "Mike Davis", role: "Frontend Developer" },
  { id: "lisa", name: "Lisa Chen", role: "Backend Developer" },
  { id: "tom", name: "Tom Wilson", role: "UI/UX Designer" },
  { id: "anna", name: "Anna Rodriguez", role: "QA Engineer" },
]

export default function TaskAssignmentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedProject, setSelectedProject] = useState("All")
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: [],
    priority: "",
    dueDate: "",
    estimatedHours: "",
  })

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || task.status === selectedStatus
    const matchesProject = selectedProject === "All" || task.project === selectedProject
    return matchesSearch && matchesStatus && matchesProject
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "Testing":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "Planning":
        return <Target className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-slate-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const projects = ["All", ...Array.from(new Set(tasks.map((task) => task.project)))]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Task Assignment</h1>
              <p className="text-slate-600 mt-1">Manage and assign tasks to team members</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                          id="title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          placeholder="Enter task title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Describe the task"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="project">Project</Label>
                        <Select
                          value={newTask.project}
                          onValueChange={(value) => setNewTask({ ...newTask, project: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects
                              .filter((p) => p !== "All")
                              .map((project) => (
                                <SelectItem key={project} value={project}>
                                  {project}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="estimatedHours">Estimated Hours</Label>
                      <Input
                        id="estimatedHours"
                        type="number"
                        value={newTask.estimatedHours}
                        onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <Button className="w-full">Create Task</Button>
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
          {/* Filters */}
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Testing">Testing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project} value={project}>
                          {project === "All" ? "All Projects" : project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(task.status)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{task.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                        <p className="text-sm text-slate-500">{task.project}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={task.status === "Completed" ? "default" : "secondary"}>{task.status}</Badge>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-600">Assigned To</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {task.assignedTo.map((person) => (
                          <Badge key={person} variant="outline" className="text-xs">
                            {person.split(" ")[0]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Due Date</p>
                      <p className="font-medium text-slate-900">{task.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Progress</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-900">{task.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Hours</p>
                      <p className="font-medium text-slate-900">
                        {task.loggedHours}/{task.estimatedHours}h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Reassign
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
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
