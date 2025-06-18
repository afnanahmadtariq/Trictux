"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Save,
  X,
  Calendar as CalendarIcon,
  DollarSign,
  Users,
  FolderKanban,
  Tag,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Mock data - in real app, this would come from API
const projectsData = {
  "PRJ-001": {
    id: "PRJ-001",
    name: "E-commerce Platform Redesign",
    description: "Complete redesign of the e-commerce platform with modern UI/UX and improved performance",
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
    budget: 85000,
    startDate: "2024-01-10",
    endDate: "2024-03-15",
    teamLead: "Sarah Johnson",
    teamSize: 5,
    tags: ["React", "Node.js", "E-commerce", "UI/UX"],
  },
  "PRJ-002": {
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
    budget: 120000,
    startDate: "2023-11-15",
    endDate: "2024-02-28",
    teamLead: "Mike Chen",
    teamSize: 7,
    tags: ["React Native", "Node.js", "Security"],
  },
  "PRJ-003": {
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
    phase: "Planning",
    budget: 45000,
    startDate: "2024-01-20",
    endDate: "2024-04-10",
    teamLead: "Alex Williams",
    teamSize: 4,
    tags: ["AI", "Python", "NLP"],
  },
}

const clients = [
  { id: "CLI-001", name: "TechCorp Inc." },
  { id: "CLI-002", name: "FinanceFirst" },
  { id: "CLI-003", name: "ServicePro" },
  { id: "CLI-004", name: "RetailMax" },
]

const companies = [
  { id: "COMP-A", name: "Company A" },
  { id: "COMP-B", name: "Company B" },
  { id: "COMP-C", name: "Company C" },
  { id: "COMP-D", name: "Company D" },
]

const statusOptions = ["Planning", "In Progress", "Testing", "On Hold", "Completed", "Blocked"]
const priorityOptions = ["Low", "Medium", "High", "Critical"]
const phaseOptions = ["Planning", "Design", "Development", "Testing", "Deployment", "Maintenance"]

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [newTag, setNewTag] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientId: "",
    companyId: "",
    status: "",
    priority: "",
    phase: "",
    budget: "",
    teamLead: "",
    teamSize: "",
    tags: [] as string[],
  })

  useEffect(() => {
    // Load project data
    const project = projectsData[projectId as keyof typeof projectsData]
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        clientId: project.client.id,
        companyId: project.company.id,
        status: project.status,
        priority: project.priority,
        phase: project.phase,
        budget: project.budget.toString(),
        teamLead: project.teamLead,
        teamSize: project.teamSize.toString(),
        tags: project.tags,
      })
      setStartDate(new Date(project.startDate))
      setEndDate(new Date(project.endDate))
    }
  }, [projectId])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Here you would make an API call to update the project
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast.success("Project updated successfully!")
      router.push(`/projects/${projectId}`)
    } catch (error) {
      toast.error("Failed to update project. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const project = projectsData[projectId as keyof typeof projectsData]

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/projects/${projectId}`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Project
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Edit Project</h1>
                <p className="text-slate-600 mt-1">Update project details and settings</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/projects/${projectId}`}>
                <Button variant="outline" className="gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </Link>
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Save className="h-4 w-4" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="assignment">Assignment & Team</TabsTrigger>
              <TabsTrigger value="schedule">Schedule & Budget</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderKanban className="h-5 w-5" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Project Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter project name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Enter project description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityOptions.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phase">Phase</Label>
                      <Select value={formData.phase} onValueChange={(value) => handleInputChange("phase", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>
                        <SelectContent>
                          {phaseOptions.map((phase) => (
                            <SelectItem key={phase} value={phase}>
                              {phase}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:bg-slate-300 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assignment & Team Tab */}
            <TabsContent value="assignment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Client & Company Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client">Client</Label>
                      <Select value={formData.clientId} onValueChange={(value) => handleInputChange("clientId", value)}>
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
                    <div className="space-y-2">
                      <Label htmlFor="company">Assigned Company</Label>
                      <Select value={formData.companyId} onValueChange={(value) => handleInputChange("companyId", value)}>
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
                    <div className="space-y-2">
                      <Label htmlFor="teamLead">Team Lead</Label>
                      <Input
                        id="teamLead"
                        value={formData.teamLead}
                        onChange={(e) => handleInputChange("teamLead", e.target.value)}
                        placeholder="Enter team lead name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teamSize">Team Size</Label>
                      <Input
                        id="teamSize"
                        type="number"
                        value={formData.teamSize}
                        onChange={(e) => handleInputChange("teamSize", e.target.value)}
                        placeholder="Enter team size"
                        min="1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule & Budget Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Schedule & Budget
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Total Budget ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                      placeholder="Enter total budget"
                      min="0"
                    />
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
