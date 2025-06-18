"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Phone, Video, MoreHorizontal, Search, Users, Hash, Bell, Settings, Paperclip, Smile } from "lucide-react"

const teamMembers = [
  {
    id: "user-1",
    name: "Sarah Johnson",
    role: "Project Manager",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "online",
    lastSeen: "now",
  },
  {
    id: "user-2",
    name: "David Chen",
    role: "Senior Developer",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "online",
    lastSeen: "2 min ago",
  },
  {
    id: "user-3",
    name: "Emma Wilson",
    role: "UI/UX Designer",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "away",
    lastSeen: "15 min ago",
  },
  {
    id: "user-4",
    name: "Alex Rodriguez",
    role: "Backend Developer",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "offline",
    lastSeen: "2 hours ago",
  },
]

const channels = [
  { id: "general", name: "general", type: "channel", unread: 3 },
  { id: "project-updates", name: "project-updates", type: "channel", unread: 0 },
  { id: "random", name: "random", type: "channel", unread: 1 },
  { id: "frontend-team", name: "frontend-team", type: "channel", unread: 0 },
]

const messages = [
  {
    id: "msg-1",
    sender: "Sarah Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "Hey team! Just wanted to update everyone on the project progress. We're on track for the milestone delivery this Friday.",
    timestamp: "10:30 AM",
    type: "text",
  },
  {
    id: "msg-2",
    sender: "Mike Davis",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "Great! I've completed the frontend components and uploaded them to the project. Ready for review.",
    timestamp: "10:32 AM",
    type: "text",
  },
  {
    id: "msg-3",
    sender: "David Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "Perfect timing! I'll review the components this afternoon and provide feedback.",
    timestamp: "10:35 AM",
    type: "text",
  },
  {
    id: "msg-4",
    sender: "Emma Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "I've also updated the design system documentation. Link: design-system-v2.pdf",
    timestamp: "10:40 AM",
    type: "file",
  },
  {
    id: "msg-5",
    sender: "Sarah Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "Excellent work everyone! Let's schedule a quick sync tomorrow to discuss the next phase.",
    timestamp: "10:45 AM",
    type: "text",
  },
]

export default function TeamChatPage() {
  const [selectedChannel, setSelectedChannel] = useState("general")
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-slate-400"
      default:
        return "bg-slate-400"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Team Chat</h1>
              <p className="text-slate-600 mt-1">Communicate with your team members</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Phone className="h-4 w-4" />
                Voice Call
              </Button>
              <Button variant="outline" className="gap-2">
                <Video className="h-4 w-4" />
                Video Call
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-200 bg-white">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Tabs defaultValue="channels" className="flex-1">
            <TabsList className="grid w-full grid-cols-2 m-4">
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
            </TabsList>

            <TabsContent value="channels" className="px-4 space-y-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-50 ${
                    selectedChannel === channel.id ? "bg-blue-50 text-blue-700" : "text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">{channel.name}</span>
                  </div>
                  {channel.unread > 0 && <Badge className="bg-red-500 text-white text-xs">{channel.unread}</Badge>}
                </button>
              ))}
            </TabsContent>

            <TabsContent value="people" className="px-4 space-y-2">
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  className="w-full flex items-center gap-3 p-2 rounded-lg text-left hover:bg-slate-50"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{member.name}</p>
                    <p className="text-xs text-slate-500 truncate">{member.role}</p>
                  </div>
                  <span className="text-xs text-slate-400">{member.lastSeen}</span>
                </button>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="border-b border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-slate-400" />
                <div>
                  <h2 className="font-semibold text-slate-900">{selectedChannel}</h2>
                  <p className="text-sm text-slate-500">{teamMembers.length} members</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                  <AvatarFallback>
                    {message.sender
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900">{message.sender}</span>
                    <span className="text-xs text-slate-500">{message.timestamp}</span>
                  </div>
                  <div className="text-slate-700">
                    {message.type === "file" ? (
                      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border">
                        <Paperclip className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{message.content}</span>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-slate-200 bg-white p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${selectedChannel}`}
                  rows={1}
                  className="resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="gap-2">
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
