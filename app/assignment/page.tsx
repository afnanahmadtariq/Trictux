"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Brain, Building2, Star, Users, Clock } from "lucide-react"

const pendingProjects = [
  {
    id: "PRJ-005",
    name: "Healthcare Management System",
    client: "MedTech Solutions",
    priority: "Critical",
    budget: "$85,000",
    deadline: "2024-03-15",
    requiredSkills: ["React", "Node.js", "PostgreSQL", "Healthcare APIs"],
    complexity: "High",
    estimatedDuration: "4 months",
  },
  {
    id: "PRJ-006",
    name: "Inventory Management App",
    client: "RetailMax",
    priority: "High",
    budget: "$45,000",
    deadline: "2024-02-28",
    requiredSkills: ["Vue.js", "Python", "MySQL", "REST APIs"],
    complexity: "Medium",
    estimatedDuration: "2.5 months",
  },
]

const companies = [
  {
    id: "COMP-B",
    name: "Company B",
    specialties: ["React", "Node.js", "PostgreSQL", "Healthcare APIs", "E-commerce"],
    currentWorkload: 75,
    successRate: 94.2,
    avgDeliveryTime: "2.8 months",
    activeProjects: 6,
    teamSize: 12,
    rating: 4.8,
    lastDelivery: "On time",
    matchScore: 95,
  },
  {
    id: "COMP-C",
    name: "Company C",
    specialties: ["Vue.js", "Python", "MySQL", "REST APIs", "Mobile Development"],
    currentWorkload: 60,
    successRate: 96.1,
    avgDeliveryTime: "2.3 months",
    activeProjects: 4,
    teamSize: 8,
    rating: 4.9,
    lastDelivery: "2 days early",
    matchScore: 88,
  },
  {
    id: "COMP-D",
    name: "Company D",
    specialties: ["Angular", "Java", "MongoDB", "Microservices", "DevOps"],
    currentWorkload: 45,
    successRate: 91.7,
    avgDeliveryTime: "3.1 months",
    activeProjects: 3,
    teamSize: 10,
    rating: 4.6,
    lastDelivery: "On time",
    matchScore: 72,
  },
]

export default function AssignmentPage() {
  const [selectedProject, setSelectedProject] = useState(pendingProjects[0])
  const [assignmentMode, setAssignmentMode] = useState<"auto" | "manual">("auto")

  const getWorkloadColor = (workload: number) => {
    if (workload >= 80) return "text-red-600"
    if (workload >= 60) return "text-yellow-600"
    return "text-green-600"
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Smart Assignment Engine</h1>
          <p className="text-slate-600 mt-1">AI-powered project assignment based on skills and performance</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={assignmentMode === "auto" ? "default" : "outline"}
            onClick={() => setAssignmentMode("auto")}
            className="gap-2"
          >
            <Brain className="h-4 w-4" />
            Auto Mode
          </Button>
          <Button
            variant={assignmentMode === "manual" ? "default" : "outline"}
            onClick={() => setAssignmentMode("manual")}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Manual Mode
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Projects */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingProjects.map((project) => (
              <div
                key={project.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedProject.id === project.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">{project.name}</h3>
                  <Badge variant={project.priority === "Critical" ? "destructive" : "default"}>
                    {project.priority}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-2">{project.client}</p>
                <div className="space-y-1 text-sm text-slate-500">
                  <p>Budget: {project.budget}</p>
                  <p>Deadline: {project.deadline}</p>
                  <p>Duration: {project.estimatedDuration}</p>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-1">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.requiredSkills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {project.requiredSkills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.requiredSkills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Project Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">{selectedProject.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{selectedProject.client}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-500">Budget</p>
                  <p className="font-semibold text-slate-900">{selectedProject.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Complexity</p>
                  <Badge variant={selectedProject.complexity === "High" ? "destructive" : "default"}>
                    {selectedProject.complexity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Deadline</p>
                  <p className="font-semibold text-slate-900">{selectedProject.deadline}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="font-semibold text-slate-900">{selectedProject.estimatedDuration}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {assignmentMode === "auto" && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <p className="font-medium text-slate-900">AI Recommendation</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Company B</strong> is the best match (95% compatibility) based on:
                  </p>
                  <ul className="text-sm text-blue-700 mt-1 ml-4 list-disc">
                    <li>Perfect skill alignment</li>
                    <li>High success rate (94.2%)</li>
                    <li>Available capacity</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Company Rankings */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {companies
              .sort((a, b) => b.matchScore - a.matchScore)
              .map((company, index) => (
                <div key={company.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{company.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-slate-600">{company.rating}</span>
                        </div>
                        <span className="text-sm text-slate-400">•</span>
                        <span className="text-sm text-slate-600">{company.teamSize} developers</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getMatchScoreColor(company.matchScore)}`}
                      >
                        {company.matchScore}% match
                      </div>
                      {index === 0 && assignmentMode === "auto" && (
                        <Badge className="mt-1 bg-green-100 text-green-800">Recommended</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Workload</span>
                      <span className={`font-medium ${getWorkloadColor(company.currentWorkload)}`}>
                        {company.currentWorkload}%
                      </span>
                    </div>
                    <Progress value={company.currentWorkload} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-slate-500">Success Rate</p>
                      <p className="font-medium text-slate-900">{company.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Avg Delivery</p>
                      <p className="font-medium text-slate-900">{company.avgDeliveryTime}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-1">Specialties</p>
                    <div className="flex flex-wrap gap-1">
                      {company.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {company.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{company.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={index === 0 && assignmentMode === "auto" ? "default" : "outline"}
                    size="sm"
                  >
                    {index === 0 && assignmentMode === "auto" ? "Auto Assign" : "Assign Project"}
                  </Button>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
