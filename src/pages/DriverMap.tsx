
import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapComponent } from "@/components/MapComponent";
import { DriverPanel } from "@/components/DriverPanel";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { mockDrivers } from "@/data/mockDrivers";
import { Driver } from "@/types/driver";
import { MapPin, Car } from "lucide-react";

const DriverMap = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setDrivers(mockDrivers);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    console.log("Selected driver:", driver.name);
  };

  const handleDriverLocationUpdate = (driverId: string, lat: number, lng: number) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId 
        ? { ...driver, location: { lat, lng } }
        : driver
    ));
  };

  const activeDriversCount = drivers.filter(d => d.status !== 'offline').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="border-b border-border/30 p-6 bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-6">
          <SidebarTrigger className="enhanced-button" />
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">מפת נהגים</h1>
              <p className="text-muted-foreground mt-1">מעקב נהגים בזמן אמת</p>
            </div>
          </div>
          <div className="mr-auto flex items-center gap-4">
            <Badge variant="secondary" className="px-4 py-2 rounded-full">
              <Car className="h-4 w-4 ml-2" />
              {activeDriversCount} נהגים פעילים
            </Badge>
          </div>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-120px)] gap-6 p-6">
        <div className="flex-1 animate-fade-in">
          <Card className="enhanced-card h-full overflow-hidden">
            <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent border-b border-border/30">
              <CardTitle className="text-right text-xl font-semibold">מיקום נהגים בזמן אמת</CardTitle>
              {selectedDriver && (
                <p className="text-sm text-muted-foreground text-right">
                  נהג נבחר: {selectedDriver.name}
                </p>
              )}
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)] p-0 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20 backdrop-blur-sm">
                  <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-muted-foreground">טוען מפה...</p>
                  </div>
                </div>
              ) : (
                <MapComponent 
                  drivers={drivers}
                  selectedDriver={selectedDriver}
                  onDriverLocationUpdate={handleDriverLocationUpdate}
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="w-96 animate-slide-in">
          <DriverPanel 
            drivers={drivers}
            selectedDriver={selectedDriver}
            onDriverSelect={handleDriverSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverMap;
