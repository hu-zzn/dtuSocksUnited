"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useAuth } from "../../context/auth-context"


export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(formData.email, formData.password);
      router.refresh(); // ✅ Reloads the page + re-fetches data
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-sm shadow-md border-none rounded-2xl">
        <CardHeader className="text-center mt-6 space-y-1">
          <CardTitle className="text-2xl font-semibold text-gray-800">Welcome User!</CardTitle>
          <CardDescription className="text-sm text-gray-500">Please Login to Continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Phone */}
            <div className="relative">
              <Input
                type="text"
                name="email"
                placeholder="Email / Mobile Number"
                value={formData.email}
                onChange={handleChange}
                className="h-12 rounded-full pl-5 border border-gray-300"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="h-12 rounded-full pl-5 pr-10 border border-gray-300"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </Button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-black">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-full bg-gradient-to-r from-black to-gray-800 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/register" className="text-black font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
