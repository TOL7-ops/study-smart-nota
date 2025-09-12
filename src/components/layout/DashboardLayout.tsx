import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top header */}
          <header className="h-16 flex items-center justify-between border-b bg-background/95 backdrop-blur px-4 lg:px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search documents, flashcards..."
                  className="w-64 pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bell className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              <div className="h-8 w-8 rounded-full bg-gradient-primary" />
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}