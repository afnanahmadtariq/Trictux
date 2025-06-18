"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { CompanySidebar } from "@/components/company-sidebar"
import { EmployeeSidebar } from "@/components/employee-sidebar"
import { usePathname } from "next/navigation"
import { AuthProvider, useAuth } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

// Wrapper component that uses auth context after it's created
function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  // Don't show sidebar on auth pages
  const isAuthPage = pathname.startsWith("/auth")

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isAuthPage) {
    return children
  }

  const getSidebar = () => {
    switch (user?.userType) {
      case "owner":
        return <AppSidebar />
      case "company":
        return <CompanySidebar />
      case "employee":
        return <EmployeeSidebar />
      default:
        return <AppSidebar />
    }
  }

  return (
    <SidebarProvider>
      {getSidebar()}
      <SidebarInset>
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </AuthProvider>
  )
}
