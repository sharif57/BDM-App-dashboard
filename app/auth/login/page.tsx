"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function Component() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Sign in attempt:", { email, password, rememberMe })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#000209E5] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#2c2e33] rounded-lg p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-4xl font-semibold text-white text-center">Sign In</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#4a4d55] border-[#5a5d65] text-white placeholder:text-gray-400 p-4 rounded-full focus:border-green-500 focus:ring-green-500/20 h-11"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2 relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#4a4d55] border-[#5a5d65] rounded-full text-white p-4 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20 h-11 pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2  -translate-y-5 h-auto p-1 text-gray-400 hover:text-white hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-gray-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <label htmlFor="remember" className="text-gray-300 cursor-pointer">
                Remember me
              </label>
            </div>
            <Link href="/auth/forgot-password" className="text-gray-300 hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#44B46E] hover:bg-green-600 rounded-full text-white font-medium h-11  transition-colors"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

     
        </form>
      </div>
    </div>
  )
}
