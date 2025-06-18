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
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

const projects = [
  {
    id: "PRJ-001",
    name: "E-commerce Platform Redesign",
    description: "Complete redesign of the e-commerce platform with modern UI/UX",
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
    progress: 65,
    budget: 85000,
    spent: 55250,
    startDate: "2024-01-10",
    endDate: "2024-03-15",
    teamLead: "Sarah Johnson",
    teamSize: 5,
    milestones: 4,
    completedMilestones: 2,
    nextMilestone: "Frontend Components",
    risk: "Low",
    tags: ["React", "Node.js", "E-commerce"],
  },
  {
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
    progress: 85,
    budget: 120000,
    spent: 102000,
    startDate: "2023-11-15",
    endDate: "2024-02-28",
    teamLead: "Mike Chen",
    teamSize: 7,
    milestones: 5,
    completedMilestones: 4,
    nextMilestone: "Security Audit",
    risk: "Medium",
    tags: ["React Native", "Node.js", "Security"],
  },
  {
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
    phase: "Design",
    progress: 25,
    budget: 45000,
    spent: 11250,
    startDate: "2024-01-05",
    endDate: "2024-04-10",
    teamLead: "Alex Rodriguez",
    teamSize: 3,
    milestones: 3,
    completedMilestones: 0,
    nextMilestone: "API Design",
    risk: "High",
    tags: ["AI", "Python", "APIs"],
  },
  {
    id: "PRJ-004",
    name: "Inventory Management System",
    description: "Real-time inventory tracking and management system",
    client: {
      id: "CLI-004",
      name: "RetailMax",
    },
    company: {
      id: "COMP-B",
      name: "Company B",
    },
    status: "Deploying",
    priority: "High",
    phase: "Deployment",
    progress: 95,
    budget: 65000,
    spent: 61750,
    startDate: "2023-12-01",
    endDate: "2024-01-25",
    teamLead: "Emma Wilson",
    teamSize: 4,
    milestones: 4,
    completedMilestones: 4,
    nextMilestone: "Production Release",
    risk: "Low",
    tags: ["Vue.js", "MySQL", "Real-time"],
  },
]

export default function ProjectsPage() {
  const searchParams = useSearchParams()
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

  const statuses = ["All", "Planning", "In Progress", "Testing", "Blocked", "Deploying", "Completed"]
  const priorities = ["All", "Critical", "High", "Medium", "Low"]
  const risks = ["All", "Low", "Medium", "High"]
  
  // Extract unique companies and clients from projects
  const companies = ["All", ...Array.from(new Set(projects.map(p => p.company.name)))]
  const clients = ["All", ...Array.from(new Set(projects.map(p => p.client.name)))]

  // Handle URL parameters for pre-filtering
  useEffect(() => {
    const companyParam = searchParams.get('company')
    const clientParam = searchParams.get('client')
    
    if (companyParam) {
      // Find the company name by ID
      const company = projects.find(p => p.company.id === companyParam)
      if (company) {
        setSelectedCompany(company.company.name)
      }
    }
    
    if (clientParam) {
      // Find the client name by ID
      const client = projects.find(p => p.client.id === clientParam)
      if (client) {
        setSelectedClient(client.client.name)
      }
    }
  }, [searchParams])

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

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.company.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus
    const matchesPriority = selectedPriority === "All" || project.priority === selectedPriority
    
    // Advanced filters
    const matchesCompany = selectedCompany === "All" || project.company.name === selectedCompany
    const matchesClient = selectedClient === "All" || project.client.name === selectedClient
    const matchesRisk = selectedRisk === "All" || project.risk === selectedRisk
    const matchesBudget = project.budget >= budgetRange[0] && project.budget <= budgetRange[1]
    const matchesProgress = project.progress >= progressRange[0] && project.progress <= progressRange[1]
    const matchesTeamSize = project.teamSize >= teamSizeRange[0] && project.teamSize <= teamSizeRange[1]
    
    // Date filters
    const projectStartDate = new Date(project.startDate)
    const projectEndDate = new Date(project.endDate)
    const matchesStartDateFrom = !startDateFrom || projectStartDate >= new Date(startDateFrom)
    const matchesStartDateTo = !startDateTo || projectStartDate <= new Date(startDateTo)
    const matchesEndDateFrom = !endDateFrom || projectEndDate >= new Date(endDateFrom)
    const matchesEndDateTo = !endDateTo || projectEndDate <= new Date(endDateTo)
    
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

  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0)
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0)
  const totalMilestones = projects.reduce((sum, project) => sum + project.milestones, 0)
  const completedMilestones = projects.reduce((sum, project) => sum + project.completedMilestones, 0)

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
                    <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
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
                      {completedMilestones}/{totalMilestones}
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
                    <p className="text-2xl font-bold text-slate-900">${(totalBudget / 1000).toFixed(0)}K</p>
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
                      {projects.reduce((sum, project) => sum + project.teamSize, 0)}
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
                Showing <span className="font-medium">{filteredProjects.length}</span> of <span className="font-medium">{projects.length}</span> projects
              </div>
              {filteredProjects.length === 0 && (
                <Button variant="outline" size="sm" onClick={clearAdvancedFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.length === 0 ? (
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
              filteredProjects.map((project) => (
              <Card key={project.id} className="border-slate-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(project.status)}
                        <CardTitle className="text-lg">
                          <Link href={`/projects/${project.id}`} className="hover:text-blue-600 transition-colors">
                            {project.name}
                          </Link>
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
                          {project.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <Link href={`/clients/${project.client.id}`} className="hover:text-blue-600 transition-colors">
                          {project.client.name}
                        </Link>
                        <span>•</span>
                        <Link
                          href={`/companies/${project.company.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {project.company.name}
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={project.status === "Blocked" ? "destructive" : "default"}>{project.status}</Badge>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(project.risk)}`}>
                        {project.risk} Risk
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/projects/${project.id}`} className="gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/projects/${project.id}/edit`} className="gap-2">
                              <Edit className="h-4 w-4" />
                              Edit Project
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-200">
                    <div>
                      <p className="text-sm text-slate-600">Budget</p>
                      <p className="font-semibold text-slate-900">${(project.budget / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Spent</p>
                      <p className="font-semibold text-slate-900">${(project.spent / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Team Size</p>
                      <p className="font-semibold text-slate-900">{project.teamSize} members</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Milestones</p>
                      <p className="font-semibold text-slate-900">
                        {project.completedMilestones}/{project.milestones}
                      </p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center justify-between text-sm text-slate-600 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {project.startDate} - {project.endDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {project.teamLead}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <Link href={`/projects/${project.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                    <Button size="sm" className="flex-1 gap-2">
                      <Building2 className="h-4 w-4" />
                      Contact Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
