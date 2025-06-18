"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, ArrowUpRight, BarChart3, Building2, Calendar, CheckCircle, DownloadCloud, Users, Star, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Company data
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
	const { toast } = useToast()
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [companies, setCompanies] = useState(companiesData)
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

  // Fetch companies from the database on page load
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/companies')
        const data = await response.json()
        
        if (response.ok && data.companies) {
          // If we have companies from the API, use them
          if (data.companies.length > 0) {
            setCompanies(data.companies)
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch companies. Using demo data.",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Error fetching companies:', error)
        toast({
          title: "Error",
          description: "Failed to fetch companies. Using demo data.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanies()
  }, [])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCompany({
      ...newCompany,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!newCompany.name || !newCompany.location || !newCompany.teamSize || !newCompany.email || !newCompany.password || !newCompany.contactPerson) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive"
      })
      return
    }
    
    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    if (!passwordRegex.test(newCompany.password)) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
        variant: "destructive"
      })
      return
    }

    try {
      // Set loading state
      setIsSubmitting(true)
      
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
        toast({
          title: "Company added",
          description: `${newCompany.name} has been added successfully.`
        })
        
        // Add the new company to the list without needing a full page refresh
        // This is a simplification - in production you might want to fetch the full list again
        const newCompanyWithDefaults = {
          id: data.company.id,
          name: data.company.name,
          location: data.company.location,
          specialties: data.company.specialties,
          currentWorkload: data.company.currentWorkload,
          successRate: data.company.successRate,
          avgDeliveryTime: data.company.avgDeliveryTime,
          activeProjects: data.company.activeProjects,
          completedProjects: data.company.completedProjects,
          teamSize: data.company.teamSize,
          rating: data.company.rating,
          lastDelivery: "N/A",
          revenue: data.company.revenue,
          status: data.company.status,
          joinDate: data.company.joinDate,
        }
        
        setCompanies([...companies, newCompanyWithDefaults])
        
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
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add company. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
      console.error("Error adding company:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

	const totalRevenue = companies.reduce(
		(sum, company) => sum + company.revenue,
		0
	)
	const totalTeamSize = companies.reduce(
		(sum, company) => sum + company.teamSize,
		0
	)
	const avgSuccessRate =
		companies.reduce((sum, company) => sum + company.successRate, 0) /
		companies.length
	const totalActiveProjects = companies.reduce(
		(sum, company) => sum + company.activeProjects,
		0
	)

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

	const handleAddCompany = () => {
		setCompanyDialogOpen(true)
	}

	const handleGenerateReport = () => {
		toast({
			title: "Generating report",
			description: "Please wait while we generate your performance report...",
		})

		// Simulate report generation
		setTimeout(() => {
			toast({
				title: "Report ready",
				description: "Performance report has been generated successfully.",
			})
		}, 2000)
	}

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<div className="border-b border-slate-200 bg-white">
				<div className="px-6 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-slate-900">
								Company Network
							</h1>
							<p className="text-slate-600 mt-1">
								Manage your partner companies and track performance
							</p>
						</div>
						<div className="flex gap-3">
							<Button
								variant="outline"
								className="gap-2"
								onClick={handleGenerateReport}
							>
								<BarChart3 className="h-4 w-4" />
								Performance Report
							</Button>
              <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                    onClick={handleAddCompany}
                  >
                    <Building2 className="h-4 w-4" />
                    Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleSubmit}>
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
                          <Label htmlFor="name">Company Name <span className="text-red-500">*</span></Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={newCompany.name}
                            onChange={handleInputChange}
                            placeholder="Enter company name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                          <Input 
                            id="location" 
                            name="location" 
                            value={newCompany.location}
                            onChange={handleInputChange}
                            placeholder="City, Country"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email"
                            value={newCompany.email}
                            onChange={handleInputChange}
                            placeholder="Company login email"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                          <Input 
                            id="password" 
                            name="password" 
                            type="password"
                            value={newCompany.password}
                            onChange={handleInputChange}
                            placeholder="Set login password"
                            required
                          />
                          <p className="text-xs text-slate-500">
                            Must be at least 8 characters with uppercase, lowercase, number, and special character
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teamSize">Team Size <span className="text-red-500">*</span></Label>
                        <Input 
                          id="teamSize" 
                          name="teamSize"
                          type="number"
                          value={newCompany.teamSize}
                          onChange={handleInputChange}
                          placeholder="Number of team members"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person <span className="text-red-500">*</span></Label>
                        <Input 
                          id="contactPerson" 
                          name="contactPerson"
                          value={newCompany.contactPerson}
                          onChange={handleInputChange}
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
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          name="description"
                          value={newCompany.description}
                          onChange={handleInputChange}
                          placeholder="Brief description of the company"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email"
                            value={newCompany.email}
                            onChange={handleInputChange}
                            placeholder="Enter company email"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                          <Input 
                            id="password" 
                            name="password" 
                            type="password"
                            value={newCompany.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input 
                          id="contactPerson" 
                          name="contactPerson"
                          value={newCompany.contactPerson}
                          onChange={handleInputChange}
                          placeholder="Name of the contact person"
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Adding..." : "Add Company"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
										<p className="text-2xl font-bold text-slate-900">
											{companies.length}
										</p>
										<p className="text-sm text-slate-600">
											Partner Companies
										</p>
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
										<p className="text-2xl font-bold text-slate-900">
											{totalTeamSize}
										</p>
										<p className="text-sm text-slate-600">
											Total Developers
										</p>
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
										<p className="text-2xl font-bold text-slate-900">
											${(totalRevenue / 1000000).toFixed(1)}M
										</p>
										<p className="text-sm text-slate-600">
											Total Revenue
										</p>
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
										<p className="text-2xl font-bold text-slate-900">
											{avgSuccessRate.toFixed(1)}%
										</p>
										<p className="text-sm text-slate-600">
											Avg Success Rate
										</p>
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
							{isLoading ? (
								<div className="flex justify-center items-center py-12">
									<div className="flex flex-col items-center gap-2">
										<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
										<p className="text-slate-600">Loading companies...</p>
									</div>
								</div>
							) : companies.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<Building2 className="h-12 w-12 text-slate-400 mb-4" />
									<h3 className="text-lg font-medium text-slate-900 mb-1">No companies yet</h3>
									<p className="text-slate-600 mb-6 max-w-md">
										You haven't added any partner companies yet. Click the "Add Company" button to get started.
									</p>
									<Button 
										className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
										onClick={handleAddCompany}
									>
										<Building2 className="h-4 w-4" />
										Add Company
									</Button>
								</div>
							) : (
								<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">{companies.map((company) => (
									<Card
										key={company.id}
										className="border-slate-200 hover:shadow-lg transition-all duration-200"
									>
										<CardHeader className="pb-3">
											<div className="flex items-start justify-between">
												<div>
													<CardTitle className="text-lg flex items-center gap-2">
														<Building2 className="h-5 w-5" />
														{company.name}
													</CardTitle>
													<p className="text-sm text-slate-600 mt-1">
														{company.location}
													</p>
												</div>
												<div className="flex items-center gap-1">
													<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
													<span className="text-sm font-medium">
														{company.rating}
													</span>
												</div>
											</div>
										</CardHeader>
										<CardContent className="space-y-4">
											{/* Workload */}
											<div>
												<div className="flex justify-between text-sm mb-2">
													<span className="text-slate-600">Current Workload</span>
													<span
														className={`font-medium ${getWorkloadColor(
															company.currentWorkload
														)}`}
													>
														{company.currentWorkload}%
													</span>
												</div>
												<Progress value={company.currentWorkload} className="h-2" />
											</div>

											{/* Stats Grid */}
											<div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-200">
												<div>
													<p className="text-sm text-slate-600">Team Size</p>
													<p className="text-lg font-bold text-slate-900">
														{company.teamSize}
													</p>
												</div>
												<div>
													<p className="text-sm text-slate-600">Active Projects</p>
													<p className="text-lg font-bold text-slate-900">
														{company.activeProjects}
													</p>
												</div>
												<div>
													<p className="text-sm text-slate-600">Success Rate</p>
													<p className="text-lg font-bold text-slate-900">
														{company.successRate}%
													</p>
												</div>
												<div>
													<p className="text-sm text-slate-600">Avg Delivery</p>
													<p className="text-lg font-bold text-slate-900">
														{company.avgDeliveryTime}
													</p>
												</div>
											</div>

											{/* Specialties */}
											<div className="pt-3 border-t border-slate-200">
												<p className="text-sm text-slate-600 mb-2">Specialties</p>
												<div className="flex flex-wrap gap-1">
													{company.specialties.slice(0, 3).map((specialty) => (
														<Badge
															key={specialty}
															variant="secondary"
															className="text-xs"
														>
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
												<Link
													href={`/projects?company=${company.id}`}
													className="flex-1"
												>
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
							)}
						</TabsContent>

						<TabsContent value="performance" className="space-y-6">
							<Card className="border-slate-200">
								<CardHeader>
									<CardTitle>Performance Metrics</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-6">
										{companies.map((company) => (
											<div
												key={company.id}
												className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
											>
												<div className="flex items-center gap-4">
													<div className="p-2 rounded-lg bg-white">
														<Building2 className="h-5 w-5 text-slate-600" />
													</div>
													<div>
														<h3 className="font-semibold text-slate-900">
															{company.name}
														</h3>
														<p className="text-sm text-slate-600">
															{company.completedProjects} completed
															projects
														</p>
													</div>
												</div>
												<div className="flex items-center gap-6">
													<div className="text-center">
														<p className="text-lg font-bold text-slate-900">
															{company.successRate}%
														</p>
														<p className="text-xs text-slate-600">
															Success Rate
														</p>
													</div>
													<div className="text-center">
														<p className="text-lg font-bold text-slate-900">
															{company.avgDeliveryTime}
														</p>
														<p className="text-xs text-slate-600">
															Avg Delivery
														</p>
													</div>
													<div className="text-center">
														<p className="text-lg font-bold text-slate-900">
															${(company.revenue / 1000).toFixed(0)}K
														</p>
														<p className="text-xs text-slate-600">
															Revenue
														</p>
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
														<h3 className="font-semibold text-slate-900">
															{company.name}
														</h3>
														<Badge
															variant={
																company.currentWorkload >= 80
																	? "destructive"
																	: "default"
															}
														>
															{company.currentWorkload >= 80
																? "High Load"
																: "Available"}
														</Badge>
													</div>
													<div className="text-right">
														<p className="font-semibold text-slate-900">
															{company.activeProjects} active
														</p>
														<p className="text-sm text-slate-600">
															{company.teamSize} developers
														</p>
													</div>
												</div>
												<div className="space-y-2">
													<div className="flex justify-between text-sm">
														<span className="text-slate-600">
															Capacity Utilization
														</span>
														<span
															className={`font-medium ${getWorkloadColor(
																company.currentWorkload
															)}`}
														>
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
											<div
												key={company.id}
												className="p-4 bg-slate-50 rounded-lg"
											>
												<div className="flex items-center justify-between mb-4">
													<h3 className="font-semibold text-slate-900">
														{company.name}
													</h3>
													<p className="text-sm text-slate-600">
														{company.specialties.length} specialties
													</p>
												</div>
												<div className="flex flex-wrap gap-2">
													{company.specialties.map((specialty) => (
														<Badge
															key={specialty}
															variant="outline"
															className="bg-white"
														>
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

			{/* Add Company Dialog */}
		</div>
	)
}
