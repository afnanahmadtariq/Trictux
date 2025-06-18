"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { CompanySidebar } from "@/components/company-sidebar"
import { EmployeeSidebar } from "@/components/employee-sidebar"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      setUserRole(userData.role)
    }
    setIsLoading(false)
  }, [])

  // Don't show sidebar on auth pages
  const isAuthPage = pathname.startsWith("/auth")

  if (isLoading) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </body>
      </html>
    )
  }

  if (isAuthPage) {
    return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    )
  }

  // Redirect to login if not authenticated
  if (!userRole && !isAuthPage) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login"
    }
    return null
  }

  const getSidebar = () => {
    switch (userRole) {
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
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          {getSidebar()}
          <SidebarInset>
            <main className="flex-1 overflow-auto">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
