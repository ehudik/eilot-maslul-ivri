
import React, { useState, useEffect, useRef } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapComponent } from "@/components/MapComponent";
import { DriverPanel } from "@/components/DriverPanel";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { mockDrivers } from "@/data/mockDrivers";
import { mockDriverWorkHours, getDriversNeedingBreak, getDriversNeedingRest, getComplianceViolations } from "@/data/mockDriverWorkHours";
import { Driver } from "@/types/driver";
import { MapPin, Car, AlertTriangle, Shield, Clock, Users, TrendingUp, Activity, Coffee } from "lucide-react";
import 'leaflet/dist/leaflet.css';

const DriverMap = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const mapRef = useRef<any>(null);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate loading with realistic delay
    setTimeout(() => {
      setDrivers(mockDrivers);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleDriverSelect = (driver: Driver) => {
    if (selectedDriver?.driver_id === driver.driver_id) {
      setSelectedDriver(null);
      if (mapRef.current) {
        mapRef.current.fitBoundsToContent();
      }
    } else {
      setSelectedDriver(driver);
      console.log("נהג נבחר:", driver.driver_name);
    }
  };

  const handleDriverLocationUpdate = (driverId: string, lat: number, lng: number) => {
    setDrivers(prev => prev.map(driver => 
      driver.driver_id === driverId 
        ? { ...driver, latitude: lat, longitude: lng }
        : driver
    ));
  };

  // Calculate real-time statistics
  const activeDriversCount = drivers.filter(d => d.status === 'available' || d.status === 'busy' || d.status === 'on-trip').length;
  const driversNeedingBreak = getDriversNeedingBreak();
  const driversNeedingRest = getDriversNeedingRest();
  const complianceViolations = getComplianceViolations();
  const avgWorkHours = mockDriverWorkHours.reduce((sum, driver) => sum + (driver.daily_work_time / 60), 0) / mockDriverWorkHours.length;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg text-muted-foreground">טוען לוח בקרה...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
      {/* Enhanced Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">לוח בקרה מתקדם</h1>
                <p className="text-sm text-muted-foreground">ניטור צי בזמן אמת וציות לחוקים</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm border-primary/20 bg-primary/5">
              <Clock className="h-4 w-4 ml-1 text-primary" />
              {currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
            </Badge>
            <Badge variant="outline" className="text-sm border-green-500/20 bg-green-500/5">
              <Car className="h-4 w-4 ml-1 text-green-600" />
              {activeDriversCount} נהגים פעילים
            </Badge>
            <Badge variant="outline" className="text-sm border-blue-500/20 bg-blue-500/5">
              <MapPin className="h-4 w-4 ml-1 text-blue-600" />
              {drivers.length} סה״כ נהגים
            </Badge>
          </div>
        </div>
      </header>

      {/* KPI Dashboard */}
      <div className="p-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="enhanced-card border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{activeDriversCount}</div>
                  <div className="text-sm text-muted-foreground">נהגים פעילים</div>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">זמינות גבוהה</span>
              </div>
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{driversNeedingBreak.length}</div>
                  <div className="text-sm text-muted-foreground">נדרשת הפסקה</div>
                </div>
                <div className="bg-orange-100 p-2 rounded-full">
                  <Coffee className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              {driversNeedingBreak.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <AlertTriangle className="h-3 w-3 text-orange-600" />
                  <span className="text-xs text-orange-600">דורש תשומת לב</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{driversNeedingRest.length}</div>
                  <div className="text-sm text-muted-foreground">נדרשת מנוחה</div>
                </div>
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              {driversNeedingRest.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <AlertTriangle className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-red-600">דחוף!</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{complianceViolations.length}</div>
                  <div className="text-sm text-muted-foreground">הפרות ציות</div>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              {complianceViolations.length === 0 ? (
                <div className="flex items-center gap-1 mt-2">
                  <Shield className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">ציות מלא</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-2">
                  <AlertTriangle className="h-3 w-3 text-purple-600" />
                  <span className="text-xs text-purple-600">דורש בדיקה</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="enhanced-card border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{avgWorkHours.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">ממוצע שעות</div>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Activity className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-600">יומי</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex px-6 pb-6 gap-6 overflow-hidden">
        {/* Map Section */}
        <div className="flex-1">
          <Card className="enhanced-card h-full">
            <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent border-b border-border/30">
              <CardTitle className="text-right flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                מפת נהגים בזמן אמת
              </CardTitle>
              {selectedDriver && (
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="default" className="text-sm">
                    נהג נבחר: {selectedDriver.driver_name}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDriver(null)}
                    className="enhanced-button"
                  >
                    נקה בחירה
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0 h-[calc(100vh-16rem)]">
              <MapComponent
                ref={mapRef}
                drivers={drivers}
                selectedDriver={selectedDriver}
                onDriverLocationUpdate={handleDriverLocationUpdate}
              />
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Driver Panel */}
        <div className="w-96">
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
