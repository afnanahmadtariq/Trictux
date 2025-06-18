"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Users,
  FolderKanban,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Zap,
  Brain,
  DollarSign,
  ArrowUpRight,
  Activity,
} from "lucide-react"
import Link from "next/link"

const stats = [
  {
    title: "Active Projects",
    value: "24",
    change: "+12%",
    changeType: "positive",
    icon: FolderKanban,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/projects",
  },
  {
    title: "Partner Companies",
    value: "8",
    change: "+2 new",
    changeType: "positive",
    icon: Building2,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    href: "/companies",
  },
  {
    title: "Total Clients",
    value: "156",
    change: "+8%",
    changeType: "positive",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50",
    href: "/clients",
  },
  {
    title: "Success Rate",
    value: "94.2%",
    change: "+2.1%",
    changeType: "positive",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    href: "/companies/performance",
  },
]

const recentActivity = [
  {
    type: "milestone",
    title: "Milestone Completed",
    description: "E-commerce Platform - Frontend Components delivered",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    href: "/projects/PRJ-001",
  },
  {
    type: "payment",
    title: "Payment Released",
    description: "$15,000 released to Company C for milestone completion",
    time: "3 hours ago",
    icon: DollarSign,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/projects/PRJ-002",
  },
  {
    type: "alert",
    title: "Attention Required",
    description: "AI Chatbot Integration project has 2 active blockers",
    time: "5 hours ago",
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    href: "/projects/PRJ-003",
  },
  {
    type: "assignment",
    title: "Project Assigned",
    description: "Healthcare Management System assigned to Company B",
    time: "1 day ago",
    icon: Zap,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    href: "/assignment",
  },
]

const quickActions = [
  { title: "Create New Project", href: "/projects/create", icon: FolderKanban },
  { title: "Add Client", href: "/clients/add", icon: Users },
  { title: "View All Companies", href: "/companies", icon: Building2 },
  { title: "Assignment Engine", href: "/assignment", icon: Zap },
]

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome back! Here's your project network overview.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/status">
                <Button variant="outline" className="gap-2">
                  <Activity className="h-4 w-4" />
                  Live Status
                </Button>
              </Link>
              <Link href="/projects/create">
                <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600">
                  <Zap className="h-4 w-4" />
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
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Link key={stat.title} href={stat.href}>
                <Card className="border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</p>
                        <div className="flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                          <p className="text-sm font-medium text-green-600">{stat.change}</p>
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="lg:col-span-2 border-slate-200">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {recentActivity.map((activity, index) => (
                    <Link key={index} href={activity.href}>
                      <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex gap-4">
                          <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                            <activity.icon className={`h-4 w-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-900 mb-1">{activity.title}</h4>
                            <p className="text-sm text-slate-600 mb-2">{activity.description}</p>
                            <p className="text-xs text-slate-400">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-200">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {quickActions.map((action) => (
                    <Link key={action.title} href={action.href}>
                      <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-3 hover:bg-slate-100">
                        <action.icon className="h-4 w-4" />
                        <span className="text-sm">{action.title}</span>
                        <ArrowUpRight className="h-3 w-3 ml-auto" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights Section */}
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Project Health</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    87% of projects are on track. Consider reallocating resources from Company D to Company C for
                    optimal performance.
                  </p>
                  <Link href="/projects">
                    <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                      View Details
                    </Button>
                  </Link>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Payment Optimization</h3>
                  <p className="text-sm text-green-800 mb-3">
                    $45,000 in milestone payments ready for auto-release. AI has verified 3 deliverables.
                  </p>
                  <Link href="/projects/PRJ-001">
                    <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                      Review Payments
                    </Button>
                  </Link>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Capacity Planning</h3>
                  <p className="text-sm text-purple-800 mb-3">
                    Company B has optimal capacity for 2 new projects. Healthcare domain expertise available.
                  </p>
                  <Link href="/assignment">
                    <Button size="sm" variant="outline" className="text-purple-700 border-purple-300">
                      Assign Projects
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
