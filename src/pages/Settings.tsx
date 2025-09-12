import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, 
  Bell, 
  Shield, 
  Download, 
  Trash2,
  Moon,
  Sun
} from "lucide-react"

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account preferences and app settings</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and university details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@university.edu" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input id="university" defaultValue="State University" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Academic Year</Label>
                <Select defaultValue="junior">
                  <SelectTrigger>
                    <SelectValue />
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

            <Button className="bg-primary hover:bg-primary-light">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sun className="h-5 w-5 mr-2" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how Nota looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred theme
                </p>
              </div>
              <ThemeToggle />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use a more compact layout to fit more content
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable smooth animations and transitions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about your documents and study progress
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Study Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminders to review your flashcards
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly summaries of your study activity
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Browser Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Show desktop notifications for important updates
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Manage your data and account security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>

            <Separator />

            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>

            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <Trash2 className="h-5 w-5 mr-2" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete your account and all associated data.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}