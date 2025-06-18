"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, TrendingUp, DollarSign, Clock } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
            <p className="text-slate-600 mt-1">Comprehensive analytics and insights across your project network</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Coming Soon */}
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Advanced Analytics Coming Soon</h2>
              <p className="text-slate-600 mb-4">
                We're building comprehensive analytics dashboards with AI-powered insights, performance metrics, and
                predictive analytics.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-blue-900">Performance Trends</h3>
                  <p className="text-sm text-blue-700">Track project success rates and delivery times</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-green-900">Financial Analytics</h3>
                  <p className="text-sm text-green-700">Revenue analysis and payment optimization</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium text-purple-900">Predictive Insights</h3>
                  <p className="text-sm text-purple-700">AI-powered project timeline predictions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
