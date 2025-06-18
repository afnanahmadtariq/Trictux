"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Clock, Play, Pause, Square, Plus, Calendar, Target, Timer, BarChart3, Edit, Trash2 } from "lucide-react"

const timeEntries = [
  {
    id: "TIME-001",
    task: "Frontend Components Development",
    project: "E-commerce Platform Redesign",
    date: "2024-02-22",
    startTime: "09:00",
    endTime: "12:30",
    duration: 3.5,
    description: "Worked on responsive design components and mobile optimization",
    status: "Completed",
  },
  {
    id: "TIME-002",
    task: "Frontend Components Development",
    project: "E-commerce Platform Redesign",
    date: "2024-02-21",
    startTime: "14:00",
    endTime: "18:00",
    duration: 4,
    description: "Implemented component library structure and base components",
    status: "Completed",
  },
  {
    id: "TIME-003",
    task: "Mobile App UI Design",
    project: "Mobile Banking App",
    date: "2024-02-20",
    startTime: "10:00",
    endTime: "13:00",
    duration: 3,
    description: "Created initial mockups and design system foundation",
    status: "Completed",
  },
  {
    id: "TIME-004",
    task: "Mobile App UI Design",
    project: "Mobile Banking App",
    date: "2024-02-19",
    startTime: "15:30",
    endTime: "17:00",
    duration: 1.5,
    description: "Research and competitive analysis for banking app UX patterns",
    status: "Completed",
  },
]

const activeTasks = [
  { id: "TASK-001", title: "Frontend Components Development", project: "E-commerce Platform Redesign" },
  { id: "TASK-004", title: "Mobile App UI Design", project: "Mobile Banking App" },
  { id: "TASK-003", title: "API Integration Testing", project: "Inventory Management System" },
]

export default function TimeTrackingPage() {
  const [isTracking, setIsTracking] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [selectedTask, setSelectedTask] = useState("")
  const [timeDescription, setTimeDescription] = useState("")
  const [addTimeDialogOpen, setAddTimeDialogOpen] = useState(false)
  const [editTimeDialogOpen, setEditTimeDialogOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<any>(null)

  // Calculate stats
  const totalHoursThisWeek = timeEntries
    .filter((entry) => {
      const entryDate = new Date(entry.date)
      const today = new Date()
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
      return entryDate >= weekStart
    })
    .reduce((sum, entry) => sum + entry.duration, 0)

  const totalHoursToday = timeEntries
    .filter((entry) => entry.date === new Date().toISOString().split("T")[0])
    .reduce((sum, entry) => sum + entry.duration, 0)

  const averageHoursPerDay =
    timeEntries.length > 0 ? timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / 7 : 0

  const handleStartTimer = () => {
    if (selectedTask) {
      setIsTracking(true)
      setCurrentTime(0)
    }
  }

  const handleStopTimer = () => {
    setIsTracking(false)
    if (currentTime > 0) {
      // Add time entry logic here
      console.log("Adding time entry:", {
        task: selectedTask,
        duration: currentTime / 3600, // Convert seconds to hours
        description: timeDescription,
      })
    }
    setCurrentTime(0)
    setTimeDescription("")
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Time Tracking</h1>
              <p className="text-slate-600 mt-1">Track your work hours and manage time entries</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={addTimeDialogOpen} onOpenChange={setAddTimeDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Manual Entry
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Time Entry</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="manual-task">Task</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a task" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeTasks.map((task) => (
                            <SelectItem key={task.id} value={task.id}>
                              {task.title} - {task.project}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input id="start-time" type="time" />
                      </div>
                      <div>
                        <Label htmlFor="end-time">End Time</Label>
                        <Input id="end-time" type="time" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div>
                      <Label htmlFor="manual-description">Description</Label>
                      <Textarea id="manual-description" placeholder="What did you work on?" rows={3} />
                    </div>
                    <Button className="w-full">Add Time Entry</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{formatDuration(totalHoursToday)}</p>
                <p className="text-sm text-slate-600">Today</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{formatDuration(totalHoursThisWeek)}</p>
                <p className="text-sm text-slate-600">This Week</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{formatDuration(averageHoursPerDay)}</p>
                <p className="text-sm text-slate-600">Daily Average</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50">
                <Target className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{timeEntries.length}</p>
                <p className="text-sm text-slate-600">Total Entries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Time Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-slate-900 mb-4">{formatTime(currentTime)}</div>
                {isTracking && (
                  <Badge className="bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Recording
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="task-select">Select Task</Label>
                  <Select value={selectedTask} onValueChange={setSelectedTask}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a task to track time for" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTasks.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title} - {task.project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="time-description">Description (Optional)</Label>
                  <Textarea
                    id="time-description"
                    value={timeDescription}
                    onChange={(e) => setTimeDescription(e.target.value)}
                    placeholder="What are you working on?"
                    rows={2}
                  />
                </div>

                <div className="flex justify-center gap-3">
                  {!isTracking ? (
                    <Button
                      onClick={handleStartTimer}
                      disabled={!selectedTask}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4" />
                      Start Timer
                    </Button>
                  ) : (
                    <>
                      <Button onClick={() => setIsTracking(false)} variant="outline" className="gap-2">
                        <Pause className="h-4 w-4" />
                        Pause
                      </Button>
                      <Button onClick={handleStopTimer} variant="destructive" className="gap-2">
                        <Square className="h-4 w-4" />
                        Stop & Save
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Time Entries */}
      <div className="flex-1 p-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Time Entries</h2>
            <div className="space-y-3">
              {timeEntries.map((entry) => (
                <Card key={entry.id} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="font-mono text-sm font-medium">{formatDuration(entry.duration)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{entry.task}</p>
                          <p className="text-sm text-slate-600">{entry.project}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <p className="text-slate-900">{entry.date}</p>
                          <p className="text-slate-600">
                            {entry.startTime} - {entry.endTime}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedEntry(entry)
                              setEditTimeDialogOpen(true)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {entry.description && <p className="text-sm text-slate-600 mt-2 ml-6">{entry.description}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {timeEntries.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No time entries yet</h3>
              <p className="text-slate-600">Start tracking your time or add a manual entry to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Time Dialog */}
      <Dialog open={editTimeDialogOpen} onOpenChange={setEditTimeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Time Entry</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-task">Task</Label>
                <Select defaultValue={selectedEntry.task}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTasks.map((task) => (
                      <SelectItem key={task.id} value={task.title}>
                        {task.title} - {task.project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-start-time">Start Time</Label>
                  <Input id="edit-start-time" type="time" defaultValue={selectedEntry.startTime} />
                </div>
                <div>
                  <Label htmlFor="edit-end-time">End Time</Label>
                  <Input id="edit-end-time" type="time" defaultValue={selectedEntry.endTime} />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input id="edit-date" type="date" defaultValue={selectedEntry.date} />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" defaultValue={selectedEntry.description} rows={3} />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">Save Changes</Button>
                <Button variant="outline" onClick={() => setEditTimeDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
