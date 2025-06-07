
import { Link, useLocation } from "react-router-dom";
import { MapPin, Route, Users, FileText, Menu } from "lucide-react";
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
    title: "חישוב מסלול",
    url: "/route-calculation",
    icon: Route,
  },
  {
    title: "ניהול נהגים",
    url: "#",
    icon: Users,
  },
  {
    title: "דוחות",
    url: "#",
    icon: FileText,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-l border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-right text-sm leading-tight">
            <span className="truncate font-semibold">מערכת ניהול</span>
            <span className="truncate text-xs text-sidebar-foreground/70">נהגים ומסלולים</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-right">תפריט ראשי</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="w-full justify-end"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
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
