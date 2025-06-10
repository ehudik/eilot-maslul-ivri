
import * as React from "react"
import { Car, Map, Users, BarChart3, PlusCircle, Home, FileText, TrendingUp, Calendar, Navigation } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigate, useLocation } from "react-router-dom"

// Menu items
const items = [
  {
    title: "דף הבית",
    url: "/",
    icon: Home,
  },
  {
    title: "מרכז בקרת נסיעות",
    url: "/trip-control-center",
    icon: Navigation,
  },
  {
    title: "מפת נהגים",
    url: "/driver-map",
    icon: Map,
  },
  {
    title: "ניהול נהגים",
    url: "/driver-management",
    icon: Users,
  },
  {
    title: "בקשת נסיעה",
    url: "/request-ride",
    icon: PlusCircle,
  },
  {
    title: "דוחות מתקדמים",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "ניתוח ביצועים",
    url: "/performance-analytics",
    icon: TrendingUp,
  }
]

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Sidebar side="right" className="border-r">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <h2 className="text-xl font-bold">FleetPro</h2>
            <p className="text-sm text-muted-foreground">מערכת ניהול צי</p>
          </div>
          <div className="bg-primary p-2 rounded-lg">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-right">ניווט ראשי</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className="justify-end hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <button
                        onClick={() => navigate(item.url)}
                        className="flex items-center gap-3 w-full px-3 py-2 text-right"
                      >
                        <span>{item.title}</span>
                        <item.icon className="h-4 w-4" />
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6">
        <div className="text-center text-sm text-muted-foreground">
          <p>FleetPro v2.0</p>
          <p>מערכת ניהול צי מתקדמת</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
