"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  MessageSquare,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Target,
  CheckCircle,
} from "lucide-react"

const teamMembers = [
  {
    id: "sarah.johnson",
    name: "Sarah Johnson",
    role: "Project Lead",
    email: "sarah@companyb.com",
    phone: "+1 (555) 123-4567",
    skills: ["Project Management", "React", "Node.js", "Team Leadership"],
    currentTasks: 3,
    completedTasks: 12,
    availability: "Available",
    joinDate: "2022-01-15",
    performance: 95,
    projects: ["E-commerce Platform Redesign", "Customer Portal Development"],
  },
  {
    id: "mike.davis",
    name: "Mike Davis",
    role: "Frontend Developer",
    email: "mike@companyb.com",
    phone: "+1 (555) 234-5678",
    skills: ["React", "TypeScript", "CSS", "JavaScript", "UI/UX"],
    currentTasks: 2,
    completedTasks: 8,
    availability: "Busy",
    joinDate: "2022-03-20",
    performance: 88,
    projects: ["E-commerce Platform Redesign"],
  },
  {
    id: "lisa.chen",
    name: "Lisa Chen",
    role: "Backend Developer",
    email: "lisa@companyb.com",
    phone: "+1 (555) 345-6789",
    skills: ["Node.js", "PostgreSQL", "APIs", "Python", "Docker"],
    currentTasks: 1,
    completedTasks: 10,
    availability: "Available",
    joinDate: "2022-02-10",
    performance: 92,
    projects: ["E-commerce Platform Redesign", "Inventory Management System"],
  },
  {
    id: "tom.wilson",
    name: "Tom Wilson",
    role: "UI/UX Designer",
    email: "tom@companyb.com",
    phone: "+1 (555) 456-7890",
    skills: ["Figma", "UI Design", "UX Research", "Prototyping", "Design Systems"],
    currentTasks: 2,
    completedTasks: 6,
    availability: "Available",
    joinDate: "2022-05-01",
    performance: 90,
    projects: ["E-commerce Platform Redesign", "Customer Portal Development"],
  },
  {
    id: "anna.rodriguez",
    name: "Anna Rodriguez",
    role: "QA Engineer",
    email: "anna@companyb.com",
    phone: "+1 (555) 567-8901",
    skills: ["Testing", "Automation", "Quality Assurance", "Selenium", "Jest"],
    currentTasks: 1,
    completedTasks: 9,
    availability: "Available",
    joinDate: "2022-04-15",
    performance: 87,
    projects: ["Inventory Management System"],
  },
]

export default function TeamManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("All")
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    skills: "",
  })

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "All" || member.role === selectedRole
    return matchesSearch && matchesRole
  })

  const roles = ["All", ...Array.from(new Set(teamMembers.map((member) => member.role)))]
  const totalTasks = teamMembers.reduce((sum, member) => sum + member.currentTasks, 0)
  const availableMembers = teamMembers.filter((member) => member.availability === "Available").length

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "text-green-600 bg-green-50"
      case "Busy":
        return "text-yellow-600 bg-yellow-50"
      case "Unavailable":
        return "text-red-600 bg-red-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-green-600"
    if (performance >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
              <p className="text-slate-600 mt-1">Manage your team members and their assignments</p>
            </div>
            <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newMember.role}
                        onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                          <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                          <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                          <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                          <SelectItem value="Project Lead">Project Lead</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newMember.phone}
                        onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      value={newMember.skills}
                      onChange={(e) => setNewMember({ ...newMember, skills: e.target.value })}
                      placeholder="React, Node.js, TypeScript..."
                    />
                  </div>
                  <Button className="w-full">Add Team Member</Button>
                </div>
              </DialogContent>
            </Dialog>
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
                    <Users className="h-6 w-6 text-blue-600" />
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
                  <div className="p-3 rounded-xl bg-green-50">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{availableMembers}</p>
                    <p className="text-sm text-slate-600">Available</p>
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
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {Math.round(
                        teamMembers.reduce((sum, member) => sum + member.performance, 0) / teamMembers.length,
                      )}
                      %
                    </p>
                    <p className="text-sm text-slate-600">Avg Performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  {roles.map((role) => (
                    <Button
                      key={role}
                      variant={selectedRole === role ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRole(role)}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="border-slate-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <p className="text-sm text-slate-600">{member.role}</p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(member.availability)}`}
                    >
                      {member.availability}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4" />
                      {member.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4" />
                      {member.phone}
                    </div>
                  </div>

                  {/* Performance & Tasks */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-200">
                    <div>
                      <p className="text-sm text-slate-600">Performance</p>
                      <p className={`text-lg font-bold ${getPerformanceColor(member.performance)}`}>
                        {member.performance}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Active Tasks</p>
                      <p className="text-lg font-bold text-slate-900">{member.currentTasks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Completed</p>
                      <p className="text-lg font-bold text-slate-900">{member.completedTasks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Join Date</p>
                      <p className="text-sm font-medium text-slate-900">{member.joinDate}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {member.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Current Projects */}
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">Current Projects</p>
                    <div className="space-y-1">
                      {member.projects.map((project) => (
                        <p key={project} className="text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          {project}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      Remove
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
