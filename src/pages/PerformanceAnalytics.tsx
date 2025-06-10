
import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, Filter, TrendingUp, TrendingDown, AlertTriangle, Clock, Users, Car, MapPin } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer, Area, AreaChart } from "recharts";

// Enhanced mock performance data with compliance metrics
const mockPerformanceData = [
  { date: "2024-01-01", period: "יום א", totalDistance: 245, fuelWaste: 12.5, drivingTime: 480, tasksCompleted: 8, complianceScore: 92 },
  { date: "2024-01-02", period: "יום ב", totalDistance: 320, fuelWaste: 18.2, drivingTime: 520, tasksCompleted: 12, complianceScore: 88 },
  { date: "2024-01-03", period: "יום ג", totalDistance: 280, fuelWaste: 15.8, drivingTime: 465, tasksCompleted: 10, complianceScore: 95 },
  { date: "2024-01-04", period: "יום ד", totalDistance: 190, fuelWaste: 9.3, drivingTime: 390, tasksCompleted: 6, complianceScore: 98 },
  { date: "2024-01-05", period: "יום ה", totalDistance: 365, fuelWaste: 21.4, drivingTime: 580, tasksCompleted: 15, complianceScore: 85 },
  { date: "2024-01-06", period: "יום ו", totalDistance: 420, fuelWaste: 24.1, drivingTime: 620, tasksCompleted: 18, complianceScore: 82 },
  { date: "2024-01-07", period: "שבת", totalDistance: 150, fuelWaste: 7.2, drivingTime: 280, tasksCompleted: 4, complianceScore: 100 },
];

const mockDriverPerformance = [
  { name: "דוד כהן", distance: 1250, tasks: 45, efficiency: 92, workHours: 48, complianceIssues: 0 },
  { name: "משה לוי", distance: 980, tasks: 38, efficiency: 88, workHours: 52, complianceIssues: 2 },
  { name: "יוסי אברהם", distance: 1420, tasks: 52, efficiency: 95, workHours: 46, complianceIssues: 0 },
  { name: "אבי דוד", distance: 760, tasks: 28, efficiency: 85, workHours: 44, complianceIssues: 1 },
  { name: "רון שמואל", distance: 1180, tasks: 41, efficiency: 90, workHours: 50, complianceIssues: 1 },
];

const chartConfig = {
  totalDistance: {
    label: "מרחק כולל (ק״מ)",
    color: "hsl(var(--primary))",
  },
  fuelWaste: {
    label: "בזבוז דלק (ליטר)",
    color: "hsl(var(--destructive))",
  },
  drivingTime: {
    label: "זמן נסיעה (דקות)",
    color: "hsl(var(--chart-3))",
  },
  tasksCompleted: {
    label: "משימות שהושלמו",
    color: "hsl(var(--chart-4))",
  },
  complianceScore: {
    label: "ציון ציות (%)",
    color: "hsl(var(--chart-2))",
  },
};

const PerformanceAnalytics = () => {
  const [timeRange, setTimeRange] = useState("יומי");
  const [selectedDrivers, setSelectedDrivers] = useState("all");
  const [selectedAreas, setSelectedAreas] = useState("all");
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState("all");

  const totalKm = mockPerformanceData.reduce((sum, day) => sum + day.totalDistance, 0);
  const totalFuel = mockPerformanceData.reduce((sum, day) => sum + day.fuelWaste, 0);
  const totalHours = Math.round(mockPerformanceData.reduce((sum, day) => sum + day.drivingTime, 0) / 60);
  const totalTasks = mockPerformanceData.reduce((sum, day) => sum + day.tasksCompleted, 0);
  const avgCompliance = Math.round(mockPerformanceData.reduce((sum, day) => sum + day.complianceScore, 0) / mockPerformanceData.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
      <header className="border-b border-border/50 p-6 bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">ניתוח ביצועים מתקדם</h1>
          </div>
        </div>
      </header>
      
      <div className="p-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="enhanced-card border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-primary">{totalKm.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mt-1">סה״כ ק״מ השבוע</div>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600">+12% מהשבוע הקודם</span>
              </div>
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-orange-600">{totalFuel.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground mt-1">בזבוז דלק (ליטר)</div>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600">-8% מהשבוע הקודם</span>
              </div>
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{totalHours}</div>
                  <div className="text-sm text-muted-foreground mt-1">שעות נסיעה</div>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <TrendingUp className="h-4 w-4 text-red-600" />
                <span className="text-xs text-red-600">+5% מהשבוע הקודם</span>
              </div>
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600">{totalTasks}</div>
                  <div className="text-sm text-muted-foreground mt-1">משימות שהושלמו</div>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Car className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600">+18% מהשבוע הקודם</span>
              </div>
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-purple-600">{avgCompliance}%</div>
                  <div className="text-sm text-muted-foreground mt-1">ציות לחוקים</div>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600">+3% מהשבוע הקודם</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Date Range Section */}
        <Card className="enhanced-card">
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2 justify-end">
              <Filter className="h-5 w-5 text-primary" />
              מסננים ובחירת טווח זמן
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-right block text-sm font-medium">טווח זמן</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="modern-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="יומי">יומי</SelectItem>
                    <SelectItem value="שבועי">שבועי</SelectItem>
                    <SelectItem value="חודשי">חודשי</SelectItem>
                    <SelectItem value="מותאם">טווח תאריכים מותאם אישית</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-right block text-sm font-medium">סינון נהגים</label>
                <Select value={selectedDrivers} onValueChange={setSelectedDrivers}>
                  <SelectTrigger className="modern-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל הנהגים</SelectItem>
                    <SelectItem value="driver-a">דוד כהן</SelectItem>
                    <SelectItem value="driver-b">משה לוי</SelectItem>
                    <SelectItem value="driver-c">יוסי אברהם</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-right block text-sm font-medium">סינון אזורים</label>
                <Select value={selectedAreas} onValueChange={setSelectedAreas}>
                  <SelectTrigger className="modern-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל האזורים</SelectItem>
                    <SelectItem value="tel-aviv">תל אביב</SelectItem>
                    <SelectItem value="jerusalem">ירושלים</SelectItem>
                    <SelectItem value="haifa">חיפה</SelectItem>
                    <SelectItem value="south">דרום</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-right block text-sm font-medium">סינון סוגי רכבים</label>
                <Select value={selectedVehicleTypes} onValueChange={setSelectedVehicleTypes}>
                  <SelectTrigger className="modern-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל סוגי הרכבים</SelectItem>
                    <SelectItem value="van">ואן</SelectItem>
                    <SelectItem value="truck">משאית</SelectItem>
                    <SelectItem value="private">פרייבט</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {timeRange === "מותאם" && (
              <div className="mt-4 flex gap-4 justify-end">
                <div className="space-y-2">
                  <label className="text-right block text-sm font-medium">תאריך התחלה</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal modern-input">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        בחר תאריך
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-right block text-sm font-medium">תאריך סיום</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal modern-input">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        בחר תאריך
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Charts Section - Minimalist Design */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Distance Trend Chart */}
          <Card className="enhanced-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-right text-lg font-semibold">מגמת מרחק נסיעה</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer config={chartConfig} className="h-80">
                <AreaChart data={mockPerformanceData}>
                  <defs>
                    <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="period" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="totalDistance" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorDistance)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Compliance Score Chart */}
          <Card className="enhanced-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-right text-lg font-semibold">ציון ציות לחוקים</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer config={chartConfig} className="h-80">
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="period" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    domain={[70, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="complianceScore" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: 'hsl(var(--chart-2))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Fuel Efficiency Chart */}
          <Card className="enhanced-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-right text-lg font-semibold">יעילות דלק</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="period" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="fuelWaste" 
                    fill="hsl(var(--destructive))" 
                    radius={[4, 4, 0, 0]}
                    opacity={0.8}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Tasks Completion Chart */}
          <Card className="enhanced-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-right text-lg font-semibold">השלמת משימות</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="period" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="tasksCompleted" 
                    fill="hsl(var(--chart-4))" 
                    radius={[4, 4, 0, 0]}
                    opacity={0.8}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Individual Driver Performance - Enhanced */}
        <Card className="enhanced-card">
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              ביצועי נהגים פרטניים וציות לחוקים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-right p-4 font-semibold">שם נהג</th>
                    <th className="text-right p-4 font-semibold">מרחק כולל (ק״מ)</th>
                    <th className="text-right p-4 font-semibold">משימות שהושלמו</th>
                    <th className="text-right p-4 font-semibold">יעילות (%)</th>
                    <th className="text-right p-4 font-semibold">שעות עבודה שבועיות</th>
                    <th className="text-right p-4 font-semibold">הפרות חוקיות</th>
                    <th className="text-right p-4 font-semibold">סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDriverPerformance.map((driver, index) => (
                    <tr key={index} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium">{driver.name}</td>
                      <td className="p-4">{driver.distance.toLocaleString()}</td>
                      <td className="p-4">{driver.tasks}</td>
                      <td className="p-4">{driver.efficiency}%</td>
                      <td className="p-4">
                        <span className={driver.workHours > 72 ? "text-red-600 font-semibold" : ""}>
                          {driver.workHours}/72
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant={driver.complianceIssues === 0 ? "default" : "destructive"}>
                          {driver.complianceIssues}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={
                          driver.efficiency >= 90 && driver.complianceIssues === 0 ? "default" : 
                          driver.efficiency >= 85 && driver.complianceIssues <= 1 ? "secondary" : 
                          "outline"
                        }>
                          {driver.efficiency >= 90 && driver.complianceIssues === 0 ? "מצוין" : 
                           driver.efficiency >= 85 && driver.complianceIssues <= 1 ? "טוב" : 
                           "זקוק לשיפור"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
