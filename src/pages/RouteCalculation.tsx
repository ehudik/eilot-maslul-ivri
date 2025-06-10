
import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapComponent } from "@/components/MapComponent";
import { mockDrivers } from "@/data/mockDrivers";
import { useToast } from "@/hooks/use-toast";

const RouteCalculation = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [calculatedRoute, setCalculatedRoute] = useState<any>(null);
  const { toast } = useToast();

  const handleCalculateRoute = () => {
    if (!origin || !destination) {
      toast({
        title: "שגיאה",
        description: "יש למלא כתובת מוצא ויעד",
        variant: "destructive",
      });
      return;
    }

    // Mock route calculation
    const mockRoute = {
      distance: "15.2 ק\"מ",
      duration: "22 דקות",
      polyline: [
        [32.0853, 34.7818], // Tel Aviv
        [32.0904, 34.7767],
        [32.0945, 34.7698],
        [32.1009, 34.7589], // Example route points
      ]
    };
    
    setCalculatedRoute(mockRoute);
    
    toast({
      title: "מסלול חושב בהצלחה",
      description: `מרחק: ${mockRoute.distance}, זמן נסיעה: ${mockRoute.duration}`,
    });
  };

  const availableDrivers = mockDrivers.filter(driver => driver.status === "available");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-4 bg-card">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">חישוב מסלול</h1>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-right">מפת מסלול</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)] p-0">
              <MapComponent 
                drivers={mockDrivers}
                showRouteMode={true}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="w-96 p-4 border-r border-border space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">פרטי מסלול</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="origin" className="text-right block">כתובת מוצא</Label>
                <Input
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="הזן כתובת מוצא"
                  className="text-right"
                  dir="rtl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-right block">כתובת יעד</Label>
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="הזן כתובת יעד"
                  className="text-right"
                  dir="rtl"
                />
              </div>
              
              <Button 
                onClick={handleCalculateRoute}
                className="w-full"
                size="lg"
              >
                חשב מסלול
              </Button>
              
              {calculatedRoute && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium text-right mb-2">תוצאות חישוב:</h3>
                  <p className="text-right text-sm text-muted-foreground">
                    מרחק: {calculatedRoute.distance}
                  </p>
                  <p className="text-right text-sm text-muted-foreground">
                    זמן נסיעה: {calculatedRoute.duration}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-right">נהגים זמינים</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableDrivers.map((driver) => (
                <div key={driver.driver_id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="status-available">פנוי</Badge>
                    <h4 className="font-medium text-right">{driver.driver_name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground text-right">
                    מרחק מנקודת המוצא: {Math.floor(Math.random() * 5) + 1} ק"מ
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RouteCalculation;
