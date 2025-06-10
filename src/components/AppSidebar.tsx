
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { 
  Home, 
  Map, 
  Users, 
  FileText, 
  BarChart3, 
  Car,
  LogIn,
  Settings,
  HelpCircle
} from "lucide-react"

const menuItems = [
  {
    title: "עמוד הבית",
    url: "/",
    icon: Home,
  },
  {
    title: "לוח בקרה",
    url: "/driver-map",
    icon: Map,
  },
  {
    title: "ניהול נהגים",
    url: "/driver-management",
    icon: Users,
  },
  {
    title: "דוחות",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "ניתוח ביצועים",
    url: "/performance-analytics",
    icon: BarChart3,
  },
  {
    title: "בקשת נסיעה",
    url: "/request-ride",
    icon: Car,
  },
];

const bottomMenuItems = [
  {
    title: "התחברות",
    url: "/login",
    icon: LogIn,
  },
  {
    title: "הגדרות",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "עזרה",
    url: "/help",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const location = useLocation();

  const isActive = (url: string) => {
    if (url === "/" && location.pathname === "/") return true;
    if (url !== "/" && location.pathname.startsWith(url)) return true;
    return false;
  };

  return (
    <Sidebar className="border-l border-border/40">
      <SidebarHeader className="p-6 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold text-foreground">מערכת ניהול צי</h2>
            <p className="text-sm text-muted-foreground">מוני סיטון בע״מ</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-right text-muted-foreground">תפריט ראשי</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="text-right hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/40">
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={isActive(item.url)}
                className="text-right hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
