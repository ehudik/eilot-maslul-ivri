import { Link, useLocation } from "react-router-dom"; // שינוי: חזרה ל-react-router-dom
import { MapPin, Route, Users, FileText, ClipboardList, BarChart, Car } from "lucide-react";
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
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "מפת נהגים",
    url: "/",
    icon: MapPin,
    description: "מעקב מיקום בזמן אמת"
  },
  {
    title: "בקשת נסיעה חדשה",
    url: "/RequestRide", // נשאר /RequestRide כפי ששם הקובץ ב-pages
    icon: Car,
    description: "הזמנת נסיעה חדשה"
  },
  {
    title: "שיבוץ משימות",
    url: "/TaskAssignment", // נשאר /TaskAssignment כפי ששם הקובץ ב-pages
    icon: ClipboardList,
    description: "אופטימיזציה חכמה"
  },
  {
    title: "ניהול נהגים",
    url: "/DriverManagement", // נשאר /DriverManagement כפי ששם הקובץ ב-pages
    icon: Users,
    description: "תכנון לוח זמנים"
  },
  {
    title: "דוחות",
    url: "/Reports", // נשאר /Reports כפי ששם הקובץ ב-pages
    icon: FileText,
    description: "סיכומים ונתונים"
  },
  {
    title: "ניתוח ביצועים",
    url: "/PerformanceAnalytics", // נשאר /PerformanceAnalytics כפי ששם הקובץ ב-pages
    icon: BarChart,
    description: "מדדי ביצועים"
  },
];

export function AppSidebar() {
  const location = useLocation(); // שינוי: חזרה ל-useLocation מ-react-router-dom

  return (
    <Sidebar side="right" className="border-r border-sidebar-border bg-sidebar-custom shadow-xl" dir="rtl">
      <SidebarHeader className="border-b border-sidebar-border p-6 bg-gradient-to-b from-sidebar-header to-sidebar-custom">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 text-white shadow-lg">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="grid flex-1 text-right text-sm leading-tight">
            <span className="truncate font-bold text-lg text-sidebar-foreground">מערכת ניהול צי</span>
            <span className="truncate text-xs text-sidebar-muted">נהגים ומסלולים מתקדמים</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar-custom p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-right text-sidebar-foreground font-semibold mb-4 px-3">תפריט ראשי</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url} // חזרה ל-location.pathname
                    className="w-full justify-end hover:bg-sidebar-hover/80 data-[active=true]:bg-gradient-to-l data-[active=true]:from-sidebar-active data-[active=true]:to-sidebar-active/80 data-[active=true]:text-white rounded-xl p-4 transition-all duration-300 hover:shadow-md data-[active=true]:shadow-lg"
                  >
                    <Link to={item.url} className="flex items-center gap-4 text-sidebar-foreground hover:text-white data-[active=true]:text-white w-full">
                      <div className="text-right flex-1">
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-xs opacity-75">{item.description}</div>
                      </div>
                      <div className="bg-white/10 p-2 rounded-lg">
                        <item.icon className="h-5 w-5" />
                      </div>
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
