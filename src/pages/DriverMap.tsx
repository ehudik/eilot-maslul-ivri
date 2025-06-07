
import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapComponent } from "@/components/MapComponent";
import { DriverPanel } from "@/components/DriverPanel";
import { mockDrivers } from "@/data/mockDrivers";
import { Driver } from "@/types/driver";

const DriverMap = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-4 bg-card">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">מפת נהגים</h1>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-right">מיקום נהגים בזמן אמת</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)] p-0">
              <MapComponent 
                drivers={drivers}
                selectedDriver={selectedDriver}
                onDriverLocationUpdate={handleDriverLocationUpdate}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="w-80 p-4 border-r border-border">
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
