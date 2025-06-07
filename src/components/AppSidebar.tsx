
import { Link, useLocation } from "react-router-dom";
import { MapPin, Route, Users, FileText, ClipboardList, BarChart } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "מפת נהגים",
    url: "/",
    icon: MapPin,
  },
  {
    title: "שיבוץ משימות",
    url: "/task-assignment",
    icon: ClipboardList,
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
    icon: BarChart,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar side="right" className="border-r border-sidebar-border bg-sidebar-custom">
      <SidebarHeader className="border-b border-sidebar-border p-4 bg-sidebar-header">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-white">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-right text-sm leading-tight">
            <span className="truncate font-semibold text-sidebar-foreground">מערכת ניהול צי</span>
            <span className="truncate text-xs text-sidebar-muted">נהגים ומסלולים</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar-custom">
        <SidebarGroup>
          <SidebarGroupLabel className="text-right text-sidebar-foreground">תפריט ראשי</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="w-full justify-end hover:bg-sidebar-hover data-[active=true]:bg-sidebar-active data-[active=true]:text-white"
                  >
                    <Link to={item.url} className="flex items-center gap-3 text-sidebar-foreground hover:text-white">
                      <span className="text-right">{item.title}</span>
                      <item.icon className="h-4 w-4" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
