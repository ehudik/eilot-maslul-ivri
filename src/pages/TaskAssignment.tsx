
import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapComponent } from "@/components/MapComponent";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ClipboardList, Zap, Users, Route, MapPin, Clock } from "lucide-react";

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

  const exampleJson = `{
  "משימה 1": {
    "כתובת": "רחוב הרצל 15, תל אביב",
    "זמן שירות": "30 דקות",
    "חשיבות": "גבוהה"
  },
  "משימה 2": {
    "כתובת": "שדרות רוטשילד 45, תל אביב",
    "זמן שירות": "45 דקות",
    "חשיבות": "בינונית"
  }
}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="border-b border-border/30 p-6 bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-6">
          <SidebarTrigger className="enhanced-button" />
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-3 rounded-xl shadow-lg">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">שיבוץ משימות</h1>
              <p className="text-muted-foreground mt-1">אופטימיזציה חכמה של מסלולי נהגים</p>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-120px)] gap-6 p-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* Tasks Input */}
            <Card className="enhanced-card">
              <CardHeader className="bg-gradient-to-l from-blue-50 to-transparent border-b border-border/30">
                <CardTitle className="text-right flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                  </div>
                  הזנת משימות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-3">
                  <Label className="text-right block font-semibold">רשימת משימות (JSON או טקסט חופשי)</Label>
                  <Textarea
                    value={tasks}
                    onChange={(e) => setTasks(e.target.value)}
                    placeholder={exampleJson}
                    className="modern-input min-h-[200px] text-right font-mono text-sm resize-none"
                    dir="rtl"
                  />
                  <div className="text-xs text-muted-foreground text-right bg-muted/30 p-3 rounded-lg">
                    <strong>עצה:</strong> השתמש בפורמט JSON כמו בדוגמה למעלה לתוצאות מיטביות
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimization Settings */}
            <Card className="enhanced-card">
              <CardHeader className="bg-gradient-to-l from-green-50 to-transparent border-b border-border/30">
                <CardTitle className="text-right flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  הגדרות אופטימיזציה
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-3">
                  <Label className="text-right block font-semibold">מגבלת שעות עבודה לנהג</Label>
                  <Input
                    type="number"
                    value={maxWorkHours}
                    onChange={(e) => setMaxWorkHours(Number(e.target.value))}
                    className="modern-input text-right text-lg"
                    dir="rtl"
                    min="1"
                    max="12"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-right block font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    נהגים זמינים
                  </Label>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <Badge className="status-available hover:scale-105 transition-transform">
                      🚗 דוד כהן (פנוי)
                    </Badge>
                    <Badge className="status-available hover:scale-105 transition-transform">
                      🚛 שרה לוי (פנוי)
                    </Badge>
                    <Badge className="status-available hover:scale-105 transition-transform">
                      🚐 מיכאל אברהם (פנוי)
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={handleOptimization}
                  disabled={isOptimizing || !tasks.trim()}
                  className="enhanced-button w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-lg py-3"
                  size="lg"
                >
                  {isOptimizing ? (
                    <>
                      <LoadingSpinner size="sm" className="ml-2" />
                      מבצע שיבוץ אופטימלי...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 ml-2" />
                      בצע שיבוץ אופטימלי
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          {optimizationResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
              {/* Map Display */}
              <Card className="enhanced-card">
                <CardHeader className="bg-gradient-to-l from-purple-50 to-transparent border-b border-border/30">
                  <CardTitle className="text-right flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    מפת מסלולים מאופטמים
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] p-0">
                  <MapComponent 
                    drivers={[]}
                    showRouteMode={true}
                  />
                </CardContent>
              </Card>

              {/* Assignment Summary */}
              <Card className="enhanced-card">
                <CardHeader className="bg-gradient-to-l from-orange-50 to-transparent border-b border-border/30">
                  <CardTitle className="text-right flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Route className="h-5 w-5 text-orange-600" />
                    </div>
                    סיכום שיבוץ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-2 gap-4 text-right">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {optimizationResult.totalTasks}
                      </div>
                      <div className="text-sm text-blue-700 font-medium">סה"כ משימות</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {optimizationResult.totalDrivers}
                      </div>
                      <div className="text-sm text-green-700 font-medium">נהגים משובצים</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {optimizationResult.totalDistance} ק"מ
                      </div>
                      <div className="text-sm text-purple-700 font-medium">סה"כ מרחק</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                      <div className="text-3xl font-bold text-orange-600 mb-1 flex items-center justify-center gap-1">
                        <Clock className="h-6 w-6" />
                        {optimizationResult.totalDuration}
                      </div>
                      <div className="text-sm text-orange-700 font-medium">סה"כ שעות</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-lg text-right border-b border-border/30 pb-2">פירוט לפי נהגים:</h4>
                    {optimizationResult.assignments.map((assignment, index) => (
                      <div key={index} className="enhanced-card p-4 space-y-3 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="rounded-full border-primary/50 text-primary font-semibold">
                            {assignment.driverId}
                          </Badge>
                          <h5 className="font-bold text-lg">{assignment.driverName}</h5>
                        </div>
                        <p className="text-sm text-muted-foreground text-right bg-muted/30 p-3 rounded-lg">
                          <Route className="h-4 w-4 inline ml-1" />
                          {assignment.route}
                        </p>
                        <div className="flex justify-between text-sm bg-gradient-to-l from-primary/5 to-transparent p-3 rounded-lg">
                          <div className="flex items-center gap-1 text-blue-600 font-semibold">
                            <Clock className="h-4 w-4" />
                            <span>{assignment.duration} שעות</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600 font-semibold">
                            <MapPin className="h-4 w-4" />
                            <span>{assignment.distance} ק"מ</span>
                          </div>
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
