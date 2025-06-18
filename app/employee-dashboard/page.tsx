"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FolderKanban, CheckCircle, Clock } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

export default function EmployeeDashboardPage() {
  return (
    <ProtectedRoute allowedUserTypes={["employee"]}>
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Employee Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 due today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Current Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Task {i + 1}</h3>
                        <p className="text-sm text-muted-foreground">Project Alpha</p>
                      </div>
                      <Badge variant={i === 0 ? "destructive" : i === 1 ? "default" : "outline"}>
                        {i === 0 ? "Urgent" : i === 1 ? "In Progress" : "Planned"}
                      </Badge>
                    </div>
                    <Progress value={i === 0 ? 25 : i === 1 ? 50 : 10} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Due in {i === 0 ? "1 day" : i === 1 ? "3 days" : "1 week"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FolderKanban className="h-3 w-3" />
                        <span>Task {i + 1}/{10 + i}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Completed Recently</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Completed Task {i + 1}</h3>
                        <p className="text-sm text-muted-foreground">Project Beta</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    </div>
                    <Progress value={100} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Completed {i === 0 ? "today" : i === 1 ? "yesterday" : "3 days ago"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
