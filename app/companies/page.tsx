"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, Star, TrendingUp, ArrowUpRight, BarChart3, Activity } from "lucide-react"
import Link from "next/link"

const companies = [
  {
    id: "COMP-B",
    name: "Company B",
    location: "Austin, TX",
    specialties: ["React", "Node.js", "PostgreSQL", "Healthcare APIs", "E-commerce"],
    currentWorkload: 75,
    successRate: 94.2,
    avgDeliveryTime: "2.8 months",
    activeProjects: 6,
    completedProjects: 24,
    teamSize: 12,
    rating: 4.8,
    lastDelivery: "On time",
    revenue: 450000,
    status: "Active",
    joinDate: "2022-01-15",
  },
  {
    id: "COMP-C",
    name: "Company C",
    location: "San Francisco, CA",
    specialties: ["Vue.js", "Python", "MySQL", "REST APIs", "Mobile Development"],
    currentWorkload: 60,
    successRate: 96.1,
    avgDeliveryTime: "2.3 months",
    activeProjects: 4,
    completedProjects: 18,
    teamSize: 8,
    rating: 4.9,
    lastDelivery: "2 days early",
    revenue: 380000,
    status: "Active",
    joinDate: "2022-06-20",
  },
  {
    id: "COMP-D",
    name: "Company D",
    location: "New York, NY",
    specialties: ["Angular", "Java", "MongoDB", "Microservices", "DevOps"],
    currentWorkload: 45,
    successRate: 91.7,
    avgDeliveryTime: "3.1 months",
    activeProjects: 3,
    completedProjects: 15,
    teamSize: 10,
    rating: 4.6,
    lastDelivery: "On time",
    revenue: 290000,
    status: "Active",
    joinDate: "2023-02-10",
  },
]

export default function CompaniesPage() {
  const totalRevenue = companies.reduce((sum, company) => sum + company.revenue, 0)
  const totalTeamSize = companies.reduce((sum, company) => sum + company.teamSize, 0)
  const avgSuccessRate = companies.reduce((sum, company) => sum + company.successRate, 0) / companies.length
  const totalActiveProjects = companies.reduce((sum, company) => sum + company.activeProjects, 0)

  const getWorkloadColor = (workload: number) => {
    if (workload >= 80) return "text-red-600"
    if (workload >= 60) return "text-yellow-600"
    return "text-green-600"
  }

  const getWorkloadBg = (workload: number) => {
    if (workload >= 80) return "bg-red-500"
    if (workload >= 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Company Network</h1>
              <p className="text-slate-600 mt-1">Manage your partner companies and track performance</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Performance Report
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600">
                <Building2 className="h-4 w-4" />
                Add Company
              </Button>
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
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{companies.length}</p>
                    <p className="text-sm text-slate-600">Partner Companies</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-50">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{totalTeamSize}</p>
                    <p className="text-sm text-slate-600">Total Developers</p>
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
                    <p className="text-2xl font-bold text-slate-900">${(totalRevenue / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-slate-600">Total Revenue</p>
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
                    <p className="text-2xl font-bold text-slate-900">{avgSuccessRate.toFixed(1)}%</p>
                    <p className="text-sm text-slate-600">Avg Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="workload">Workload</TabsTrigger>
              <TabsTrigger value="skills">Skills Matrix</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <Card key={company.id} className="border-slate-200 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            {company.name}
                          </CardTitle>
                          <p className="text-sm text-slate-600 mt-1">{company.location}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{company.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Workload */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">Current Workload</span>
                          <span className={`font-medium ${getWorkloadColor(company.currentWorkload)}`}>
                            {company.currentWorkload}%
                          </span>
                        </div>
                        <Progress value={company.currentWorkload} className="h-2" />
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-200">
                        <div>
                          <p className="text-sm text-slate-600">Team Size</p>
                          <p className="text-lg font-bold text-slate-900">{company.teamSize}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Active Projects</p>
                          <p className="text-lg font-bold text-slate-900">{company.activeProjects}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Success Rate</p>
                          <p className="text-lg font-bold text-slate-900">{company.successRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Avg Delivery</p>
                          <p className="text-lg font-bold text-slate-900">{company.avgDeliveryTime}</p>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-sm text-slate-600 mb-2">Specialties</p>
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

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-slate-200">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Activity className="h-4 w-4" />
                          Details
                        </Button>
                        <Link href={`/projects?company=${company.id}`} className="flex-1">
                          <Button size="sm" className="w-full gap-2">
                            <ArrowUpRight className="h-4 w-4" />
                            Projects ({company.activeProjects})
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {companies.map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-white">
                            <Building2 className="h-5 w-5 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{company.name}</h3>
                            <p className="text-sm text-slate-600">{company.completedProjects} completed projects</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-lg font-bold text-slate-900">{company.successRate}%</p>
                            <p className="text-xs text-slate-600">Success Rate</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-slate-900">{company.avgDeliveryTime}</p>
                            <p className="text-xs text-slate-600">Avg Delivery</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-slate-900">${(company.revenue / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-slate-600">Revenue</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workload" className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Current Workload Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {companies.map((company) => (
                      <div key={company.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-slate-900">{company.name}</h3>
                            <Badge variant={company.currentWorkload >= 80 ? "destructive" : "default"}>
                              {company.currentWorkload >= 80 ? "High Load" : "Available"}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">{company.activeProjects} active</p>
                            <p className="text-sm text-slate-600">{company.teamSize} developers</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Capacity Utilization</span>
                            <span className={`font-medium ${getWorkloadColor(company.currentWorkload)}`}>
                              {company.currentWorkload}%
                            </span>
                          </div>
                          <Progress value={company.currentWorkload} className="h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Skills Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {companies.map((company) => (
                      <div key={company.id} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-slate-900">{company.name}</h3>
                          <p className="text-sm text-slate-600">{company.specialties.length} specialties</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {company.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="bg-white">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
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
