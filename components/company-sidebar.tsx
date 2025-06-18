"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import { Building2, Users, FolderKanban, MessageSquare, Settings, Search, Home, Target, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarInput,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const navigationItems = [
  {
    title: "Dashboard",
    items: [{ title: "Overview", url: "/company-dashboard", icon: Home }],
  },
  {
    title: "Project Management",
    items: [
      { title: "Assigned Projects", url: "/company-dashboard/projects", icon: FolderKanban },
      { title: "Task Assignment", url: "/company-dashboard/tasks", icon: Target },
    ],
  },
  {
    title: "Team",
    items: [
      { title: "Team Members", url: "/company-dashboard/team", icon: Users },
      { title: "Clients", url: "/company-dashboard/clients", icon: MessageSquare },
    ],
  },
  {
    title: "System",
    items: [{ title: "Settings", url: "/company-dashboard/settings", icon: Settings }],
  },
]

export function CompanySidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/auth/login"
  }

  return (
    <Sidebar {...props} className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-600">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Company B</h1>
            <p className="text-xs text-slate-500">Partner Dashboard</p>
          </div>
        </div>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <SidebarInput placeholder="Search..." className="pl-9 bg-slate-50 border-slate-200" />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-slate-600 font-medium text-xs uppercase tracking-wider">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} className="hover:bg-slate-100">
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-slate-200">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
