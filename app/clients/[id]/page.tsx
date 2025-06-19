"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FolderKanban,
  Users,
  TrendingUp,
  Activity,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export default function ClientDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [client, setClient] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [editClient, setEditClient] = useState({
    name: "",
    industry: "",
    priority: "Medium",
    email: "",
    phone: "",
    location: "",
    notes: ""
  })

  useEffect(() => {
    fetchClientDetails()
  }, [params.id])
  const fetchClientDetails = async () => {
    try {
      setIsLoading(true)
      
      // Fetch client details using the specific client endpoint
      const clientResponse = await fetch(`/api/clients/${params.id}`)
      const clientData = await clientResponse.json()
      
      if (clientResponse.ok && clientData.client) {
        setClient(clientData.client)
      } else {
        toast({
          title: "Error",
          description: clientData.error || "Client not found",
          variant: "destructive"
        })
        router.push('/clients')
        return
      }

      // Fetch projects for this client
      const projectsResponse = await fetch('/api/projects')
      const projectsData = await projectsResponse.json()
      
      if (projectsResponse.ok && projectsData.projects) {
        const clientProjects = projectsData.projects.filter((p: any) => 
          p.client?.id === params.id || p.clientId === params.id || 
          p.client?.id === clientData.client.id || p.clientId === clientData.client.id
        )
        setProjects(clientProjects)
      }
    } catch (error) {
      console.error('Error fetching client details:', error)
      toast({
        title: "Error",
        description: "Failed to fetch client details",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClient = () => {
    if (!client) return
    
    setEditClient({
      name: client.name,
      industry: client.industry,
      priority: client.priority,
      email: client.contact?.email || "",
      phone: client.contact?.phone || "",
      location: client.location || "",
      notes: client.notes || ""
    })
    setEditDialogOpen(true)
  }

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editClient.name || !editClient.industry || !editClient.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }    try {
      setIsSubmitting(true)
      
      const response = await fetch(`/api/clients/${(client as any)?._id || client?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editClient.name,
          industry: editClient.industry,
          priority: editClient.priority,
          contact: {
            email: editClient.email,
            phone: editClient.phone,
            person: editClient.name
          },
          location: editClient.location,
          notes: editClient.notes
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Client updated",
          description: `${editClient.name} has been updated successfully.`
        })
        
        // Update the client state
        setClient({
          ...client,
          name: editClient.name,
          industry: editClient.industry,
          priority: editClient.priority,
          contact: {
            ...client.contact,
            email: editClient.email,
            phone: editClient.phone,
            person: editClient.name
          },
          location: editClient.location,
          notes: editClient.notes
        })
        
        setEditDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update client. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
      console.error("Error updating client:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  const handleDeleteClient = async () => {
    if (!client) return

    try {
      setIsSubmitting(true)
      
      const response = await fetch(`/api/clients/${(client as any)?._id || client?.id}`, {
        method: "DELETE",      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Client deleted",
          description: `${client.name} and their user account have been permanently deleted.`
        })
        
        router.push('/clients')
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete client. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
      console.error("Error deleting client:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditClient({
      ...editClient,
      [name]: value
    })
  }

  const handleEditSelectChange = (value: string) => {
    setEditClient({
      ...editClient,
      priority: value
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-slate-600">Loading client details...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Client Not Found</h1>
          <p className="text-slate-600 mb-4">The requested client could not be found.</p>
          <Link href="/clients">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </Button>
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
              <Link href="/clients">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Clients
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
                  <Badge
                    variant={
                      client.priority === "Critical"
                        ? "destructive"
                        : client.priority === "High"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {client.priority} Priority
                  </Badge>
                  <Badge variant="outline" className="text-green-600">
                    {client.status}
                  </Badge>
                </div>
                <p className="text-slate-600">{client.industry} • {client.location}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEditClient}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Client
              </Button>
              <Button 
                variant="outline" 
                className="text-red-600 hover:text-red-700"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-50">
                    <FolderKanban className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{client.projects || 0}</p>
                    <p className="text-sm text-slate-600">Total Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-50">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{client.activeProjects || 0}</p>
                    <p className="text-sm text-slate-600">Active Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-50">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">${(client.totalValue || 0).toLocaleString()}</p>
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
                    <p className="text-2xl font-bold text-slate-900">{client.satisfaction || 0}</p>
                    <p className="text-sm text-slate-600">Satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Email</p>
                        <p className="font-medium">{client.contact?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Phone</p>
                        <p className="font-medium">{client.contact?.phone || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Location</p>
                        <p className="font-medium">{client.location || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Building className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Industry</p>
                        <p className="font-medium">{client.industry}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Join Date</p>
                        <p className="font-medium">{client.joinDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Last Contact</p>
                        <p className="font-medium">{client.lastContact}</p>
                      </div>
                    </div>
                    {client.notes && (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">Notes</p>
                        <p className="text-slate-700">{client.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Client Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-slate-900">{project.name}</h3>
                            <Badge
                              variant={
                                project.status === "Completed"
                                  ? "default"
                                  : project.status === "In Progress"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{project.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600">Budget:</span>
                              <span className="ml-2 font-medium">${project.budget?.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-slate-600">Progress:</span>
                              <span className="ml-2 font-medium">{project.progress}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FolderKanban className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-slate-900 mb-1">No Projects</h3>
                      <p className="text-slate-600">This client doesn't have any projects yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900 mb-1">No Activity History</h3>
                    <p className="text-slate-600">Activity history will appear here as interactions occur.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Client Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleUpdateClient}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                Edit Client
              </DialogTitle>
              <DialogDescription>
                Update the client information below.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Client Name *</Label>
                  <Input
                    id="editName"
                    name="name"
                    placeholder="Enter client name"
                    value={editClient.name}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editIndustry">Industry *</Label>
                  <Input
                    id="editIndustry"
                    name="industry"
                    placeholder="e.g., Technology"
                    value={editClient.industry}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Priority Level</Label>
                <Select value={editClient.priority} onValueChange={handleEditSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email Address *</Label>
                  <Input
                    id="editEmail"
                    name="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={editClient.email}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Phone Number</Label>
                  <Input
                    id="editPhone"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={editClient.phone}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLocation">Location</Label>
                <Input
                  id="editLocation"
                  name="location"
                  placeholder="City, State/Country"
                  value={editClient.location}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editNotes">Notes</Label>
                <Textarea
                  id="editNotes"
                  name="notes"
                  placeholder="Additional notes about the client..."
                  value={editClient.notes}
                  onChange={handleEditInputChange}
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-500 to-purple-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Client"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Delete Client
            </AlertDialogTitle>            <AlertDialogDescription>
              Are you sure you want to delete <strong>{client?.name}</strong>? 
              This action will permanently delete the client and their associated user account from the database. 
              This cannot be undone. All associated projects will remain but will lose their client reference.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete Client"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
