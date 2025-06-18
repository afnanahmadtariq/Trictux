"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  Building2, 
  MapPin, 
  Users, 
  Star, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Clock,
  CheckCircle,
  Activity,
  FolderKanban,
  Mail,
  Phone,
  Globe,
  Award,
  Target,
  Briefcase,
  ChartBar,
  AlertTriangle,
  Zap
} from "lucide-react"

// Company data (this would typically come from an API)
const companiesData = [
  {
    id: "COMP-B",
    name: "Company B",
    location: "Austin, TX",
    specialties: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Healthcare APIs",
      "E-commerce",
    ],
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
    description: "Specialized healthcare technology company with expertise in HIPAA-compliant applications and e-commerce platforms. Known for delivering high-quality, scalable solutions.",
    website: "https://companyb.com",
    email: "contact@companyb.com",
    phone: "+1 (512) 555-0123",
    ceo: "Sarah Johnson",
    founded: "2018",
    employees: "50-100",
    certifications: ["ISO 27001", "SOC 2 Type II", "HIPAA Compliant"],
    workHistory: [
      {
        month: "Jan 2024",
        revenue: 42000,
        projects: 6,
        satisfaction: 4.8
      },
      {
        month: "Feb 2024", 
        revenue: 38000,
        projects: 5,
        satisfaction: 4.9
      },
      {
        month: "Mar 2024",
        revenue: 45000,
        projects: 7,
        satisfaction: 4.7
      },
      {
        month: "Apr 2024",
        revenue: 41000,
        projects: 6,
        satisfaction: 4.8
      },
      {
        month: "May 2024",
        revenue: 43000,
        projects: 6,
        satisfaction: 4.9
      },
      {
        month: "Jun 2024",
        revenue: 47000,
        projects: 7,
        satisfaction: 4.8
      }
    ],
    recentProjects: [
      {
        id: "PRJ-001",
        name: "Healthcare Management System",
        client: "MedTech Solutions",
        status: "In Progress",
        progress: 75,
        startDate: "2024-03-15",
        expectedCompletion: "2024-07-30",
        value: 85000
      },
      {
        id: "PRJ-002", 
        name: "E-commerce Platform",
        client: "RetailMax",
        status: "In Progress",
        progress: 60,
        startDate: "2024-04-01",
        expectedCompletion: "2024-08-15",
        value: 120000
      },
      {
        id: "PRJ-003",
        name: "Patient Portal Integration",
        client: "City Hospital",
        status: "Completed",
        progress: 100,
        startDate: "2024-01-10",
        expectedCompletion: "2024-05-15",
        value: 65000
      }
    ],
    teamMembers: [
      { name: "John Smith", role: "Tech Lead", expertise: ["React", "Node.js"] },
      { name: "Maria Garcia", role: "Backend Developer", expertise: ["PostgreSQL", "APIs"] },
      { name: "David Chen", role: "Frontend Developer", expertise: ["React", "TypeScript"] },
      { name: "Lisa Wilson", role: "DevOps Engineer", expertise: ["AWS", "Docker"] }
    ]
  },
  {
    id: "COMP-C",
    name: "Company C",
    location: "San Francisco, CA",
    specialties: [
      "Vue.js",
      "Python",
      "MySQL",
      "REST APIs",
      "Mobile Development",
    ],
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
    description: "Innovative mobile-first development company specializing in cross-platform applications and modern web technologies.",
    website: "https://companyc.com",
    email: "hello@companyc.com", 
    phone: "+1 (415) 555-0456",
    ceo: "Michael Rodriguez",
    founded: "2019",
    employees: "25-50",
    certifications: ["Google Cloud Partner", "AWS Select Partner"],
    workHistory: [
      {
        month: "Jan 2024",
        revenue: 35000,
        projects: 4,
        satisfaction: 4.9
      },
      {
        month: "Feb 2024",
        revenue: 32000,
        projects: 3,
        satisfaction: 5.0
      },
      {
        month: "Mar 2024",
        revenue: 38000,
        projects: 5,
        satisfaction: 4.8
      },
      {
        month: "Apr 2024",
        revenue: 36000,
        projects: 4,
        satisfaction: 4.9
      },
      {
        month: "May 2024",
        revenue: 34000,
        projects: 4,
        satisfaction: 4.9
      },
      {
        month: "Jun 2024",
        revenue: 40000,
        projects: 5,
        satisfaction: 4.8
      }
    ],
    recentProjects: [
      {
        id: "PRJ-004",
        name: "Mobile Banking App",
        client: "FinanceFirst",
        status: "In Progress",
        progress: 85,
        startDate: "2024-02-20",
        expectedCompletion: "2024-07-10",
        value: 95000
      },
      {
        id: "PRJ-005",
        name: "Inventory Management System", 
        client: "ServicePro",
        status: "In Progress",
        progress: 40,
        startDate: "2024-05-01",
        expectedCompletion: "2024-09-30",
        value: 75000
      }
    ],
    teamMembers: [
      { name: "Emily Chang", role: "Mobile Lead", expertise: ["Vue.js", "React Native"] },
      { name: "Alex Thompson", role: "Backend Developer", expertise: ["Python", "APIs"] },
      { name: "Sophie Miller", role: "UI/UX Designer", expertise: ["Design", "Prototyping"] }
    ]
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
    description: "Enterprise-focused software development company with strong expertise in microservices architecture and large-scale applications.",
    website: "https://companyd.com",
    email: "info@companyd.com",
    phone: "+1 (212) 555-0789",
    ceo: "Robert Kim",
    founded: "2020",
    employees: "75-100",
    certifications: ["Microsoft Gold Partner", "Oracle Certified"],
    workHistory: [
      {
        month: "Jan 2024",
        revenue: 28000,
        projects: 3,
        satisfaction: 4.6
      },
      {
        month: "Feb 2024",
        revenue: 25000,
        projects: 2,
        satisfaction: 4.7
      },
      {
        month: "Mar 2024",
        revenue: 30000,
        projects: 4,
        satisfaction: 4.5
      },
      {
        month: "Apr 2024",
        revenue: 27000,
        projects: 3,
        satisfaction: 4.6
      },
      {
        month: "May 2024",
        revenue: 29000,
        projects: 3,
        satisfaction: 4.7
      },
      {
        month: "Jun 2024",
        revenue: 32000,
        projects: 4,
        satisfaction: 4.6
      }
    ],
    recentProjects: [
      {
        id: "PRJ-006",
        name: "Enterprise CRM System",
        client: "TechCorp Inc.",
        status: "In Progress",
        progress: 55,
        startDate: "2024-03-10",
        expectedCompletion: "2024-09-15",
        value: 150000
      }
    ],
    teamMembers: [
      { name: "James Wilson", role: "Solution Architect", expertise: ["Java", "Microservices"] },
      { name: "Anna Petrov", role: "DevOps Lead", expertise: ["Kubernetes", "CI/CD"] },
      { name: "Carlos Santos", role: "Full Stack Developer", expertise: ["Angular", "Java"] }
    ]
  }
]

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const companyId = params.id as string
  const company = companiesData.find(c => c.id === companyId)

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Company Not Found</h1>
        <p className="text-slate-600 mb-4">The company you're looking for doesn't exist.</p>
        <Link href="/companies">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Button>
        </Link>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "On Hold":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/companies">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <Building2 className="h-7 w-7 text-blue-600" />
                  {company.name}
                </h1>
                <p className="text-slate-600 mt-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant={company.status === "Active" ? "default" : "secondary"}
                className="px-3 py-1"
              >
                {company.status}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{company.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Success Rate</p>
                        <p className="text-2xl font-bold text-green-600">{company.successRate}%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Active Projects</p>
                        <p className="text-2xl font-bold text-blue-600">{company.activeProjects}</p>
                      </div>
                      <FolderKanban className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Team Size</p>
                        <p className="text-2xl font-bold text-purple-600">{company.teamSize}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Current Workload</p>
                        <p className="text-2xl font-bold text-orange-600">{company.currentWorkload}%</p>
                      </div>
                      <Activity className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Company Information */}
                <Card className="lg:col-span-2 border-slate-200">
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">About</h3>
                      <p className="text-slate-600 leading-relaxed">{company.description}</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">Contact Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-slate-500" />
                              <span className="text-sm text-slate-600">{company.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-500" />
                              <span className="text-sm text-slate-600">{company.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-slate-500" />
                              <a href={company.website} className="text-sm text-blue-600 hover:underline">
                                {company.website}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">Company Details</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">CEO:</span>
                              <span className="text-sm font-medium text-slate-900">{company.ceo}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Founded:</span>
                              <span className="text-sm font-medium text-slate-900">{company.founded}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Employees:</span>
                              <span className="text-sm font-medium text-slate-900">{company.employees}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Joined:</span>
                              <span className="text-sm font-medium text-slate-900">
                                {new Date(company.joinDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {company.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {company.certifications && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-slate-900 mb-3">Certifications</h4>
                          <div className="flex flex-wrap gap-2">
                            {company.certifications.map((cert, index) => (
                              <Badge key={index} variant="outline" className="gap-1">
                                <Award className="h-3 w-3" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Completed Projects</span>
                        <span className="font-semibold text-slate-900">{company.completedProjects}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Avg. Delivery Time</span>
                        <span className="font-semibold text-slate-900">{company.avgDeliveryTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Last Delivery</span>
                        <span className="font-semibold text-green-600">{company.lastDelivery}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Total Revenue</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(company.revenue)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600">Workload Capacity</span>
                        <span className="text-sm font-medium text-slate-900">{company.currentWorkload}%</span>
                      </div>
                      <Progress value={company.currentWorkload} className="h-2" />
                      <p className="text-xs text-slate-500 mt-1">
                        {company.currentWorkload < 60 ? "Available for new projects" : 
                         company.currentWorkload < 85 ? "Moderate capacity" : "Near capacity"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {company.recentProjects?.map((project) => (
                  <Card key={project.id} className="border-slate-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">{project.name}</h3>
                          <p className="text-sm text-slate-600">Client: {project.client}</p>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-600">Progress</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={project.progress} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{project.progress}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Start Date</p>
                          <p className="text-sm font-medium text-slate-900 mt-1">
                            {new Date(project.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Expected Completion</p>
                          <p className="text-sm font-medium text-slate-900 mt-1">
                            {new Date(project.expectedCompletion).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Project Value</p>
                          <p className="text-sm font-medium text-slate-900 mt-1">
                            {formatCurrency(project.value)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Project ID: {project.id}</span>
                        <Link href={`/projects/${project.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {company.teamMembers?.map((member, index) => (
                  <Card key={index} className="border-slate-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar>
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-slate-900">{member.name}</h3>
                          <p className="text-sm text-slate-600">{member.role}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-2">Expertise</p>
                        <div className="flex flex-wrap gap-1">
                          {member.expertise.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {company.workHistory?.map((month, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                          <span className="text-sm text-slate-600">{month.month}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">{formatCurrency(month.revenue)}</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{month.satisfaction}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600">Project Success Rate</span>
                        <span className="text-sm font-medium">{company.successRate}%</span>
                      </div>
                      <Progress value={company.successRate} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600">Client Satisfaction</span>
                        <span className="text-sm font-medium">{company.rating}/5.0</span>
                      </div>
                      <Progress value={(company.rating / 5) * 100} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600">Resource Utilization</span>
                        <span className="text-sm font-medium">{company.currentWorkload}%</span>
                      </div>
                      <Progress value={company.currentWorkload} className="h-2" />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-slate-900">{company.completedProjects}</p>
                        <p className="text-xs text-slate-600">Completed</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">{company.activeProjects}</p>
                        <p className="text-xs text-slate-600">Active</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
