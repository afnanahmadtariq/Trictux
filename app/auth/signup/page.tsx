"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

function validatePassword(password: string) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password)
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "",
    name: "",            // For owner
    companyName: "",     // For company
    contactPerson: "",   // For company
    fullName: "",        // For employee
    position: "",        // For employee
    department: ""       // For employee
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.email || !formData.password || !formData.userType) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive",
      })
      return
    }

    if (!validatePassword(formData.password)) {
      toast({
        title: "Weak password",
        description:
          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
        variant: "destructive",
      })
      return
    }

    // Type-specific validation
    if (formData.userType === "owner" && !formData.name) {
      toast({
        title: "Missing information",
        description: "Please enter your name.",
        variant: "destructive",
      })
      return
    }

    if (formData.userType === "company" && (!formData.companyName || !formData.contactPerson)) {
      toast({
        title: "Missing information",
        description: "Please enter company name and contact person.",
        variant: "destructive",
      })
      return
    }

    if (formData.userType === "employee" && !formData.fullName) {
      toast({
        title: "Missing information",
        description: "Please enter your full name.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        toast({
          title: "Signup successful!",
          description: "Account created. Please log in.",
        })
        setTimeout(() => {
          router.push("/auth/login")
        }, 1200)
      } else {
        toast({
          title: "Signup failed",
          description: data.error || "Could not create account.",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
      console.error(err)
    }
    setIsLoading(false)
  }

  // Clear irrelevant fields when userType changes
  useEffect(() => {
    let updatedFormData = { ...formData }
    
    if (formData.userType === "owner") {
      updatedFormData = {
        ...updatedFormData,
        companyName: "",
        contactPerson: "",
        fullName: "",
        position: "",
        department: ""
      }
    } else if (formData.userType === "company") {
      updatedFormData = {
        ...updatedFormData,
        name: "",
        fullName: "",
        position: "",
        department: ""
      }
    } else if (formData.userType === "employee") {
      updatedFormData = {
        ...updatedFormData,
        name: "",
        companyName: "",
        contactPerson: ""
      }
    }
    
    setFormData(updatedFormData)
  }, [formData.userType])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Toaster />
      <Card className="w-full max-w-md border-slate-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Trictux</h1>
              <p className="text-sm text-slate-500">Smart Project Management</p>
            </div>
          </div>
          <CardTitle className="text-xl">Create Account</CardTitle>
          <p className="text-slate-600">Sign up for a new account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character.
              </p>
            </div>
            <div>
              <Label htmlFor="userType">User Type</Label>
              <Select
                value={formData.userType}
                onValueChange={(value) => setFormData({ ...formData, userType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Platform Owner</SelectItem>
                  <SelectItem value="company">Partner Company</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Owner specific fields */}
            {formData.userType === "owner" && (
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            {/* Company specific fields */}
            {formData.userType === "company" && (
              <>
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Enter contact person's name"
                    required
                  />
                </div>
              </>
            )}

            {/* Employee specific fields */}
            {formData.userType === "employee" && (
              <>
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position (Optional)</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Enter your position"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Enter your department"
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>  )
}
