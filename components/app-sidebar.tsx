"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import {
  Building2,
  Users,
  FolderKanban,
  BarChart3,
  Settings,
  Zap,
  Clock,
  Search,
  Home,
  UserCheck,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const navigationItems = [
  {
    title: "Dashboard",
    items: [
      { title: "Overview", url: "/", icon: Home },
      { title: "Analytics", url: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Client Management",
    items: [
      {
        title: "Clients",
        url: "/clients",
        icon: Users,
        subItems: [
          { title: "All Clients", url: "/clients" },
          { title: "Add Client", url: "/clients/add" },
        ],
      },
    ],
  },
  {
    title: "Project Management",
    items: [
      {
        title: "Projects",
        url: "/projects",
        icon: FolderKanban,
        subItems: [
          { title: "All Projects", url: "/projects" },
          { title: "Create Project", url: "/projects/create" },
        ],
      },
      { title: "Assignment Engine", url: "/assignment", icon: Zap },
      { title: "Status Tracking", url: "/status", icon: Clock },
    ],
  },
  {
    title: "Company Network",
    items: [
      {
        title: "Companies",
        url: "/companies",
        icon: Building2,
        subItems: [
          { title: "Overview", url: "/companies" },
          { title: "Performance", url: "/companies/performance" },
          { title: "Workload", url: "/companies/workload" },
          { title: "Skills Matrix", url: "/companies/skills" },
        ],
      },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Settings", url: "/settings", icon: Settings },
      { title: "Users", url: "/users", icon: UserCheck },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/auth/login"
  }

  return (
    <Sidebar {...props} className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Trictux</h1>
            <p className="text-xs text-slate-500">Smart Project Management</p>
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
                    {item.subItems ? (
                      <Collapsible defaultOpen={pathname.startsWith(item.url)}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="hover:bg-slate-100 group">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                  <a href={subItem.url}>{subItem.title}</a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton asChild isActive={pathname === item.url} className="hover:bg-slate-100">
                        <a href={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
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
