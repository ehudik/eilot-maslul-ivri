
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockDrivers } from "@/data/mockDrivers";
import { mockTaskAssignments } from "@/data/mockTasks";

const DriverManagement = () => {
  // Get tasks grouped by driver
  const tasksByDriver = mockTaskAssignments.reduce((acc, task) => {
    if (!acc[task.driver_id]) {
      acc[task.driver_id] = [];
    }
    acc[task.driver_id].push(task);
    return acc;
  }, {} as Record<string, typeof mockTaskAssignments>);

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-4 bg-card">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">ניהול נהגים</h1>
        </div>
      </header>
      
      <div className="p-6">
        {/* Future Filters and Actions Area */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">כלי ניהול ובקרה</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-right text-muted-foreground text-sm">
                כאן יוצגו אפשרויות סינון ופעולות על התוכנית היומית
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Gantt Chart Area */}
        <div className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-right">תרשים גנט - תוכנית עבודה יומית</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[600px] w-full">
                {/* Placeholder for Future Gantt Chart */}
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                  <h3 className="text-lg font-semibold mb-4 text-right">תרשים גנט אינטראקטיבי</h3>
                  <p className="text-muted-foreground text-right mb-6">
                    כאן יוצג תרשים גנט אינטראקטיבי עם יכולת גרירה ושחרור
                  </p>
                  
                  {/* Current Tasks Summary */}
                  <div className="grid gap-4 max-w-4xl mx-auto">
                    {mockDrivers.map((driver) => {
                      const driverTasks = tasksByDriver[driver.id] || [];
                      return (
                        <div key={driver.id} className="border rounded-lg p-4 text-right">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline">{driver.vehicle?.type}</Badge>
                            <h4 className="font-medium">{driver.name}</h4>
                          </div>
                          <div className="space-y-2">
                            {driverTasks.length > 0 ? (
                              driverTasks.map((task) => (
                                <div key={task.task_id} className="flex items-center justify-between bg-muted/50 rounded p-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Badge size="sm" variant={getStatusBadgeVariant(task.status)}>
                                      {task.status}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                      {task.start_time} - {task.end_time}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">{task.task_name}</div>
                                    <div className="text-xs text-muted-foreground">{task.location_address}</div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-muted-foreground text-sm">אין משימות מוקצות</p>
                            )}
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

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{mockTaskAssignments.length}</div>
              <div className="text-sm text-muted-foreground">סה"כ משימות</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{Object.keys(tasksByDriver).length}</div>
              <div className="text-sm text-muted-foreground">נהגים פעילים</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {mockTaskAssignments.filter(t => t.status === 'הושלם').length}
              </div>
              <div className="text-sm text-muted-foreground">משימות הושלמו</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
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
