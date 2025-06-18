"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Calendar, Target } from "lucide-react"
import Link from "next/link"

const clients = [
  { id: "CLI-001", name: "TechCorp Inc." },
  { id: "CLI-002", name: "FinanceFirst" },
  { id: "CLI-003", name: "ServicePro" },
  { id: "CLI-004", name: "RetailMax" },
]

const companies = [
  { id: "COMP-B", name: "Company B" },
  { id: "COMP-C", name: "Company C" },
  { id: "COMP-D", name: "Company D" },
]

export default function CreateProjectPage() {
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    clientId: "",
    companyId: "",
    priority: "",
    budget: "",
    startDate: "",
    endDate: "",
    teamLead: "",
    teamSize: "",
    tags: [] as string[],
  })

  const [newTag, setNewTag] = useState("")
  const [milestones, setMilestones] = useState([
    {
      title: "",
      description: "",
      dueDate: "",
      budget: "",
      deliverables: [] as string[],
    },
  ])

  const addTag = () => {
    if (newTag.trim() && !projectData.tags.includes(newTag.trim())) {
      setProjectData({
        ...projectData,
        tags: [...projectData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setProjectData({
      ...projectData,
      tags: projectData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: "",
        description: "",
        dueDate: "",
        budget: "",
        deliverables: [],
      },
    ])
  }

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const updateMilestone = (index: number, field: string, value: string) => {
    const updated = milestones.map((milestone, i) => (i === index ? { ...milestone, [field]: value } : milestone))
    setMilestones(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Project Data:", projectData)
    console.log("Milestones:", milestones)
    // Redirect to projects page or show success message
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
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create New Project</h1>
            <p className="text-slate-600 mt-1">Set up a new project with milestones and payment structure</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      value={projectData.name}
                      onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={projectData.priority}
                      onValueChange={(value) => setProjectData({ ...projectData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={projectData.description}
                    onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                    placeholder="Describe the project objectives and scope"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Select
                      value={projectData.clientId}
                      onValueChange={(value) => setProjectData({ ...projectData, clientId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="company">Assigned Company</Label>
                    <Select
                      value={projectData.companyId}
                      onValueChange={(value) => setProjectData({ ...projectData, companyId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Total Budget ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={projectData.budget}
                      onChange={(e) => setProjectData({ ...projectData, budget: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input
                      id="teamSize"
                      type="number"
                      value={projectData.teamSize}
                      onChange={(e) => setProjectData({ ...projectData, teamSize: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={projectData.startDate}
                      onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={projectData.endDate}
                      onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="teamLead">Team Lead</Label>
                  <Input
                    id="teamLead"
                    value={projectData.teamLead}
                    onChange={(e) => setProjectData({ ...projectData, teamLead: e.target.value })}
                    placeholder="Enter team lead name"
                    required
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {projectData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Project Milestones
                  </CardTitle>
                  <Button type="button" onClick={addMilestone} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Milestone
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-900">Milestone {index + 1}</h3>
                      {milestones.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeMilestone(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Milestone Title</Label>
                        <Input
                          value={milestone.title}
                          onChange={(e) => updateMilestone(index, "title", e.target.value)}
                          placeholder="Enter milestone title"
                          required
                        />
                      </div>
                      <div>
                        <Label>Budget ($)</Label>
                        <Input
                          type="number"
                          value={milestone.budget}
                          onChange={(e) => updateMilestone(index, "budget", e.target.value)}
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={milestone.description}
                        onChange={(e) => updateMilestone(index, "description", e.target.value)}
                        placeholder="Describe what will be delivered in this milestone"
                        rows={2}
                        required
                      />
                    </div>

                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => updateMilestone(index, "dueDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4 justify-end">
              <Link href="/projects">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
