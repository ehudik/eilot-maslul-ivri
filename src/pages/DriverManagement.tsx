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

const DriverManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasksByDriver, setTasksByDriver] = useState<Record<string, typeof mockTaskAssignments>>({});

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

  const getTaskPosition = (startTime: string) => {
    const [hours] = startTime.split(':').map(Number);
    const position = ((hours - 6) / 18) * 100;
    return Math.max(0, Math.min(100, position));
  };

  const getTaskWidth = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const startTotal = startHours + startMinutes / 60;
    const endTotal = endHours + endMinutes / 60;
    const duration = endTotal - startTotal;
    const width = (duration / 18) * 100;
    return Math.max(5, Math.min(100, width));
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
              {mockDrivers.length} נהגים במערכת
            </Badge>
            <Badge variant="outline" className="text-sm">
              <ClipboardList className="h-4 w-4 ml-1" />
              {mockTaskAssignments.length} משימות
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Card>
          <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent border-b border-border/30">
            <CardTitle className="text-right flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              ניהול נהגים ומשימות
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[1200px]">
                {/* Timeline Header */}
                <div className="flex border-b border-border/30">
                  <div className="w-48 p-4 border-l border-border/30 bg-muted/10">
                    <h3 className="font-semibold text-right">נהג</h3>
                  </div>
                  <div className="flex-1 flex">
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className="flex-1 p-2 text-center text-sm text-muted-foreground border-l border-border/30"
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Driver Rows */}
                <div className="divide-y divide-border/30">
                  {mockDrivers.map((driver, driverIndex) => {
                    const driverTasks = tasksByDriver[driver.driver_id] || [];
                    return (
                      <div
                        key={driver.driver_id}
                        className="gantt-row animate-fade-in"
                        style={{ animationDelay: `${driverIndex * 0.1}s` }}
                      >
                        <div className="flex min-h-[80px]">
                          {/* Driver Info */}
                          <div className="w-48 p-4 border-l border-border/30 bg-muted/10">
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
                                  left: `${getTaskPosition(task.start_time)}%`,
                                  width: `${(task.duration_minutes || 60) / 60}%`,
                                }}
                              >
                                <div className="p-2 text-xs">
                                  <div className="font-medium">{task.task_name}</div>
                                  <div className="text-muted-foreground">
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
