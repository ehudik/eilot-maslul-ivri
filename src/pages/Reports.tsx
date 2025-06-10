
import React, { useState } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, FileText, Download, TrendingUp, Clock, Users, Car, AlertTriangle, CheckCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { mockDrivers } from "@/data/mockDrivers";
import { mockDriverWorkHours } from "@/data/mockDriverWorkHours";

const Reports = () => {
  const [currentTime] = useState(new Date());
  
  // Mock data for charts
  const weeklyPerformance = [
    { day: 'א', trips: 45, hours: 8.2, efficiency: 85 },
    { day: 'ב', trips: 52, hours: 9.1, efficiency: 88 },
    { day: 'ג', trips: 48, hours: 8.7, efficiency: 82 },
    { day: 'ד', trips: 61, hours: 9.5, efficiency: 91 },
    { day: 'ה', trips: 58, hours: 9.2, efficiency: 89 },
    { day: 'ו', trips: 35, hours: 6.8, efficiency: 78 },
    { day: 'ש', trips: 28, hours: 5.5, efficiency: 75 }
  ];

  const monthlyStats = [
    { month: 'ינואר', revenue: 125000, trips: 1240, drivers: 15 },
    { month: 'פברואר', revenue: 138000, trips: 1350, drivers: 16 },
    { month: 'מרץ', revenue: 142000, trips: 1420, drivers: 17 },
    { month: 'אפריל', revenue: 156000, trips: 1580, drivers: 18 },
    { month: 'מאי', revenue: 164000, trips: 1640, drivers: 18 },
    { month: 'יוני', revenue: 171000, trips: 1710, drivers: 19 }
  ];

  const driverStatusData = [
    { name: 'פעילים', value: 14, color: '#22c55e' },
    { name: 'בהפסקה', value: 3, color: '#f59e0b' },
    { name: 'במנוחה', value: 2, color: '#ef4444' },
    { name: 'לא זמינים', value: 1, color: '#6b7280' }
  ];

  const complianceData = [
    { category: 'שעות נהיגה', compliance: 92, violations: 8 },
    { category: 'זמני מנוחה', compliance: 88, violations: 12 },
    { category: 'הפסקות חובה', compliance: 95, violations: 5 },
    { category: 'בדיקות רכב', compliance: 98, violations: 2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">דוחות מתקדמים</h1>
                <p className="text-sm text-muted-foreground">ניתוח ביצועים וסטטיסטיקות צי</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm border-primary/20 bg-primary/5">
              <Clock className="h-4 w-4 ml-1 text-primary" />
              {currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
            </Badge>
            <Button variant="outline" className="enhanced-button">
              <Download className="h-4 w-4 ml-2" />
              יצוא דוחות
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="enhanced-card border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">1,847</div>
                  <div className="text-sm text-muted-foreground">נסיעות החודש</div>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <Car className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+12% מהחודש הקודם</span>
              </div>
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">₪187,340</div>
                  <div className="text-sm text-muted-foreground">הכנסות החודש</div>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-600">+8% מהחודש הקודם</span>
              </div>
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <div className="text-sm text-muted-foreground">ציות לחוקים</div>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle className="h-3 w-3 text-purple-600" />
                <span className="text-xs text-purple-600">ציון מעולה</span>
              </div>
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">8.7</div>
                  <div className="text-sm text-muted-foreground">שעות עבודה ממוצע</div>
                </div>
                <div className="bg-orange-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="h-3 w-3 text-orange-600" />
                <span className="text-xs text-orange-600">בטווח מומלץ</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different reports */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">ביצועים</TabsTrigger>
            <TabsTrigger value="compliance">ציות</TabsTrigger>
            <TabsTrigger value="financial">כספיים</TabsTrigger>
            <TabsTrigger value="drivers">נהגים</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="enhanced-card">
                <CardHeader>
                  <CardTitle className="text-right">ביצועי שבוע</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="trips" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="efficiency" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="enhanced-card">
                <CardHeader>
                  <CardTitle className="text-right">סטטוס נהגים</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={driverStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {driverStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card className="enhanced-card">
              <CardHeader>
                <CardTitle className="text-right">ציות לחוקים לפי קטגוריה</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={complianceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="compliance" fill="#22c55e" />
                    <Bar dataKey="violations" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card className="enhanced-card">
              <CardHeader>
                <CardTitle className="text-right">הכנסות חודשיות</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {mockDrivers.slice(0, 6).map((driver) => (
                <Card key={driver.driver_id} className="enhanced-card">
                  <CardHeader>
                    <CardTitle className="text-right text-lg">{driver.driver_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">סטטוס</span>
                      <Badge variant={driver.status === 'available' ? 'default' : 'secondary'}>
                        {driver.status === 'available' ? 'זמין' : 
                         driver.status === 'busy' ? 'עסוק' : 'לא זמין'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">רכב</span>
                      <span className="text-sm">{driver.vehicle?.license_plate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">דירוג</span>
                      <span className="text-sm font-semibold">{driver.rating}/5</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
