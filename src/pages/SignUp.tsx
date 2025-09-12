import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Eye, EyeOff } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    year: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log("Signup attempt:", formData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      {/* Theme toggle in top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <Card className="bg-background/95 backdrop-blur border-border/50 shadow-elegant">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
                <GraduationCap className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gradient-primary">Join Nota</CardTitle>
            <CardDescription>
              Create your account and start studying smarter
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    placeholder="State University"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Academic Year</Label>
                  <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freshman">Freshman</SelectItem>
                      <SelectItem value="sophomore">Sophomore</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="bg-background pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="bg-background pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 rounded border-border"
                  required
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:text-primary-light">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary-light">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary-light">
                Create Account
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" type="button">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 1c4.97 0 9 4.03 9 9 0 4.17-2.84 7.66-6.69 8.69l-.31-.12c-.5-.2-.72-.5-.72-1.07v-1.54c2.14-.51 3.74-2.29 3.74-4.46 0-2.49-2.01-4.5-4.5-4.5S7.5 9.01 7.5 11.5c0 2.17 1.6 3.95 3.74 4.46v1.54c0 .57-.22.87-.72 1.07l-.31.12C4.84 17.66 2 14.17 2 10c0-4.97 4.03-9 9-9z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:text-primary-light font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}