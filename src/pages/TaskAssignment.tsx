
import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapComponent } from "@/components/MapComponent";

interface OptimizationResult {
  totalTasks: number;
  totalDrivers: number;
  totalDistance: number;
  totalDuration: number;
  assignments: Array<{
    driverId: string;
    driverName: string;
    route: string;
    distance: number;
    duration: number;
  }>;
}

const TaskAssignment = () => {
  const [tasks, setTasks] = useState("");
  const [maxWorkHours, setMaxWorkHours] = useState(8);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimization = async () => {
    setIsOptimizing(true);
    
    // Mock optimization process
    setTimeout(() => {
      const mockResult: OptimizationResult = {
        totalTasks: 12,
        totalDrivers: 3,
        totalDistance: 145.8,
        totalDuration: 6.5,
        assignments: [
          {
            driverId: "D001",
            driverName: "דוד כהן",
            route: "תל אביב → רמת גן → בני ברק → פתח תקווה",
            distance: 48.2,
            duration: 2.1
          },
          {
            driverId: "D002",
            driverName: "שרה לוי",
            route: "ירושלים → בית שמש → מודיעין",
            distance: 52.4,
            duration: 2.3
          },
          {
            driverId: "D003",
            driverName: "מיכאל אברהם",
            route: "חיפה → נהריה → עכו → קריות",
            distance: 45.2,
            duration: 2.1
          }
        ]
      };
      
      setOptimizationResult(mockResult);
      setIsOptimizing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-4 bg-card">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">שיבוץ משימות</h1>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 p-4 space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">הזנת משימות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-right block">רשימת משימות (JSON או טקסט חופשי)</Label>
                  <Textarea
                    value={tasks}
                    onChange={(e) => setTasks(e.target.value)}
                    placeholder='דוגמה:
{
  "משימה 1": {"כתובת": "רחוב הרצל 15, תל אביב", "זמן שירות": "30 דקות"},
  "משימה 2": {"כתובת": "שדרות רוטשילד 45, תל אביב", "זמן שירות": "45 דקות"}
}'
                    className="min-h-[150px] text-right font-mono text-sm"
                    dir="rtl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Optimization Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">הגדרות אופטימיזציה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-right block">מגבלת שעות עבודה לנהג</Label>
                  <Input
                    type="number"
                    value={maxWorkHours}
                    onChange={(e) => setMaxWorkHours(Number(e.target.value))}
                    className="text-right"
                    dir="rtl"
                    min="1"
                    max="12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-right block">נהגים זמינים</Label>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <Badge variant="secondary">דוד כהן (פנוי)</Badge>
                    <Badge variant="secondary">שרה לוי (פנוי)</Badge>
                    <Badge variant="secondary">מיכאל אברהם (פנוי)</Badge>
                  </div>
                </div>

                <Button 
                  onClick={handleOptimization}
                  disabled={isOptimizing || !tasks.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isOptimizing ? "מבצע שיבוץ אופטימלי..." : "בצע שיבוץ אופטימלי"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          {optimizationResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Map Display */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">מפת מסלולים מאופטמים</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] p-0">
                  <MapComponent 
                    drivers={[]}
                    showRouteMode={true}
                  />
                </CardContent>
              </Card>

              {/* Assignment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">סיכום שיבוץ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-right">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {optimizationResult.totalTasks}
                      </div>
                      <div className="text-sm text-muted-foreground">סה"כ משימות</div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {optimizationResult.totalDrivers}
                      </div>
                      <div className="text-sm text-muted-foreground">נהגים משובצים</div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {optimizationResult.totalDistance} ק"מ
                      </div>
                      <div className="text-sm text-muted-foreground">סה"כ מרחק</div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {optimizationResult.totalDuration} שעות
                      </div>
                      <div className="text-sm text-muted-foreground">סה"כ זמן</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-right">פירוט לפי נהגים:</h4>
                    {optimizationResult.assignments.map((assignment, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{assignment.driverId}</Badge>
                          <h5 className="font-medium">{assignment.driverName}</h5>
                        </div>
                        <p className="text-sm text-muted-foreground text-right">
                          {assignment.route}
                        </p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{assignment.duration} שעות</span>
                          <span>{assignment.distance} ק"מ</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskAssignment;
