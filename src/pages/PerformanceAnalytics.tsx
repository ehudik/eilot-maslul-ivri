
import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, Filter } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Mock performance data
const mockPerformanceData = [
  { date: "2024-01-01", period: "יום א", totalDistance: 245, fuelWaste: 12.5, drivingTime: 480, tasksCompleted: 8 },
  { date: "2024-01-02", period: "יום ב", totalDistance: 320, fuelWaste: 18.2, drivingTime: 520, tasksCompleted: 12 },
  { date: "2024-01-03", period: "יום ג", totalDistance: 280, fuelWaste: 15.8, drivingTime: 465, tasksCompleted: 10 },
  { date: "2024-01-04", period: "יום ד", totalDistance: 190, fuelWaste: 9.3, drivingTime: 390, tasksCompleted: 6 },
  { date: "2024-01-05", period: "יום ה", totalDistance: 365, fuelWaste: 21.4, drivingTime: 580, tasksCompleted: 15 },
  { date: "2024-01-06", period: "יום ו", totalDistance: 420, fuelWaste: 24.1, drivingTime: 620, tasksCompleted: 18 },
  { date: "2024-01-07", period: "שבת", totalDistance: 150, fuelWaste: 7.2, drivingTime: 280, tasksCompleted: 4 },
];

const mockDriverPerformance = [
  { name: "נהג א", distance: 1250, tasks: 45, efficiency: 92 },
  { name: "נהג ב", distance: 980, tasks: 38, efficiency: 88 },
  { name: "נהג ג", distance: 1420, tasks: 52, efficiency: 95 },
  { name: "נהג ד", distance: 760, tasks: 28, efficiency: 85 },
  { name: "נהג ה", distance: 1180, tasks: 41, efficiency: 90 },
];

const chartConfig = {
  totalDistance: {
    label: "מרחק כולל (ק״מ)",
    color: "hsl(var(--chart-1))",
  },
  fuelWaste: {
    label: "בזבוז דלק (ליטר)",
    color: "hsl(var(--chart-2))",
  },
  drivingTime: {
    label: "זמן נסיעה (דקות)",
    color: "hsl(var(--chart-3))",
  },
  tasksCompleted: {
    label: "משימות שהושלמו",
    color: "hsl(var(--chart-4))",
  },
};

const PerformanceAnalytics = () => {
  const [timeRange, setTimeRange] = useState("יומי");
  const [selectedDrivers, setSelectedDrivers] = useState("all");
  const [selectedAreas, setSelectedAreas] = useState("all");
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-4 bg-card">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">ניתוח ביצועים</h1>
        </div>
      </header>
      
      <div className="p-6">
        {/* Filters and Date Range Section */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center gap-2 justify-end">
                <Filter className="h-5 w-5" />
                מסננים ובחירת טווח זמן
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Time Range Selector */}
                <div className="space-y-2">
                  <label className="text-right block text-sm font-medium">טווח זמן</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
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

                {/* Driver Filter */}
                <div className="space-y-2">
                  <label className="text-right block text-sm font-medium">סינון נהגים</label>
                  <Select value={selectedDrivers} onValueChange={setSelectedDrivers}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל הנהגים</SelectItem>
                      <SelectItem value="driver-a">נהג א</SelectItem>
                      <SelectItem value="driver-b">נהג ב</SelectItem>
                      <SelectItem value="driver-c">נהג ג</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Area Filter */}
                <div className="space-y-2">
                  <label className="text-right block text-sm font-medium">סינון אזורים</label>
                  <Select value={selectedAreas} onValueChange={setSelectedAreas}>
                    <SelectTrigger>
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

                {/* Vehicle Type Filter */}
                <div className="space-y-2">
                  <label className="text-right block text-sm font-medium">סינון סוגי רכבים</label>
                  <Select value={selectedVehicleTypes} onValueChange={setSelectedVehicleTypes}>
                    <SelectTrigger>
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
                        <Button variant="outline" className="justify-start text-left font-normal">
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
                        <Button variant="outline" className="justify-start text-left font-normal">
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
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Total Distance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">מרחק נסיעה כולל</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="totalDistance" fill="var(--color-totalDistance)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Fuel Waste Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">בזבוז דלק משוער</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="fuelWaste" stroke="var(--color-fuelWaste)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Driving Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">זמן נסיעה כולל</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="drivingTime" fill="var(--color-drivingTime)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Tasks Completed Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">מספר משימות שבוצעו</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="tasksCompleted" fill="var(--color-tasksCompleted)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Individual Driver Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">ביצועי נהגים פרטניים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-2">שם נהג</th>
                    <th className="text-right p-2">מרחק כולל (ק״מ)</th>
                    <th className="text-right p-2">משימות שהושלמו</th>
                    <th className="text-right p-2">יעילות (%)</th>
                    <th className="text-right p-2">סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDriverPerformance.map((driver, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{driver.name}</td>
                      <td className="p-2">{driver.distance.toLocaleString()}</td>
                      <td className="p-2">{driver.tasks}</td>
                      <td className="p-2">{driver.efficiency}%</td>
                      <td className="p-2">
                        <Badge variant={driver.efficiency >= 90 ? "default" : driver.efficiency >= 85 ? "secondary" : "outline"}>
                          {driver.efficiency >= 90 ? "מצוין" : driver.efficiency >= 85 ? "טוב" : "זקוק לשיפור"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {mockPerformanceData.reduce((sum, day) => sum + day.totalDistance, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">סה״כ ק״מ השבוע</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {mockPerformanceData.reduce((sum, day) => sum + day.fuelWaste, 0).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">סה״כ בזבוז דלק (ליטר)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {Math.round(mockPerformanceData.reduce((sum, day) => sum + day.drivingTime, 0) / 60)}
              </div>
              <div className="text-sm text-muted-foreground">סה״כ שעות נסיעה</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {mockPerformanceData.reduce((sum, day) => sum + day.tasksCompleted, 0)}
              </div>
              <div className="text-sm text-muted-foreground">סה״כ משימות שהושלמו</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
