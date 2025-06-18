"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function LogoutButton() {
  const { logout } = useAuth()

  return (
    <Button 
      onClick={logout}
      variant="ghost" 
      size="sm"
      className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  )
}
