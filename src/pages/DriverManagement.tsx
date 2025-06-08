
import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, SkeletonLoader } from "@/components/ui/loading-spinner";
import { mockDrivers } from "@/data/mockDrivers";
import { mockTaskAssignments } from "@/data/mockTasks";
import { ClipboardList, Calendar, Clock, User, Filter } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="border-b border-border/30 p-6 bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-6">
          <SidebarTrigger className="enhanced-button" />
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">ניהול נהגים</h1>
              <p className="text-muted-foreground mt-1">תכנון ומעקב משימות יומיות</p>
            </div>
          </div>
        </div>
      </header>
      
      <div className="p-6 space-y-6">
        {/* Filters and Actions Area */}
        <div className="animate-fade-in">
          <Card className="enhanced-card">
            <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent border-b border-border/30">
              <CardTitle className="text-right flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                כלי ניהול ובקרה
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 justify-end">
                <Button variant="outline" className="enhanced-button">
                  <Calendar className="h-4 w-4 ml-2" />
                  בחר תאריך
                </Button>
                <Button variant="outline" className="enhanced-button">
                  <User className="h-4 w-4 ml-2" />
                  סנן נהגים
                </Button>
                <Button className="enhanced-button bg-gradient-to-r from-primary to-primary/80">
                  <Clock className="h-4 w-4 ml-2" />
                  עדכן לוח זמנים
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Gantt Chart Area */}
        <div className="space-y-6 animate-slide-in">
          <Card className="enhanced-card w-full">
            <CardHeader className="gantt-header">
              <CardTitle className="text-right text-xl font-bold">תרשים גנט - תוכנית עבודה יומית</CardTitle>
              <p className="text-sm text-muted-foreground text-right">גרור ושחרר משימות לשינוי לוח הזמנים</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="min-h-[600px] w-full">
                {isLoading ? (
                  <div className="p-8">
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <SkeletonLoader className="w-32 h-12" />
                          <SkeletonLoader className="flex-1 h-12" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Time Scale Header */}
                    <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border/30 z-10">
                      <div className="flex">
                        <div className="w-48 p-4 border-l border-border/30 bg-muted/30">
                          <h3 className="font-semibold text-right">נהג</h3>
                        </div>
                        <div className="flex-1 relative">
                          <div className="flex h-16 items-center px-2">
                            {timeSlots.map((time, index) => (
                              <div
                                key={time}
                                className="flex-1 text-center text-sm font-medium text-muted-foreground border-l border-border/20 px-1"
                                style={{ minWidth: '60px' }}
                              >
                                {time}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gantt Rows */}
                    <div className="divide-y divide-border/30">
                      {mockDrivers.map((driver, driverIndex) => {
                        const driverTasks = tasksByDriver[driver.id] || [];
                        return (
                          <div
                            key={driver.id}
                            className="gantt-row animate-fade-in"
                            style={{ animationDelay: `${driverIndex * 0.1}s` }}
                          >
                            <div className="flex min-h-[80px]">
                              {/* Driver Info */}
                              <div className="w-48 p-4 border-l border-border/30 bg-muted/10">
                                <div className="text-right">
                                  <h4 className="font-semibold text-lg">{driver.name}</h4>
                                  <p className="text-sm text-muted-foreground">{driver.id}</p>
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    {driver.vehicle?.type}
                                  </Badge>
                                </div>
                              </div>

                              {/* Timeline */}
                              <div className="flex-1 relative p-2 gantt-timeline">
                                <div className="relative h-16">
                                  {/* Time grid lines */}
                                  {timeSlots.map((_, index) => (
                                    <div
                                      key={index}
                                      className="absolute top-0 bottom-0 border-l border-border/10"
                                      style={{ left: `${(index / timeSlots.length) * 100}%` }}
                                    />
                                  ))}

                                  {/* Task blocks */}
                                  {driverTasks.map((task, taskIndex) => {
                                    const leftPosition = getTaskPosition(task.start_time);
                                    const width = getTaskWidth(task.start_time, task.end_time);
                                    
                                    return (
                                      <div
                                        key={task.task_id}
                                        className={`absolute top-2 h-12 gantt-task cursor-pointer hover:scale-105 transition-all duration-300 ${
                                          task.status === 'מתוכנן' ? 'gantt-task-planned' :
                                          task.status === 'בביצוע' ? 'gantt-task-active' :
                                          'gantt-task-completed'
                                        }`}
                                        style={{
                                          left: `${leftPosition}%`,
                                          width: `${width}%`,
                                          animationDelay: `${(driverIndex * 0.1) + (taskIndex * 0.05)}s`
                                        }}
                                        title={`${task.task_name} - ${task.start_time} עד ${task.end_time}`}
                                      >
                                        <div className="p-2 h-full flex flex-col justify-center">
                                          <div className="text-xs font-semibold truncate">
                                            {task.task_name}
                                          </div>
                                          <div className="text-xs opacity-75 truncate">
                                            {task.start_time} - {task.end_time}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}

                                  {/* Empty state for drivers with no tasks */}
                                  {driverTasks.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className="text-muted-foreground text-sm">אין משימות מוקצות</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
          <Card className="enhanced-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{mockTaskAssignments.length}</div>
              <div className="text-sm text-muted-foreground">סה"כ משימות</div>
            </CardContent>
          </Card>
          <Card className="enhanced-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{Object.keys(tasksByDriver).length}</div>
              <div className="text-sm text-muted-foreground">נהגים פעילים</div>
            </CardContent>
          </Card>
          <Card className="enhanced-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {mockTaskAssignments.filter(t => t.status === 'הושלם').length}
              </div>
              <div className="text-sm text-muted-foreground">משימות הושלמו</div>
            </CardContent>
          </Card>
          <Card className="enhanced-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {mockTaskAssignments.filter(t => t.status === 'מתוכנן').length}
              </div>
              <div className="text-sm text-muted-foreground">משימות מתוכננות</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;
