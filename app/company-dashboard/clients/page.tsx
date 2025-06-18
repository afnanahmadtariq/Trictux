"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Send,
  Search,
  Video,
  FileText,
  Clock,
  CheckCircle,
  Building,
} from "lucide-react"

const clients = [
  {
    id: "CLI-001",
    name: "TechCorp Inc.",
    contact: "John Smith",
    email: "john.smith@techcorp.com",
    phone: "+1 (555) 123-4567",
    projects: [
      {
        id: "PRJ-001",
        name: "E-commerce Platform Redesign",
        status: "In Progress",
        progress: 65,
        nextMilestone: "Frontend Components",
        dueDate: "2024-02-25",
      },
    ],
    lastContact: "2024-01-18",
    relationship: "Excellent",
    totalValue: 85000,
    industry: "Technology",
    location: "San Francisco, CA",
  },
  {
    id: "CLI-004",
    name: "RetailMax",
    contact: "Emma Wilson",
    email: "tech@retailmax.com",
    phone: "+1 (555) 321-0987",
    projects: [
      {
        id: "PRJ-004",
        name: "Inventory Management System",
        status: "Testing",
        progress: 95,
        nextMilestone: "Production Release",
        dueDate: "2024-01-25",
      },
    ],
    lastContact: "2024-01-16",
    relationship: "Good",
    totalValue: 65000,
    industry: "Retail",
    location: "Chicago, IL",
  },
  {
    id: "CLI-005",
    name: "ServiceHub",
    contact: "David Park",
    email: "dev@servicehub.com",
    phone: "+1 (555) 654-3210",
    projects: [
      {
        id: "PRJ-007",
        name: "Customer Portal Development",
        status: "Planning",
        progress: 15,
        nextMilestone: "Requirements Analysis",
        dueDate: "2024-02-10",
      },
    ],
    lastContact: "2024-01-20",
    relationship: "New",
    totalValue: 45000,
    industry: "Services",
    location: "Austin, TX",
  },
]

const communicationHistory = [
  {
    id: 1,
    client: "TechCorp Inc.",
    type: "email",
    subject: "Project Update - Frontend Components",
    date: "2024-01-18",
    status: "sent",
    content: "Weekly progress update on the e-commerce platform redesign project.",
  },
  {
    id: 2,
    client: "RetailMax",
    type: "call",
    subject: "Testing Phase Discussion",
    date: "2024-01-16",
    status: "completed",
    content: "Discussed testing requirements and deployment timeline.",
  },
  {
    id: 3,
    client: "ServiceHub",
    type: "meeting",
    subject: "Project Kickoff Meeting",
    date: "2024-01-20",
    status: "completed",
    content: "Initial project requirements and timeline discussion.",
  },
]

export default function ClientCommunicationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [newMessage, setNewMessage] = useState({
    subject: "",
    content: "",
    type: "email",
  })

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case "Excellent":
        return "text-green-600 bg-green-50"
      case "Good":
        return "text-blue-600 bg-blue-50"
      case "New":
        return "text-purple-600 bg-purple-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "Testing":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Planning":
        return <FileText className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-slate-600" />
    }
  }

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4 text-blue-600" />
      case "call":
        return <Phone className="h-4 w-4 text-green-600" />
      case "meeting":
        return <Video className="h-4 w-4 text-purple-600" />
      default:
        return <MessageSquare className="h-4 w-4 text-slate-600" />
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Client Communication</h1>
              <p className="text-slate-600 mt-1">Manage client relationships and project communications</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Meeting
              </Button>
              <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Send Message
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Send Message to Client</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="client">Client</Label>
                      <select
                        className="w-full p-2 border border-slate-200 rounded-md"
                        value={selectedClient || ""}
                        onChange={(e) => setSelectedClient(e.target.value)}
                      >
                        <option value="">Select a client</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name} - {client.contact}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={newMessage.subject}
                        onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                        placeholder="Enter message subject"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Message</Label>
                      <Textarea
                        id="content"
                        value={newMessage.content}
                        onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                        placeholder="Type your message..."
                        rows={6}
                      />
                    </div>
                    <Button className="w-full gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
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
          {/* Search */}
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="clients" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="clients">Client Overview</TabsTrigger>
              <TabsTrigger value="communication">Communication History</TabsTrigger>
            </TabsList>

            <TabsContent value="clients" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredClients.map((client) => (
                  <Card key={client.id} className="border-slate-200 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-50">
                            <Building className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{client.name}</CardTitle>
                            <p className="text-sm text-slate-600">{client.contact}</p>
                            <p className="text-sm text-slate-500">
                              {client.industry} • {client.location}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(client.relationship)}`}
                        >
                          {client.relationship}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="h-4 w-4" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="h-4 w-4" />
                          {client.phone}
                        </div>
                      </div>

                      {/* Current Projects */}
                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-sm text-slate-600 mb-2">Current Projects</p>
                        <div className="space-y-2">
                          {client.projects.map((project) => (
                            <div key={project.id} className="p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(project.status)}
                                  <span className="font-medium text-slate-900">{project.name}</span>
                                </div>
                                <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                                  {project.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="text-slate-600">Progress</p>
                                  <p className="font-medium text-slate-900">{project.progress}%</p>
                                </div>
                                <div>
                                  <p className="text-slate-600">Next Milestone</p>
                                  <p className="font-medium text-slate-900">{project.dueDate}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Project Stats */}
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                        <div>
                          <p className="text-sm text-slate-600">Total Value</p>
                          <p className="text-lg font-bold text-slate-900">${(client.totalValue / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Last Contact</p>
                          <p className="text-lg font-bold text-slate-900">{client.lastContact}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-slate-200">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => {
                            setSelectedClient(client.id)
                            setMessageDialogOpen(true)
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Phone className="h-4 w-4" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Calendar className="h-4 w-4" />
                          Meeting
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="communication" className="space-y-4">
              {communicationHistory.map((comm) => (
                <Card key={comm.id} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getCommunicationIcon(comm.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-slate-900">{comm.subject}</h3>
                            <Badge variant="outline" className="text-xs">
                              {comm.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">{comm.client}</p>
                          <p className="text-sm text-slate-500">{comm.content}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{comm.date}</p>
                        <Badge variant={comm.status === "completed" ? "default" : "secondary"} className="text-xs">
                          {comm.status}
                        </Badge>
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
