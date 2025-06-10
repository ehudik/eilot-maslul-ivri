import React, { useState, useEffect, useRef } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapComponent } from "@/components/MapComponent";
import { DriverPanel } from "@/components/DriverPanel";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { mockDrivers } from "@/data/mockDrivers";
import { Driver } from "@/types/driver";
import { MapPin, Car } from "lucide-react";
import 'leaflet/dist/leaflet.css';

const DriverMap = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setDrivers(mockDrivers);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleDriverSelect = (driver: Driver) => {
    // If clicking the same driver, deselect it
    if (selectedDriver?.driver_id === driver.driver_id) {
      setSelectedDriver(null);
      // Reset map view to show all of Israel
      if (mapRef.current) {
        mapRef.current.fitBoundsToContent();
      }
    } else {
      setSelectedDriver(driver);
      console.log("Selected driver:", driver.driver_name);
    }
  };

  const handleDriverLocationUpdate = (driverId: string, lat: number, lng: number) => {
    setDrivers(prev => prev.map(driver => 
      driver.driver_id === driverId 
        ? { ...driver, latitude: lat, longitude: lng }
        : driver
    ));
  };

  const activeDriversCount = drivers.filter(d => d.status !== 'offline').length;

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
              <Car className="h-4 w-4 ml-1" />
              {activeDriversCount} נהגים פעילים
            </Badge>
            <Badge variant="outline" className="text-sm">
              <MapPin className="h-4 w-4 ml-1" />
              {drivers.length} נהגים במערכת
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Map Section */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent border-b border-border/30">
              <CardTitle className="text-right flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                מפת נהגים
              </CardTitle>
              {selectedDriver && (
                <p className="text-sm text-muted-foreground text-right">
                  נהג נבחר: {selectedDriver.driver_name}
                </p>
              )}
            </CardHeader>
            <CardContent className="p-0 h-[calc(100vh-12rem)]">
              <MapComponent
                ref={mapRef}
                drivers={drivers}
                selectedDriver={selectedDriver}
                onDriverLocationUpdate={handleDriverLocationUpdate}
              />
            </CardContent>
          </Card>
        </div>

        {/* Driver Panel */}
        <div className="w-96 p-4">
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
