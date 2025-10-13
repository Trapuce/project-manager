"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Users,
  Calendar,
  Settings,
  LogOut,
  User,
  BarChart3,
} from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { motion } from "framer-motion"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projets", href: "/dashboard/projects", icon: FolderOpen },
  { name: "Tâches", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Équipe", href: "/dashboard/users", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Calendrier", href: "/dashboard/calendar", icon: Calendar },
]

const userNavigation = [
  { name: "Profil", href: "/dashboard/profile", icon: User },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      // Erreur silencieuse lors de la déconnexion
    }
  }

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary">ProjectHub</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-foreground hover:text-foreground transition-all duration-200",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-4 space-y-2">
        {userNavigation.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (navigation.length + index) * 0.1 }}
            >
              <Link href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-foreground hover:text-foreground transition-all duration-200",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            </motion.div>
          )
        })}

        <div className="flex items-center space-x-3 p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">
              {user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user?.role || 'MEMBER'}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}
