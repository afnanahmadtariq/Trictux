"use client"

import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users as UsersIcon, 
  Building2, 
  UserCheck, 
  Clock, 
  Mail, 
  Calendar,
  Settings,
  MoreHorizontal,
  Edit,
  UserX,
  UserPlus,
  Plus,
  Phone,
  Star
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface UserProfile {
  name?: string
  position?: string
  company?: string
  department?: string
  [key: string]: any
}

interface User {
  id: string
  email: string
  userType: "owner" | "company" | "employee"
  createdAt?: string
  lastLogin?: string
  status: "active" | "inactive"
  profile: UserProfile | null
}

interface UserStats {
  total: number
  owners: number
  companies: number
  employees: number
  active: number
  inactive: number
}

export default function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [clientDialogOpen, setClientDialogOpen] = useState(false)
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false)
  const [isSubmittingClient, setIsSubmittingClient] = useState(false)
  const [isSubmittingCompany, setIsSubmittingCompany] = useState(false)
  
  const [newStatus, setNewStatus] = useState<"active" | "inactive">("active")
  
  const [editData, setEditData] = useState({
    name: "",
    position: "",
    company: "",
    department: ""
  })

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
  
  const [newCompany, setNewCompany] = useState({
    name: "",
    location: "",
    teamSize: "",
    specialties: [] as string[],
    description: "",
    email: "",
    password: "",
    contactPerson: ""
  })
  
  const [specialty, setSpecialty] = useState("")

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data.users)
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.userType === "owner") {
      fetchUsers()
    }
  }, [user])

  const handleStatusUpdate = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: "updateStatus",
          data: { status: newStatus }
        })
      })

      if (!response.ok) {
        throw new Error("Failed to update user status")
      }

      toast.success("User status updated successfully")
      setIsStatusDialogOpen(false)
      fetchUsers()
    } catch (error) {
      console.error("Error updating user status:", error)
      toast.error("Failed to update user status")
    }
  }

  const handleProfileUpdate = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: "updateProfile",
          data: editData
        })
      })

      if (!response.ok) {
        throw new Error("Failed to update user profile")
      }

      toast.success("User profile updated successfully")
      setIsEditDialogOpen(false)
      fetchUsers()
    } catch (error) {
      console.error("Error updating user profile:", error)
      toast.error("Failed to update user profile")
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setEditData({
      name: user.profile?.name || "",
      position: user.profile?.position || "",
      company: user.profile?.company || "",
      department: user.profile?.department || ""
    })
    setIsEditDialogOpen(true)
  }
  const openStatusDialog = (user: User) => {
    setSelectedUser(user)
    setNewStatus(user.status === "active" ? "inactive" : "active")
    setIsStatusDialogOpen(true)
  }

  // Client creation handlers
  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewClient({
      ...newClient,
      [name]: value
    })
  }

  const handleClientSelectChange = (name: string, value: string) => {
    setNewClient({
      ...newClient,
      [name]: value
    })
  }
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!newClient.name || !newClient.industry || !newClient.email || !newClient.password) {
      toast.error("Please fill all required fields.")
      return
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    if (!passwordRegex.test(newClient.password)) {
      toast.error("Password must be at least 8 characters with uppercase, lowercase, number, and special character.")
      return
    }

    try {
      setIsSubmittingClient(true)
      
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
        toast.success(`${newClient.name} has been added successfully.`)
        
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
        
        // Refresh users list to show new client
        fetchUsers()
      } else {
        toast.error(data.error || "Failed to add client. Please try again.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
      console.error("Error adding client:", error)
    } finally {
      setIsSubmittingClient(false)
    }
  }

  // Company creation handlers
  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCompany({
      ...newCompany,
      [name]: value
    })
  }

  const addSpecialty = () => {
    if (specialty && !newCompany.specialties.includes(specialty)) {
      setNewCompany({
        ...newCompany,
        specialties: [...newCompany.specialties, specialty]
      })
      setSpecialty("")
    }
  }

  const removeSpecialty = (specialtyToRemove: string) => {
    setNewCompany({
      ...newCompany,
      specialties: newCompany.specialties.filter(s => s !== specialtyToRemove)
    })
  }

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!newCompany.name || !newCompany.location || !newCompany.teamSize || !newCompany.email || !newCompany.password || !newCompany.contactPerson) {
      toast.error("Please fill all required fields.")
      return
    }
    
    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    if (!passwordRegex.test(newCompany.password)) {
      toast.error("Password must be at least 8 characters, include uppercase, lowercase, number, and special character.")
      return
    }

    try {
      setIsSubmittingCompany(true)
      
      // Save company to database via API
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCompany),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success(`${newCompany.name} has been added successfully.`)
        
        // Close the dialog and reset form
        setCompanyDialogOpen(false)
        setNewCompany({
          name: "",
          location: "",
          teamSize: "",
          specialties: [],
          description: "",
          email: "",
          password: "",
          contactPerson: ""
        })
        
        // Refresh users list to show new company
        fetchUsers()
      } else {
        toast.error(data.error || "Failed to add company. Please try again.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
      console.error("Error adding company:", error)
    } finally {
      setIsSubmittingCompany(false)
    }
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "owner": return "bg-purple-100 text-purple-800"
      case "company": return "bg-blue-100 text-blue-800"
      case "employee": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800"
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString()
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase()
    }
    return email?.slice(0, 2).toUpperCase() || "U"
  }

  if (user?.userType !== "owner") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            View and manage users in your company ecosystem
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setClientDialogOpen(true)}
            className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600"
          >
            <UserPlus className="h-4 w-4" />
            Add Client
          </Button>
          <Button 
            onClick={() => setCompanyDialogOpen(true)}
            className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
          >
            <Building2 className="h-4 w-4" />
            Add Company
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Owners</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.owners}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.companies}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
              <UsersIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.employees}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <UserPlus className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactive}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <Card>        <CardHeader>
          <CardTitle>Company Users</CardTitle>
          <CardDescription>
            Users in your company ecosystem: yourself, partner companies, and their employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <UsersIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No users found in your company ecosystem</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {getInitials(user.profile?.name, user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.profile?.name || user.email}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                          {user.profile?.position && (
                            <div className="text-xs text-muted-foreground">
                              {user.profile.position}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getUserTypeColor(user.userType)}>
                        {user.userType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatDate(user.lastLogin)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openStatusDialog(user)}>
                            {user.status === "active" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update the profile information for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input
                id="position"
                value={editData.position}
                onChange={(e) => setEditData({...editData, position: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input
                id="company"
                value={editData.company}
                onChange={(e) => setEditData({...editData, company: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Input
                id="department"
                value={editData.department}
                onChange={(e) => setEditData({...editData, department: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleProfileUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to {newStatus === "active" ? "activate" : "deactivate"} {selectedUser?.email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>
              {newStatus === "active" ? "Activate" : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleAddClient}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-green-600" />
                Add New Client
              </DialogTitle>
              <DialogDescription>
                Add a new client to your management system. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="client-name" 
                    name="name" 
                    value={newClient.name}
                    onChange={handleClientInputChange}
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-industry">Industry <span className="text-red-500">*</span></Label>
                  <Input 
                    id="client-industry" 
                    name="industry" 
                    value={newClient.industry}
                    onChange={handleClientInputChange}
                    placeholder="Enter industry"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-priority">Priority</Label>
                <Select 
                  value={newClient.priority} 
                  onValueChange={(value) => handleClientSelectChange("priority", value)}
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
              </div>              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email <span className="text-red-500">*</span></Label>
                  <Input 
                    id="client-email" 
                    name="email"
                    type="email" 
                    value={newClient.email}
                    onChange={handleClientInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-password">Password <span className="text-red-500">*</span></Label>
                  <Input 
                    id="client-password" 
                    name="password"
                    type="password" 
                    value={newClient.password}
                    onChange={handleClientInputChange}
                    placeholder="Set login password"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-phone">Phone</Label>
                <Input 
                  id="client-phone" 
                  name="phone" 
                  value={newClient.phone}
                  onChange={handleClientInputChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-location">Location</Label>
                <Input 
                  id="client-location" 
                  name="location"
                  value={newClient.location}
                  onChange={handleClientInputChange}
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-notes">Notes</Label>
                <Textarea 
                  id="client-notes" 
                  name="notes"
                  value={newClient.notes}
                  onChange={handleClientInputChange}
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
                className="bg-gradient-to-r from-green-500 to-emerald-600"
                disabled={isSubmittingClient}
              >
                {isSubmittingClient ? "Adding..." : "Add Client"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Company Dialog */}
      <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleAddCompany}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Add Partner Company
              </DialogTitle>
              <DialogDescription>
                Add a new company to your partner network. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="company-name" 
                    name="name" 
                    value={newCompany.name}
                    onChange={handleCompanyInputChange}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-location">Location <span className="text-red-500">*</span></Label>
                  <Input 
                    id="company-location" 
                    name="location" 
                    value={newCompany.location}
                    onChange={handleCompanyInputChange}
                    placeholder="City, Country"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email <span className="text-red-500">*</span></Label>
                  <Input 
                    id="company-email" 
                    name="email" 
                    type="email"
                    value={newCompany.email}
                    onChange={handleCompanyInputChange}
                    placeholder="Company login email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-password">Password <span className="text-red-500">*</span></Label>
                  <Input 
                    id="company-password" 
                    name="password" 
                    type="password"
                    value={newCompany.password}
                    onChange={handleCompanyInputChange}
                    placeholder="Set login password"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-teamSize">Team Size <span className="text-red-500">*</span></Label>
                <Input 
                  id="company-teamSize" 
                  name="teamSize"
                  type="number"
                  value={newCompany.teamSize}
                  onChange={handleCompanyInputChange}
                  placeholder="Number of team members"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-contactPerson">Contact Person <span className="text-red-500">*</span></Label>
                <Input 
                  id="company-contactPerson" 
                  name="contactPerson"
                  value={newCompany.contactPerson}
                  onChange={handleCompanyInputChange}
                  placeholder="Primary contact name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Specialties</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addSpecialty}
                  >
                    Add
                  </Button>
                </div>
                {newCompany.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newCompany.specialties.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="px-2 py-1 flex items-center gap-1"
                      >
                        {skill}
                        <button 
                          type="button"
                          className="ml-1 hover:text-red-500 focus:outline-none"
                          onClick={() => removeSpecialty(skill)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-description">Description</Label>
                <Textarea 
                  id="company-description" 
                  name="description"
                  value={newCompany.description}
                  onChange={handleCompanyInputChange}
                  placeholder="Brief description of the company"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCompanyDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-500 to-purple-600"
                disabled={isSubmittingCompany}
              >
                {isSubmittingCompany ? "Adding..." : "Add Company"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
