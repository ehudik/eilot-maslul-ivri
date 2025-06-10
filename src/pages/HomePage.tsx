
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Users, MapPin, TrendingUp, Clock, Shield, BarChart3, Calendar, AlertTriangle, Coffee } from 'lucide-react';
import { mockDrivers } from '@/data/mockDrivers';
import { mockDriverWorkHours, getDriversNeedingBreak, getDriversNeedingRest, getComplianceViolations } from '@/data/mockDriverWorkHours';

const HomePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Calculate real-time statistics
  const activeDriversCount = mockDrivers.filter(d => d.status === 'available' || d.status === 'busy' || d.status === 'on-trip').length;
  const driversNeedingBreak = getDriversNeedingBreak();
  const driversNeedingRest = getDriversNeedingRest();
  const complianceViolations = getComplianceViolations();
  const avgWorkHours = mockDriverWorkHours.reduce((sum, driver) => sum + (driver.daily_work_time / 60), 0) / mockDriverWorkHours.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">טוען מערכת...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">מערכת ניהול צי</h1>
                <p className="text-muted-foreground">מוני סיטון בע״מ</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm border-primary/20 bg-primary/5">
              <Clock className="h-4 w-4 ml-1 text-primary" />
              {currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-foreground mb-4">
            ברוכים הבאים למערכת ניהול הצי המתקדמת
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            פלטפורמה מתקדמת לניהול אפקטיבי של נהגי הצי, תכנון אופטימלי של מסלולי נסיעה, 
            הגשת בקשות נסיעה, וניתוח שוטף של ביצועי הצי בזמן אמת עם מעקב אחר ציות לחוקים
          </p>
        </div>

        {/* Live Statistics Dashboard */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            סטטיסטיקות בזמן אמת
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="enhanced-card border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{activeDriversCount}</div>
                    <div className="text-sm text-muted-foreground">נהגים פעילים</div>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="enhanced-card border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{mockDrivers.length}</div>
                    <div className="text-sm text-muted-foreground">סה״כ נהגים</div>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="enhanced-card border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{driversNeedingBreak.length}</div>
                    <div className="text-sm text-muted-foreground">נדרשת הפסקה</div>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Coffee className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="enhanced-card border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-600">{driversNeedingRest.length}</div>
                    <div className="text-sm text-muted-foreground">נדרשת מנוחה</div>
                  </div>
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="enhanced-card border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{avgWorkHours.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">ממוצע שעות</div>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Request Ride Card */}
          <Card className="enhanced-card group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  בקשת נסיעה
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                הזמן נסיעה חדשה עם התאמה אוטומטית לנהג הטוב ביותר
              </p>
            </CardHeader>
            <CardFooter>
              <Button
                asChild
                className="w-full enhanced-button group-hover:scale-105 transition-transform"
                size="lg"
              >
                <Link to="/request-ride">
                  <Car className="h-4 w-4 ml-2" />
                  בצע בקשה
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Driver Management Card */}
          <Card className="enhanced-card group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  ניהול נהגים
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                נהל את לוח הזמנים, המשימות וציות לחוקים
              </p>
            </CardHeader>
            <CardFooter>
              <Button
                asChild
                variant="outline"
                className="w-full enhanced-button group-hover:scale-105 transition-transform border-green-500 text-green-600 hover:bg-green-50"
                size="lg"
              >
                <Link to="/driver-management">
                  <Calendar className="h-4 w-4 ml-2" />
                  נהל צי
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Driver Map Card */}
          <Card className="enhanced-card group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  לוח בקרה
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                מפת נהגים בזמן אמת עם ניטור וסטטיסטיקות
              </p>
            </CardHeader>
            <CardFooter>
              <Button
                asChild
                variant="outline"
                className="w-full enhanced-button group-hover:scale-105 transition-transform border-blue-500 text-blue-600 hover:bg-blue-50"
                size="lg"
              >
                <Link to="/driver-map">
                  <MapPin className="h-4 w-4 ml-2" />
                  צפה במפה
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Performance Analytics Card */}
          <Card className="enhanced-card group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  ניתוח ביצועים
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                דוחות מתקדמים וחיזוי ביצועי הצי
              </p>
            </CardHeader>
            <CardFooter>
              <Button
                asChild
                variant="outline"
                className="w-full enhanced-button group-hover:scale-105 transition-transform border-purple-500 text-purple-600 hover:bg-purple-50"
                size="lg"
              >
                <Link to="/performance-analytics">
                  <TrendingUp className="h-4 w-4 ml-2" />
                  צפה בדוחות
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Compliance Alerts */}
        {(driversNeedingBreak.length > 0 || driversNeedingRest.length > 0 || complianceViolations.length > 0) && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
              התראות ציות
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {driversNeedingBreak.length > 0 && (
                <Card className="enhanced-card border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Coffee className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-600">נדרשת הפסקה</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {driversNeedingBreak.length} נהגים צריכים הפסקה חובה
                    </p>
                  </CardContent>
                </Card>
              )}

              {driversNeedingRest.length > 0 && (
                <Card className="enhanced-card border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-red-600">נדרשת מנוחה</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {driversNeedingRest.length} נהגים צריכים מנוחה יומית/שבועית
                    </p>
                  </CardContent>
                </Card>
              )}

              {complianceViolations.length > 0 && (
                <Card className="enhanced-card border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-purple-600">הפרות ציות</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {complianceViolations.length} נהגים עם הפרות חוקיות
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Quick Access Footer */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            גישה מהירה לכלי הניהול העיקריים
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline">ניהול בזמן אמת</Badge>
            <Badge variant="outline">ציות לחוקים</Badge>
            <Badge variant="outline">ניתוח מתקדם</Badge>
            <Badge variant="outline">אופטימיזציה אוטומטית</Badge>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
