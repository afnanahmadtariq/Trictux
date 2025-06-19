"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
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
  X,
  MapPin,
  Target,
  Briefcase,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Project type definition
interface Project {
  id: string
  name: string
  description: string
  client: {
    id: string
    name: string
  }
  company: {
    id: string
    name: string
  }
  status: string
  priority: string
  phase: string
  progress: number
  budget: number
  spent: number
  startDate: string
  endDate: string
  teamLead: string
  teamSize: number
  milestones: number
  completedMilestones: number
  nextMilestone: string
  risk: string
  tags: string[]
  assignedEmployees?: string[]
  createdAt?: string
  updatedAt?: string
}

export default function ProjectsPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // State for projects and loading
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  
  // Advanced filter states
  const [selectedCompany, setSelectedCompany] = useState("All")
  const [selectedClient, setSelectedClient] = useState("All")
  const [selectedRisk, setSelectedRisk] = useState("All")
  const [budgetRange, setBudgetRange] = useState([0, 200000])
  const [progressRange, setProgressRange] = useState([0, 100])
  const [teamSizeRange, setTeamSizeRange] = useState([1, 10])
  const [startDateFrom, setStartDateFrom] = useState("")
  const [startDateTo, setStartDateTo] = useState("")
  const [endDateFrom, setEndDateFrom] = useState("")
  const [endDateTo, setEndDateTo] = useState("")

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<Project>>({})

  const statuses = ["All", "Planning", "In Progress", "Testing", "Blocked", "Deploying", "Completed"]
  const priorities = ["All", "Critical", "High", "Medium", "Low"]
  const risks = ["All", "Low", "Medium", "High"]
  
  // Extract unique companies and clients from projects (with safe array handling)
  const companies = ["All", ...Array.from(new Set((projects || []).map(p => p.company?.name).filter(Boolean)))]
  const clients = ["All", ...Array.from(new Set((projects || []).map(p => p.client?.name).filter(Boolean)))]

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/projects', {
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Failed to load projects')
      setProjects([])
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle project deletion
  const handleDeleteProject = async () => {
    if (!selectedProject) return
    
    try {
      setActionLoading(true)
      
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete project')
      }
      
      // Remove project from local state
      setProjects(projects.filter(p => p.id !== selectedProject.id))
      setDeleteDialogOpen(false)
      setSelectedProject(null)
      
      toast({
        title: "Success",
        description: `Project "${selectedProject.name}" has been permanently deleted from the database.`,
      })
    } catch (error) {
      console.error('Error deleting project:', error)
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Handle project update
  const handleUpdateProject = async () => {
    if (!selectedProject || !editForm) return
    
    try {
      setActionLoading(true)
      
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editForm),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update project')
      }
      
      // Update project in local state
      setProjects(projects.map(p => 
        p.id === selectedProject.id 
          ? { ...p, ...editForm }
          : p
      ))
      
      setEditDialogOpen(false)
      setSelectedProject(null)
      setEditForm({})
      
      toast({
        title: "Success",
        description: `Project "${selectedProject.name}" has been updated successfully.`,
      })
    } catch (error) {
      console.error('Error updating project:', error)
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Handle view project details
  const handleViewProject = (project: Project) => {
    setSelectedProject(project)
    setViewDialogOpen(true)
  }

  // Handle edit project
  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setEditForm({
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      phase: project.phase,
      progress: project.progress,
      budget: project.budget,
      spent: project.spent,
      startDate: project.startDate,
      endDate: project.endDate,
      teamLead: project.teamLead,
      teamSize: project.teamSize,
      milestones: project.milestones,
      completedMilestones: project.completedMilestones,
      nextMilestone: project.nextMilestone,
      risk: project.risk,
      tags: project.tags,
    })
    setEditDialogOpen(true)
  }

  // Handle delete project confirmation
  const handleDeleteProjectConfirm = (project: Project) => {
    setSelectedProject(project)
    setDeleteDialogOpen(true)
  }
  // Load projects on component mount
  useEffect(() => {
    fetchProjects()
  }, [])

  // Handle URL parameters for pre-filtering
  useEffect(() => {
    const companyParam = searchParams.get('company')
    const clientParam = searchParams.get('client')
    
    if (companyParam && projects.length > 0) {
      // Find the company name by ID
      const company = projects.find(p => p.company?.id === companyParam)
      if (company) {
        setSelectedCompany(company.company.name)
      }
    }
    
    if (clientParam && projects.length > 0) {
      // Find the client name by ID
      const client = projects.find(p => p.client?.id === clientParam)
      if (client) {
        setSelectedClient(client.client.name)
      }
    }
  }, [searchParams, projects])

  const clearAdvancedFilters = () => {
    setSelectedCompany("All")
    setSelectedClient("All")
    setSelectedRisk("All")
    setBudgetRange([0, 200000])
    setProgressRange([0, 100])
    setTeamSizeRange([1, 10])
    setStartDateFrom("")
    setStartDateTo("")
    setEndDateFrom("")
    setEndDateTo("")
  }

  const hasActiveAdvancedFilters = () => {
    return selectedCompany !== "All" ||
           selectedClient !== "All" ||
           selectedRisk !== "All" ||
           budgetRange[0] !== 0 ||
           budgetRange[1] !== 200000 ||
           progressRange[0] !== 0 ||
           progressRange[1] !== 100 ||
           teamSizeRange[0] !== 1 ||
           teamSizeRange[1] !== 10 ||
           startDateFrom !== "" ||
           startDateTo !== "" ||
           endDateFrom !== "" ||
           endDateTo !== ""
  }
  const filteredProjects = (projects || []).filter((project) => {
    const matchesSearch =
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus
    const matchesPriority = selectedPriority === "All" || project.priority === selectedPriority
    
    // Advanced filters
    const matchesCompany = selectedCompany === "All" || project.company?.name === selectedCompany
    const matchesClient = selectedClient === "All" || project.client?.name === selectedClient
    const matchesRisk = selectedRisk === "All" || project.risk === selectedRisk
    const matchesBudget = (project.budget || 0) >= budgetRange[0] && (project.budget || 0) <= budgetRange[1]
    const matchesProgress = (project.progress || 0) >= progressRange[0] && (project.progress || 0) <= progressRange[1]
    const matchesTeamSize = (project.teamSize || 1) >= teamSizeRange[0] && (project.teamSize || 1) <= teamSizeRange[1]
    
    // Date filters
    const projectStartDate = project.startDate ? new Date(project.startDate) : null
    const projectEndDate = project.endDate ? new Date(project.endDate) : null
    const matchesStartDateFrom = !startDateFrom || !projectStartDate || projectStartDate >= new Date(startDateFrom)
    const matchesStartDateTo = !startDateTo || !projectStartDate || projectStartDate <= new Date(startDateTo)
    const matchesEndDateFrom = !endDateFrom || !projectEndDate || projectEndDate >= new Date(endDateFrom)
    const matchesEndDateTo = !endDateTo || !projectEndDate || projectEndDate <= new Date(endDateTo)
    
    return matchesSearch && 
           matchesStatus && 
           matchesPriority && 
           matchesCompany && 
           matchesClient && 
           matchesRisk && 
           matchesBudget && 
           matchesProgress && 
           matchesTeamSize && 
           matchesStartDateFrom && 
           matchesStartDateTo && 
           matchesEndDateFrom && 
           matchesEndDateTo
  })

  const totalBudget = (projects || []).reduce((sum, project) => sum + (project.budget || 0), 0)
  const totalSpent = (projects || []).reduce((sum, project) => sum + (project.spent || 0), 0)
  const totalMilestones = (projects || []).reduce((sum, project) => sum + (project.milestones || 0), 0)
  const completedMilestones = (projects || []).reduce((sum, project) => sum + (project.completedMilestones || 0), 0)

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
              <p className="text-slate-600 mt-1">
                Track and manage all projects across your network
              </p>
            </div>
            <div className="flex gap-3">
              <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 relative">
                    <Filter className="h-4 w-4" />
                    Advanced Filters
                    {hasActiveAdvancedFilters() && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-blue-600 text-white text-xs">
                        !
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Advanced Filters
                    </DialogTitle>
                    <DialogDescription>
                      Filter projects by company, budget, dates, and more criteria
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    {/* Company and Client */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem key={company} value={company}>
                                {company}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Client</Label>
                        <Select value={selectedClient} onValueChange={setSelectedClient}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client} value={client}>
                                {client}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Risk Level */}
                    <div className="space-y-2">
                      <Label>Risk Level</Label>
                      <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          {risks.map((risk) => (
                            <SelectItem key={risk} value={risk}>
                              {risk}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Budget Range */}
                    <div className="space-y-3">
                      <Label>Budget Range</Label>
                      <div className="px-2">
                        <Slider
                          value={budgetRange}
                          onValueChange={setBudgetRange}
                          max={200000}
                          step={5000}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-slate-600 mt-1">
                          <span>${budgetRange[0].toLocaleString()}</span>
                          <span>${budgetRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Range */}
                    <div className="space-y-3">
                      <Label>Progress Range (%)</Label>
                      <div className="px-2">
                        <Slider
                          value={progressRange}
                          onValueChange={setProgressRange}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-slate-600 mt-1">
                          <span>{progressRange[0]}%</span>
                          <span>{progressRange[1]}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Team Size Range */}
                    <div className="space-y-3">
                      <Label>Team Size Range</Label>
                      <div className="px-2">
                        <Slider
                          value={teamSizeRange}
                          onValueChange={setTeamSizeRange}
                          min={1}
                          max={20}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-slate-600 mt-1">
                          <span>{teamSizeRange[0]} members</span>
                          <span>{teamSizeRange[1]} members</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Date Filters */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Date Filters</Label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Start Date From</Label>
                          <Input
                            type="date"
                            value={startDateFrom}
                            onChange={(e) => setStartDateFrom(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Start Date To</Label>
                          <Input
                            type="date"
                            value={startDateTo}
                            onChange={(e) => setStartDateTo(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">End Date From</Label>
                          <Input
                            type="date"
                            value={endDateFrom}
                            onChange={(e) => setEndDateFrom(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">End Date To</Label>
                          <Input
                            type="date"
                            value={endDateTo}
                            onChange={(e) => setEndDateTo(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={clearAdvancedFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                    <Button onClick={() => setShowAdvancedFilters(false)}>
                      Apply Filters
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
        <div className="max-w-7xl mx-auto space-y-6">          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-50">
                    <FolderKanban className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {loading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        (projects || []).length
                      )}
                    </p>
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
                      {loading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        `${completedMilestones}/${totalMilestones}`
                      )}
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
                    <p className="text-2xl font-bold text-slate-900">
                      {loading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        `$${(totalBudget / 1000).toFixed(0)}K`
                      )}
                    </p>
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
                      {loading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        (projects || []).reduce((sum, project) => sum + (project.teamSize || 0), 0)
                      )}
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
              
              {/* Active Advanced Filters */}
              {hasActiveAdvancedFilters() && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-slate-600 font-medium">Active filters:</span>
                    {selectedCompany !== "All" && (
                      <Badge variant="secondary" className="gap-1">
                        <Building2 className="h-3 w-3" />
                        {selectedCompany}
                        <button onClick={() => setSelectedCompany("All")} className="ml-1 hover:bg-slate-300 rounded-full">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedClient !== "All" && (
                      <Badge variant="secondary" className="gap-1">
                        <Users className="h-3 w-3" />
                        {selectedClient}
                        <button onClick={() => setSelectedClient("All")} className="ml-1 hover:bg-slate-300 rounded-full">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedRisk !== "All" && (
                      <Badge variant="secondary" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Risk: {selectedRisk}
                        <button onClick={() => setSelectedRisk("All")} className="ml-1 hover:bg-slate-300 rounded-full">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {(budgetRange[0] !== 0 || budgetRange[1] !== 200000) && (
                      <Badge variant="secondary" className="gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${budgetRange[0].toLocaleString()} - ${budgetRange[1].toLocaleString()}
                        <button onClick={() => setBudgetRange([0, 200000])} className="ml-1 hover:bg-slate-300 rounded-full">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {(progressRange[0] !== 0 || progressRange[1] !== 100) && (
                      <Badge variant="secondary" className="gap-1">
                        Progress: {progressRange[0]}% - {progressRange[1]}%
                        <button onClick={() => setProgressRange([0, 100])} className="ml-1 hover:bg-slate-300 rounded-full">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {(teamSizeRange[0] !== 1 || teamSizeRange[1] !== 10) && (
                      <Badge variant="secondary" className="gap-1">
                        <Users className="h-3 w-3" />
                        Team: {teamSizeRange[0]} - {teamSizeRange[1]}
                        <button onClick={() => setTeamSizeRange([1, 10])} className="ml-1 hover:bg-slate-300 rounded-full">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {(startDateFrom || startDateTo) && (
                      <Badge variant="secondary" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        Start: {startDateFrom || '...'} to {startDateTo || '...'}
                        <button onClick={() => { setStartDateFrom(""); setStartDateTo(""); }} className="ml-1 hover:bg-slate-300 rounded-full">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {(endDateFrom || endDateTo) && (
                      <Badge variant="secondary" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        End: {endDateFrom || '...'} to {endDateTo || '...'}
                        <button onClick={() => { setEndDateFrom(""); setEndDateTo(""); }} className="ml-1 hover:bg-slate-300 rounded-full">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAdvancedFilters}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      Clear all
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects Grid */}
          <div className="space-y-4">
            {/* Results count */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing <span className="font-medium">{(filteredProjects || []).length}</span> of <span className="font-medium">{(projects || []).length}</span> projects
              </div>
              {filteredProjects.length === 0 && (
                <Button variant="outline" size="sm" onClick={clearAdvancedFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              )}
            </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              // Loading state
              <div className="col-span-full">
                <Card className="border-slate-200">
                  <CardContent className="p-12 text-center">
                    <Loader2 className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading projects...</h3>
                    <p className="text-slate-600">Please wait while we fetch your projects.</p>
                  </CardContent>
                </Card>
              </div>
            ) : error ? (
              // Error state
              <div className="col-span-full">
                <Card className="border-slate-200">
                  <CardContent className="p-12 text-center">
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Failed to load projects</h3>
                    <p className="text-slate-600 mb-4">{error}</p>
                    <Button onClick={fetchProjects} variant="outline">
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (filteredProjects || []).length === 0 ? (
              // No projects found
              <div className="col-span-full">
                <Card className="border-slate-200">
                  <CardContent className="p-12 text-center">
                    <FolderKanban className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects found</h3>
                    <p className="text-slate-600 mb-4">
                      {hasActiveAdvancedFilters() || selectedStatus !== "All" || selectedPriority !== "All" || searchTerm
                        ? "No projects match your current filters. Try adjusting your search criteria."
                        : "There are no projects to display."}
                    </p>
                    {(hasActiveAdvancedFilters() || selectedStatus !== "All" || selectedPriority !== "All" || searchTerm) && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm("")
                          setSelectedStatus("All")
                          setSelectedPriority("All")
                          clearAdvancedFilters()
                        }}
                      >
                        Clear all filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              (filteredProjects || []).map((project) => (
              <Card key={project.id} className="border-slate-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(project.status || '')}                        <CardTitle className="text-lg">
                          <span className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => handleViewProject(project)}>
                            {project.name || 'Unnamed Project'}
                          </span>
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
                          {project.priority || 'N/A'}
                        </Badge>
                      </div>                      <p className="text-sm text-slate-600 mb-2">{project.description || 'No description provided'}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        {project.client?.id ? (
                          <Link href={`/clients/${project.client.id}`} className="hover:text-blue-600 transition-colors">
                            {project.client.name || 'Unknown Client'}
                          </Link>
                        ) : (
                          <span>{project.client?.name || 'Unknown Client'}</span>
                        )}
                        <span>•</span>
                        {project.company?.id ? (
                          <Link
                            href={`/companies/${project.company.id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {project.company.name || 'Unknown Company'}
                          </Link>
                        ) : (
                          <span>{project.company?.name || 'Unknown Company'}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">                      <Badge variant={project.status === "Blocked" ? "destructive" : "default"}>{project.status || 'N/A'}</Badge>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(project.risk || 'Low')}`}>
                        {project.risk || 'Low'} Risk
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProject(project)} className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditProject(project)} className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProjectConfirm(project)} 
                            className="gap-2 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-medium text-slate-900">{project.progress || 0}%</span>
                    </div>
                    <Progress value={project.progress || 0} className="h-2" />
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-200">
                    <div>
                      <p className="text-sm text-slate-600">Budget</p>
                      <p className="font-semibold text-slate-900">${((project.budget || 0) / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Spent</p>
                      <p className="font-semibold text-slate-900">${((project.spent || 0) / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Team Size</p>
                      <p className="font-semibold text-slate-900">{project.teamSize || 1} members</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Milestones</p>
                      <p className="font-semibold text-slate-900">
                        {project.completedMilestones || 0}/{project.milestones || 0}
                      </p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center justify-between text-sm text-slate-600 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {project.startDate || 'N/A'} - {project.endDate || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {project.teamLead || 'Unassigned'}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {(project.tags || []).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => handleViewProject(project)}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>          </div>
        </div>
      </div>

      {/* View Project Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Project Details
            </DialogTitle>
            <DialogDescription>
              View detailed information about this project
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Project Name</Label>
                  <p className="text-sm text-slate-900">{selectedProject.name || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={selectedProject.status === "Blocked" ? "destructive" : "default"}>
                    {selectedProject.status || 'N/A'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-slate-600">{selectedProject.description || 'No description provided'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Client</Label>
                  <p className="text-sm text-slate-900">{selectedProject.client?.name || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Company</Label>
                  <p className="text-sm text-slate-900">{selectedProject.company?.name || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge variant={
                    selectedProject.priority === "Critical" ? "destructive" :
                    selectedProject.priority === "High" ? "default" : "secondary"
                  }>
                    {selectedProject.priority || 'N/A'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Phase</Label>
                  <p className="text-sm text-slate-900">{selectedProject.phase || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Risk Level</Label>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(selectedProject.risk || 'Low')}`}>
                    {selectedProject.risk || 'N/A'} Risk
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Progress</Label>
                <div className="space-y-2">
                  <Progress value={selectedProject.progress || 0} className="h-2" />
                  <p className="text-sm text-slate-600">{selectedProject.progress || 0}% Complete</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Budget</Label>
                  <p className="text-sm text-slate-900">${(selectedProject.budget || 0).toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Spent</Label>
                  <p className="text-sm text-slate-900">${(selectedProject.spent || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p className="text-sm text-slate-900">{selectedProject.startDate || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">End Date</Label>
                  <p className="text-sm text-slate-900">{selectedProject.endDate || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Team Lead</Label>
                  <p className="text-sm text-slate-900">{selectedProject.teamLead || 'Unassigned'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Team Size</Label>
                  <p className="text-sm text-slate-900">{selectedProject.teamSize || 1} members</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Milestones</Label>
                  <p className="text-sm text-slate-900">{selectedProject.completedMilestones || 0}/{selectedProject.milestones || 0}</p>
                </div>
              </div>

              {selectedProject.nextMilestone && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Next Milestone</Label>
                  <p className="text-sm text-slate-900">{selectedProject.nextMilestone}</p>
                </div>
              )}

              {(selectedProject.tags || []).length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-1">
                    {(selectedProject.tags || []).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Project
            </DialogTitle>
            <DialogDescription>
              Update project information and details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={editForm.status || ''} 
                  onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.filter(s => s !== "All").map((status) => (
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
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Enter project description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={editForm.priority || ''} 
                  onValueChange={(value) => setEditForm({ ...editForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.filter(p => p !== "All").map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phase">Phase</Label>
                <Input
                  id="phase"
                  value={editForm.phase || ''}
                  onChange={(e) => setEditForm({ ...editForm, phase: e.target.value })}
                  placeholder="Enter project phase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk">Risk Level</Label>
                <Select 
                  value={editForm.risk || ''} 
                  onValueChange={(value) => setEditForm({ ...editForm, risk: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    {risks.filter(r => r !== "All").map((risk) => (
                      <SelectItem key={risk} value={risk}>
                        {risk}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <div className="px-2">
                <Slider
                  value={[editForm.progress || 0]}
                  onValueChange={(value) => setEditForm({ ...editForm, progress: value[0] })}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-600 mt-1">
                  <span>0%</span>
                  <span>{editForm.progress || 0}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={editForm.budget || ''}
                  onChange={(e) => setEditForm({ ...editForm, budget: parseInt(e.target.value) || 0 })}
                  placeholder="Enter budget amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spent">Spent ($)</Label>
                <Input
                  id="spent"
                  type="number"
                  value={editForm.spent || ''}
                  onChange={(e) => setEditForm({ ...editForm, spent: parseInt(e.target.value) || 0 })}
                  placeholder="Enter spent amount"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={editForm.startDate || ''}
                  onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={editForm.endDate || ''}
                  onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamLead">Team Lead</Label>
                <Input
                  id="teamLead"
                  value={editForm.teamLead || ''}
                  onChange={(e) => setEditForm({ ...editForm, teamLead: e.target.value })}
                  placeholder="Enter team lead name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  type="number"
                  min="1"
                  value={editForm.teamSize || ''}
                  onChange={(e) => setEditForm({ ...editForm, teamSize: parseInt(e.target.value) || 1 })}
                  placeholder="Enter team size"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="milestones">Total Milestones</Label>
                <Input
                  id="milestones"
                  type="number"
                  min="0"
                  value={editForm.milestones || ''}
                  onChange={(e) => setEditForm({ ...editForm, milestones: parseInt(e.target.value) || 0 })}
                  placeholder="Enter milestone count"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="completedMilestones">Completed Milestones</Label>
                <Input
                  id="completedMilestones"
                  type="number"
                  min="0"
                  max={editForm.milestones || 0}
                  value={editForm.completedMilestones || ''}
                  onChange={(e) => setEditForm({ ...editForm, completedMilestones: parseInt(e.target.value) || 0 })}
                  placeholder="Enter completed milestones"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextMilestone">Next Milestone</Label>
                <Input
                  id="nextMilestone"
                  value={editForm.nextMilestone || ''}
                  onChange={(e) => setEditForm({ ...editForm, nextMilestone: e.target.value })}
                  placeholder="Enter next milestone"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProject}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Project'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Permanently Delete Project
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The project "{selectedProject?.name}" will be permanently deleted from the database.
              <br /><br />
              <strong>Warning:</strong> This is a permanent deletion and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Permanently Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
