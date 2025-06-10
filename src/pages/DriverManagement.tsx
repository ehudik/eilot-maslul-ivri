
import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { mockDrivers } from "@/data/mockDrivers";
import { mockTaskAssignments } from "@/data/mockTasks";
import { mockDriverWorkHours, getDriversNeedingBreak, getDriversNeedingRest } from "@/data/mockDriverWorkHours";
import { ClipboardList, Calendar, Clock, User, Filter, AlertTriangle, Coffee, Shield, Users } from "lucide-react";
import { Driver } from "@/types/driver";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const DriverManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasksByDriver, setTasksByDriver] = useState<Record<string, typeof mockTaskAssignments>>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Filter states
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('23:00');
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(mockDrivers);
  const [filteredTasks, setFilteredTasks] = useState<typeof mockTaskAssignments>([]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const grouped = mockTaskAssignments.reduce((acc, task) => {
        if (!acc[task.driver_id]) {
          acc[task.driver_id] = [];
        }
        acc[task.driver_id].push(task);
        return acc;
      }, {} as Record<string, typeof mockTaskAssignments>);
      setTasksByDriver(grouped);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter logic
  useEffect(() => {
    let drivers = mockDrivers;
    let tasks = mockTaskAssignments;

    if (selectedDrivers.length > 0) {
      drivers = drivers.filter(driver => selectedDrivers.includes(driver.driver_id));
      tasks = tasks.filter(task => selectedDrivers.includes(task.driver_id));
    }

    tasks = tasks.filter(task => {
      const taskStart = task.start_time;
      const taskEnd = task.end_time;
      return taskStart >= startTime && taskEnd <= endTime;
    });

    setFilteredDrivers(drivers);
    setFilteredTasks(tasks);

    const filteredGrouped = tasks.reduce((acc, task) => {
      if (!acc[task.driver_id]) {
        acc[task.driver_id] = [];
      }
      acc[task.driver_id].push(task);
      return acc;
    }, {} as Record<string, typeof mockTaskAssignments>);
    setTasksByDriver(filteredGrouped);
  }, [selectedDrivers, startTime, endTime]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'הושלם':
        return 'default';
      case 'בביצוע':
        return 'secondary';
      case 'מתוכנן':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 6;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getCurrentTimePosition = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInHours = hours + minutes / 60;
    
    if (currentTimeInHours < 6 || currentTimeInHours > 24) return -1;
    
    const positionFromLeft = ((currentTimeInHours - 6) / 18) * 100;
    return Math.max(0, Math.min(100, positionFromLeft));
  };

  const getTaskRightPosition = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startHour = hours + minutes / 60;
    const positionFromLeft = ((startHour - 6) / 18) * 100;
    return positionFromLeft;
  };

  const getTaskWidth = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotal = startHours + startMinutes / 60;
    const endTotal = endHours + endMinutes / 60;
    const durationHours = endTotal - startTotal;
    
    const width = (durationHours / 18) * 100;
    return Math.max(1, Math.min(50, width));
  };

  const toggleDriverSelection = (driverId: string) => {
    setSelectedDrivers(prev => 
      prev.includes(driverId)
        ? prev.filter(id => id !== driverId)
        : [...prev, driverId]
    );
  };

  const clearFilters = () => {
    setSelectedDrivers([]);
    setStartTime('06:00');
    setEndTime('23:00');
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const driversNeedingBreak = getDriversNeedingBreak();
  const driversNeedingRest = getDriversNeedingRest();
  const avgWorkHours = mockDriverWorkHours.reduce((sum, driver) => sum + (driver.daily_work_time / 60), 0) / mockDriverWorkHours.length;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm border-primary/20 bg-primary/5">
              <User className="h-4 w-4 ml-1 text-primary" />
              {filteredDrivers.length} נהגים במערכת
            </Badge>
            <Badge variant="outline" className="text-sm border-blue-500/20 bg-blue-500/5">
              <ClipboardList className="h-4 w-4 ml-1 text-blue-600" />
              {filteredTasks.length} משימות
            </Badge>
            <Badge variant="outline" className="text-sm border-orange-500/20 bg-orange-500/5">
              <Clock className="h-4 w-4 ml-1 text-orange-600" />
              {currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
            </Badge>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="p-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="enhanced-card border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{avgWorkHours.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">שעות עבודה ממוצע</div>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{mockDriverWorkHours.filter(d => d.status === 'available').length}</div>
                  <div className="text-sm text-muted-foreground">נהגים פעילים</div>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-green-600" />
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
        </div>
      </div>

      {/* Filters Section */}
      <div className="px-6 pb-4">
        <Card className="enhanced-card">
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-3">
              <Filter className="h-5 w-5 text-primary" />
              מסננים וכלי ניהול
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-right block">תאריך</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-right modern-input"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-right block">שעת התחלה</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="text-right modern-input"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-right block">שעת סיום</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="text-right modern-input"
                  dir="rtl"
                />
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full enhanced-button"
                >
                  איפוס מסננים
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-right block">בחירת נהגים</Label>
              <div className="flex flex-wrap gap-2 justify-end">
                {mockDrivers.map((driver) => (
                  <Button
                    key={driver.driver_id}
                    variant={selectedDrivers.includes(driver.driver_id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDriverSelection(driver.driver_id)}
                    className="text-sm enhanced-button"
                  >
                    {driver.driver_name}
                  </Button>
                ))}
              </div>
            </div>

            {(selectedDrivers.length > 0 || startTime !== '06:00' || endTime !== '23:00') && (
              <div className="space-y-2">
                <Label className="text-right block text-sm">מסננים פעילים:</Label>
                <div className="flex flex-wrap gap-2 justify-end">
                  {selectedDrivers.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      נהגים נבחרים: {selectedDrivers.length}
                    </Badge>
                  )}
                  {(startTime !== '06:00' || endTime !== '23:00') && (
                    <Badge variant="secondary" className="text-xs">
                      טווח שעות: {startTime} - {endTime}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <Card className="enhanced-card h-full">
          <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent border-b border-border/30">
            <CardTitle className="text-right flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              ניהול נהגים ומשימות - {selectedDate}
              <Badge variant="outline" className="mr-auto">
                <Shield className="h-4 w-4 ml-1" />
                מעקב ציות לחוקים
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full overflow-auto">
            <div className="min-w-[1200px] h-full">
              {/* Timeline Header */}
              <div className="flex border-b border-border/30 sticky top-0 bg-background z-10" dir="ltr">
                <div className="w-48 p-4 border-r border-border/30 bg-muted/10">
                  <h3 className="font-semibold text-right">נהג</h3>
                </div>
                <div className="flex-1 flex relative">
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="flex-1 p-2 text-center text-sm text-muted-foreground border-r border-border/30"
                    >
                      {time}
                    </div>
                  ))}
                  
                  {/* Current Time Line */}
                  {getCurrentTimePosition() >= 0 && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 shadow-lg"
                      style={{
                        left: `${getCurrentTimePosition()}%`,
                      }}
                    >
                      <div className="absolute -top-1 -left-2 w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
                      <div className="absolute -top-8 -left-8 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-lg">
                        עכשיו
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Driver Rows */}
              <div className="divide-y divide-border/30">
                {filteredDrivers.map((driver, driverIndex) => {
                  const driverTasks = tasksByDriver[driver.driver_id] || [];
                  const workHours = mockDriverWorkHours.find(wh => wh.driver_id === driver.driver_id);
                  
                  return (
                    <div
                      key={driver.driver_id}
                      className="gantt-row animate-fade-in"
                      style={{ animationDelay: `${driverIndex * 0.1}s` }}
                    >
                      <div className="flex min-h-[80px]" dir="ltr">
                        {/* Driver Info */}
                        <div className="w-48 p-4 border-r border-border/30 bg-muted/10">
                          <div className="text-right space-y-2">
                            <h4 className="font-semibold text-lg">{driver.driver_name}</h4>
                            <p className="text-sm text-muted-foreground">{driver.driver_id}</p>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">
                                {driver.vehicle?.type}
                              </Badge>
                              {workHours?.needs_break && (
                                <Badge variant="destructive" className="text-xs">
                                  נדרשת הפסקה
                                </Badge>
                              )}
                              {workHours?.needs_daily_rest && (
                                <Badge variant="destructive" className="text-xs">
                                  נדרשת מנוחה
                                </Badge>
                              )}
                              {workHours?.compliance_violations > 0 && (
                                <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                                  {workHours.compliance_violations} הפרות
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex-1 relative">
                          {driverTasks.map((task) => (
                            <div
                              key={task.task_id}
                              className={`absolute top-2 bottom-2 rounded-lg border hover:shadow-lg transition-all cursor-pointer gantt-task ${
                                task.status === 'הושלם' ? 'gantt-task-completed' :
                                task.status === 'בביצוע' ? 'gantt-task-active' :
                                'gantt-task-planned'
                              }`}
                              style={{
                                left: `${getTaskRightPosition(task.start_time)}%`,
                                width: `${getTaskWidth(task.start_time, task.end_time)}%`,
                              }}
                            >
                              <div className="p-2 text-xs h-full flex flex-col justify-center">
                                <div className="font-medium truncate text-right">{task.task_name}</div>
                                <div className="text-xs text-right opacity-80">
                                  {task.start_time} - {task.end_time}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverManagement;
