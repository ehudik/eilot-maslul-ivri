
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Map, Users, BarChart3, PlusCircle, FileText, TrendingUp, Navigation, ArrowLeft, Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDrivers } from "@/data/mockDrivers";
import { mockTrips } from "@/data/mockTrips";

const HomePage = () => {
  const navigate = useNavigate();

  // Calculate real-time stats
  const activeDrivers = mockDrivers.filter(d => d.status === 'available' || d.status === 'on-trip').length;
  const activeTrips = mockTrips.filter(t => t.status === 'active').length;
  const pendingTrips = mockTrips.filter(t => t.status === 'open').length;
  const completedToday = mockTrips.filter(t => t.status === 'completed').length;

  const quickActions = [
    {
      title: "מרכז בקרת נסיעות",
      description: "ניהול וניטור כל הנסיעות במערכת",
      icon: Navigation,
      color: "blue",
      path: "/trip-control-center",
      stats: `${mockTrips.length} נסיעות במערכת`
    },
    {
      title: "בקשת נסיעה חדשה",
      description: "הוספת נסיעה וחיפוש נהגים זמינים",
      icon: PlusCircle,
      color: "green",
      path: "/request-ride",
      stats: "שיבוץ מיידי"
    },
    {
      title: "מפת נהגים",
      description: "צפייה במיקום נהגים בזמן אמת",
      icon: Map,
      color: "purple",
      path: "/driver-map",
      stats: `${activeDrivers} נהגים פעילים`
    },
    {
      title: "ניהול נהגים",
      description: "לוח זמנים ומעקב שעות עבודה",
      icon: Users,
      color: "orange",
      path: "/driver-management",
      stats: `${mockDrivers.length} נהגים במערכת`
    },
    {
      title: "דוחות מתקדמים",
      description: "ניתוח ביצועים וסטטיסטיקות",
      icon: FileText,
      color: "indigo",
      path: "/reports",
      stats: "דוחות בזמן אמת"
    },
    {
      title: "ניתוח ביצועים",
      description: "מדדי KPI ומגמות ביצועים",
      icon: TrendingUp,
      color: "pink",
      path: "/performance-analytics",
      stats: "תרשימים אינטראקטיביים"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "border-l-blue-500 hover:bg-blue-50",
      green: "border-l-green-500 hover:bg-green-50",
      purple: "border-l-purple-500 hover:bg-purple-50",
      orange: "border-l-orange-500 hover:bg-orange-50",
      indigo: "border-l-indigo-500 hover:bg-indigo-50",
      pink: "border-l-pink-500 hover:bg-pink-50"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      indigo: "bg-indigo-100 text-indigo-600",
      pink: "bg-pink-100 text-pink-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">FleetPro</h1>
                <p className="text-lg text-muted-foreground">מערכת ניהול צי מתקדמת</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm border-primary/20 bg-primary/5">
              <Clock className="h-4 w-4 ml-1 text-primary" />
              {new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Status Overview */}
        <div className="mb-8">
          <Card className="enhanced-card">
            <CardHeader>
              <CardTitle className="text-right text-xl">סטטוס מערכת</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{activeDrivers}</div>
                  <div className="text-sm text-muted-foreground">נהגים פעילים</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{activeTrips}</div>
                  <div className="text-sm text-muted-foreground">נסיעות פעילות</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{pendingTrips}</div>
                  <div className="text-sm text-muted-foreground">נסיעות ממתינות</div>
                  {pendingTrips > 0 && <AlertTriangle className="h-4 w-4 text-orange-600 mx-auto mt-1" />}
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{completedToday}</div>
                  <div className="text-sm text-muted-foreground">הושלמו היום</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">ברוכים הבאים למערכת FleetPro</h2>
            <p className="text-xl text-muted-foreground mb-6">
              מערכת ניהול צי מתקדמת עם דגש על ציות לחוקי עבודה ומנוחה לנהגים
            </p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">גישה מהירה לכלי המערכת</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Card 
                key={action.path}
                className={`enhanced-card border-l-4 ${getColorClasses(action.color)} cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105`}
                onClick={() => navigate(action.path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${getIconColorClasses(action.color)}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-right text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-right mb-3">
                    {action.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {action.stats}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(action.path);
                      }}
                      className="enhanced-button"
                    >
                      פתח
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Highlight */}
        <div className="mb-8">
          <Card className="enhanced-card">
            <CardHeader>
              <CardTitle className="text-right text-xl">תכונות מתקדמות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-3">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">מעקב שעות עבודה</h4>
                  <p className="text-sm text-muted-foreground">
                    מעקב אוטומטי אחר שעות עבודה ומנוחה בהתאם לחוקי העבודה בישראל
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-3">
                    <Map className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">ניטור בזמן אמת</h4>
                  <p className="text-sm text-muted-foreground">
                    מעקב אחר מיקום נהגים ונסיעות על גבי מפה אינטראקטיבית
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-3">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">דוחות מתקדמים</h4>
                  <p className="text-sm text-muted-foreground">
                    ניתוח ביצועים מעמיק עם גרפים אינטראקטיביים ומדדי KPI
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
