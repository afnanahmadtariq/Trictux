"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Plus,
  Search,
  Star,
  Building,
  Phone,
  Mail,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  FolderKanban,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const clients = [
  {
    id: "CLI-001",
    name: "TechCorp Inc.",
    industry: "Technology",
    priority: "High",
    projects: 8,
    activeProjects: 3,
    totalValue: 450000,
    lastContact: "2024-01-15",
    satisfaction: 4.8,
    status: "Active",
    contact: {
      email: "contact@techcorp.com",
      phone: "+1 (555) 123-4567",
      person: "John Smith",
    },
    location: "San Francisco, CA",
    joinDate: "2022-03-15",
  },
  {
    id: "CLI-002",
    name: "FinanceFirst",
    industry: "Finance",
    priority: "Critical",
    projects: 12,
    activeProjects: 5,
    totalValue: 780000,
    lastContact: "2024-01-18",
    satisfaction: 4.9,
    status: "Active",
    contact: {
      email: "projects@financefirst.com",
      phone: "+1 (555) 987-6543",
      person: "Sarah Johnson",
    },
    location: "New York, NY",
    joinDate: "2021-08-22",
  },
  {
    id: "CLI-003",
    name: "ServicePro",
    industry: "Services",
    priority: "Medium",
    projects: 6,
    activeProjects: 2,
    totalValue: 320000,
    lastContact: "2024-01-12",
    satisfaction: 4.6,
    status: "Active",
    contact: {
      email: "hello@servicepro.com",
      phone: "+1 (555) 456-7890",
      person: "Mike Chen",
    },
    location: "Austin, TX",
    joinDate: "2023-01-10",
  },
  {
    id: "CLI-004",
    name: "RetailMax",
    industry: "Retail",
    priority: "High",
    projects: 4,
    activeProjects: 1,
    totalValue: 180000,
    lastContact: "2024-01-16",
    satisfaction: 4.7,
    status: "Active",
    contact: {
      email: "tech@retailmax.com",
      phone: "+1 (555) 321-0987",
      person: "Emma Wilson",
    },
    location: "Chicago, IL",
    joinDate: "2023-06-05",
  },
]

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [clientDialogOpen, setClientDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [clientList, setClientList] = useState(clients)
  const { toast } = useToast()

  // Fetch clients from the database on page load
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/clients')
        const data = await response.json()
        
        if (response.ok && data.clients) {
          // If we have clients from the API, use them
          if (data.clients.length > 0) {
            setClientList(data.clients)
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch clients. Using demo data.",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
        toast({
          title: "Error",
          description: "Failed to fetch clients. Using demo data.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [])

  const [newClient, setNewClient] = useState({
    name: "",
    industry: "",
    priority: "Medium",
    email: "",
    password: "",
    phone: "",
    location: "",
    notes: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewClient({
      ...newClient,
      [name]: value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewClient({
      ...newClient,
      [name]: value
    })
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!newClient.name || !newClient.industry || !newClient.email || !newClient.password) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive"
      })
      return
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    if (!passwordRegex.test(newClient.password)) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      // Save client to database via API
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Client added",
          description: `${newClient.name} has been added successfully.`
        })
        
        // Add the new client to the list without needing a full page refresh
        setClientList([...clientList, data.client])
        
        // Close the dialog and reset form
        setClientDialogOpen(false)
        setNewClient({
          name: "",
          industry: "",
          priority: "Medium",
          email: "",
          password: "",
          phone: "",
          location: "",
          notes: ""
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add client. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
      console.error("Error adding client:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredClients = clientList.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = selectedPriority === "All" || client.priority === selectedPriority
    return matchesSearch && matchesPriority
  })

  const totalValue = clientList.reduce((sum, client) => sum + client.totalValue, 0)
  const avgSatisfaction = clientList.reduce((sum, client) => sum + client.satisfaction, 0) / clientList.length
  const totalActiveProjects = clientList.reduce((sum, client) => sum + client.activeProjects, 0)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Client Management</h1>
              <p className="text-slate-600 mt-1">Manage relationships and track project history</p>
            </div>
            <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600">
                  <Plus className="h-4 w-4" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleAddClient}>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Add New Client
                    </DialogTitle>
                    <DialogDescription>
                      Add a new client to your management system. Fill in the details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Client Name <span className="text-red-500">*</span></Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={newClient.name}
                          onChange={handleInputChange}
                          placeholder="Enter client name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry <span className="text-red-500">*</span></Label>
                        <Input 
                          id="industry" 
                          name="industry" 
                          value={newClient.industry}
                          onChange={handleInputChange}
                          placeholder="Enter industry"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={newClient.priority} 
                        onValueChange={(value) => handleSelectChange("priority", value)}
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email" 
                          value={newClient.email}
                          onChange={handleInputChange}
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                        <Input 
                          id="password" 
                          name="password"
                          type="password"
                          value={newClient.password}
                          onChange={handleInputChange}
                          placeholder="Set login password"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={newClient.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        name="location"
                        value={newClient.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea 
                        id="notes" 
                        name="notes"
                        value={newClient.notes}
                        onChange={handleInputChange}
                        placeholder="Additional information about the client"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setClientDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-blue-500 to-purple-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add Client"}
                    </Button>
                  </DialogFooter>
                </form>
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
                    <p className="text-2xl font-bold text-slate-900">{clientList.length}</p>
                    <p className="text-sm text-slate-600">Total Clients</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-50">
                    <FolderKanban className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{totalActiveProjects}</p>
                    <p className="text-sm text-slate-600">Active Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-50">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">${(totalValue / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-slate-600">Total Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-yellow-50">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{avgSatisfaction.toFixed(1)}</p>
                    <p className="text-sm text-slate-600">Avg Satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["All", "Critical", "High", "Medium", "Low"].map((priority) => (
                      <Button
                        key={priority}
                        variant={selectedPriority === priority ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPriority(priority)}
                      >
                        {priority}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client List */}
          {isLoading ? (
            <div className="flex justify-center items-center p-12 bg-white border border-slate-200 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                <p className="text-slate-600">Loading clients...</p>
              </div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white border border-slate-200 rounded-lg text-center">
              <Users className="h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">No clients found</h3>
              <p className="text-slate-600 mb-6 max-w-md">
                {searchTerm || selectedPriority !== "All"
                  ? "Try adjusting your search or filter criteria."
                  : "You haven't added any clients yet. Click the 'Add Client' button to get started."}
              </p>
              <Button 
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                onClick={() => setClientDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Client
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
              <Card key={client.id} className="border-slate-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <Badge
                          variant={
                            client.priority === "Critical"
                              ? "destructive"
                              : client.priority === "High"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {client.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        {client.industry} • {client.location}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Client
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4" />
                      {client.contact.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4" />
                      {client.contact.phone}
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-200">
                    <div>
                      <p className="text-sm text-slate-600">Total Projects</p>
                      <p className="text-xl font-bold text-slate-900">{client.projects}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Active</p>
                      <p className="text-xl font-bold text-slate-900">{client.activeProjects}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Value</p>
                      <p className="text-xl font-bold text-slate-900">${(client.totalValue / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Satisfaction</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <p className="text-xl font-bold text-slate-900">{client.satisfaction}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Link href={`/projects?client=${client.id}`} className="flex-1">
                      <Button size="sm" className="w-full gap-2">
                        <ArrowUpRight className="h-4 w-4" />
                        Projects ({client.activeProjects})
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
