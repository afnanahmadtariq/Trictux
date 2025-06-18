"use client"

import { useState } from "react"
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

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = selectedPriority === "All" || client.priority === selectedPriority
    return matchesSearch && matchesPriority
  })

  const totalValue = clients.reduce((sum, client) => sum + client.totalValue, 0)
  const avgSatisfaction = clients.reduce((sum, client) => sum + client.satisfaction, 0) / clients.length
  const totalActiveProjects = clients.reduce((sum, client) => sum + client.activeProjects, 0)

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
            <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
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
                    <p className="text-2xl font-bold text-slate-900">{clients.length}</p>
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
        </div>
      </div>
    </div>
  )
}
