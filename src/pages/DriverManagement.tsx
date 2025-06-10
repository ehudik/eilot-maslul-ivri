
import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, SkeletonLoader } from "@/components/ui/loading-spinner";
import { mockDrivers } from "@/data/mockDrivers";
import { mockTaskAssignments } from "@/data/mockTasks";
import { ClipboardList, Calendar, Clock, User, Filter } from "lucide-react";
import { Driver } from "@/types/driver";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const DriverManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasksByDriver, setTasksByDriver] = useState<Record<string, typeof mockTaskAssignments>>({});
  
  // Filter states
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('23:00');
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(mockDrivers);
  const [filteredTasks, setFilteredTasks] = useState<typeof mockTaskAssignments>([]);

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

    // Filter by selected drivers
    if (selectedDrivers.length > 0) {
      drivers = drivers.filter(driver => selectedDrivers.includes(driver.driver_id));
      tasks = tasks.filter(task => selectedDrivers.includes(task.driver_id));
    }

    // Filter by time range
    tasks = tasks.filter(task => {
      const taskStart = task.start_time;
      const taskEnd = task.end_time;
      return taskStart >= startTime && taskEnd <= endTime;
    });

    setFilteredDrivers(drivers);
    setFilteredTasks(tasks);

    // Update filtered tasks by driver
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
    const hour = i + 6; // Start from 6:00
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getTaskRightPosition = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startHour = hours + minutes / 60;
    
    // Calculate position from left (6:00 AM = 0%, 24:00 = 100%)
    const positionFromLeft = ((startHour - 6) / 18) * 100;
    return positionFromLeft;
  };

  const getTaskWidth = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotal = startHours + startMinutes / 60;
    const endTotal = endHours + endMinutes / 60;
    const durationHours = endTotal - startTotal;
    
    // Width as percentage of the 18-hour timeline
    const width = (durationHours / 18) * 100;
    return Math.max(1, Math.min(50, width)); // Minimum 1%, maximum 50%
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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              <User className="h-4 w-4 ml-1" />
              {filteredDrivers.length} נהגים במערכת
            </Badge>
            <Badge variant="outline" className="text-sm">
              <ClipboardList className="h-4 w-4 ml-1" />
              {filteredTasks.length} משימות
            </Badge>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <div className="p-4 bg-muted/20 border-b border-border/30">
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-3">
              <Filter className="h-5 w-5 text-primary" />
              מסננים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Date Filter */}
              <div className="space-y-2">
                <Label className="text-right block">תאריך</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>

              {/* Time Range Filters */}
              <div className="space-y-2">
                <Label className="text-right block">שעת התחלה</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-right block">שעת סיום</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full"
                >
                  איפוס מסננים
                </Button>
              </div>
            </div>

            {/* Driver Selection */}
            <div className="space-y-2">
              <Label className="text-right block">בחירת נהגים</Label>
              <div className="flex flex-wrap gap-2 justify-end">
                {mockDrivers.map((driver) => (
                  <Button
                    key={driver.driver_id}
                    variant={selectedDrivers.includes(driver.driver_id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDriverSelection(driver.driver_id)}
                    className="text-sm"
                  >
                    {driver.driver_name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Active Filters Display */}
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
      <div className="flex-1 p-4">
        <Card>
          <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent border-b border-border/30">
            <CardTitle className="text-right flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              ניהול נהגים ומשימות - {selectedDate}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[1200px]">
                {/* Timeline Header */}
                <div className="flex border-b border-border/30" dir="ltr">
                  <div className="w-48 p-4 border-r border-border/30 bg-muted/10">
                    <h3 className="font-semibold text-right">נהג</h3>
                  </div>
                  <div className="flex-1 flex">
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className="flex-1 p-2 text-center text-sm text-muted-foreground border-r border-border/30"
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Driver Rows */}
                <div className="divide-y divide-border/30">
                  {filteredDrivers.map((driver, driverIndex) => {
                    const driverTasks = tasksByDriver[driver.driver_id] || [];
                    return (
                      <div
                        key={driver.driver_id}
                        className="gantt-row animate-fade-in"
                        style={{ animationDelay: `${driverIndex * 0.1}s` }}
                      >
                        <div className="flex min-h-[80px]" dir="ltr">
                          {/* Driver Info */}
                          <div className="w-48 p-4 border-r border-border/30 bg-muted/10">
                            <div className="text-right">
                              <h4 className="font-semibold text-lg">{driver.driver_name}</h4>
                              <p className="text-sm text-muted-foreground">{driver.driver_id}</p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {driver.vehicle?.type}
                              </Badge>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="flex-1 relative">
                            {driverTasks.map((task) => (
                              <div
                                key={task.task_id}
                                className="absolute top-2 bottom-2 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                                style={{
                                  left: `${getTaskRightPosition(task.start_time)}%`,
                                  width: `${getTaskWidth(task.start_time, task.end_time)}%`,
                                }}
                              >
                                <div className="p-2 text-xs h-full flex flex-col justify-center">
                                  <div className="font-medium truncate text-right">{task.task_name}</div>
                                  <div className="text-muted-foreground text-xs text-right">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverManagement;
