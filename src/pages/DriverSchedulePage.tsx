import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Driver } from "@/types/driver";
import { MapPin, Car, User, Calendar } from "lucide-react";

// Fix for default marker icons
const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Map updater component
const ScheduleMapUpdater: React.FC<{ mapElements: any[] }> = ({ mapElements }) => {
  const map = useMap();

  useEffect(() => {
    try {
      const allCoords = mapElements
        .filter(element => Array.isArray(element) && element.length === 2)
        .map(coord => L.latLng(coord[0], coord[1]));

      if (allCoords.length > 0) {
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds.pad(0.1));
      } else {
        map.setView([31.77, 35.21], 8); // Default to center of Israel
      }
    } catch (error) {
      console.error('Error updating map bounds:', error);
      map.setView([31.77, 35.21], 8);
    }
  }, [map, mapElements]);

  return null;
};

const DriverSchedulePage: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toLocaleString('en-US', { weekday: 'long' })
  );

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const daysOfWeekHebrew = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  const getHebrewDayName = (englishDay: string): string => {
    const index = daysOfWeek.indexOf(englishDay);
    return index !== -1 ? daysOfWeekHebrew[index] : englishDay;
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/drivers_with_schedules');
        if (!response.ok) throw new Error('Failed to fetch drivers');
        const data = await response.json();
        setDrivers(data);
        if (data.length > 0) {
          setSelectedDriver(data[0]);
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch drivers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const getMapElements = useCallback(() => {
    if (!selectedDriver) return [];

    const elements: any[] = [];
    
    // Add driver's location
    elements.push([selectedDriver.latitude, selectedDriver.longitude]);

    // Add ride locations
    const daySchedule = selectedDriver.schedule?.[selectedDay] || [];
    daySchedule.forEach((ride: any) => {
      if (ride.origin_coords) elements.push(ride.origin_coords);
      if (ride.destination_coords) elements.push(ride.destination_coords);
      if (ride.ride_polyline_coords) {
        elements.push(...ride.ride_polyline_coords);
      }
    });

    return elements;
  }, [selectedDriver, selectedDay]);

  const formatTime = (isoString: string): string => {
    return new Date(isoString).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">שגיאה</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
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
              {drivers.length} נהגים במערכת
            </Badge>
            <Badge variant="outline" className="text-sm">
              <MapPin className="h-4 w-4 ml-1" />
              {selectedDriver ? 'נהג נבחר' : 'לא נבחר נהג'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Driver Selection and Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent border-b border-border/30">
                <CardTitle className="text-right flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  בחירת נהג
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <select
                  className="w-full p-2 border rounded-md text-right"
                  value={selectedDriver?.driver_id || ''}
                  onChange={(e) => {
                    const driver = drivers.find(d => d.driver_id === e.target.value);
                    setSelectedDriver(driver || null);
                  }}
                >
                  <option value="">בחר נהג</option>
                  {drivers.map((driver) => (
                    <option key={driver.driver_id} value={driver.driver_id}>
                      {driver.driver_name}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {selectedDriver && (
              <Card>
                <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent border-b border-border/30">
                  <CardTitle className="text-right flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    פרטי נהג
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p><strong>שם:</strong> {selectedDriver.driver_name}</p>
                    <p><strong>מספר נהג:</strong> {selectedDriver.driver_id}</p>
                    <p><strong>סטטוס:</strong> {selectedDriver.status}</p>
                    <p><strong>כתובת:</strong> {selectedDriver.address}</p>
                    <p><strong>סוג רכב:</strong> {selectedDriver.vehicle?.type}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent border-b border-border/30">
                <CardTitle className="text-right flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  בחירת יום
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <select
                  className="w-full p-2 border rounded-md text-right"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {daysOfWeek.map((day, index) => (
                    <option key={day} value={day}>
                      {daysOfWeekHebrew[index]}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          </div>

          {/* Map Display */}
          <Card>
            <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent border-b border-border/30">
              <CardTitle className="text-right flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                מפת מסלול
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px]">
                <MapContainer
                  center={selectedDriver ? [selectedDriver.latitude, selectedDriver.longitude] : [31.77, 35.21]}
                  zoom={8}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {selectedDriver && (
                    <Marker
                      position={[selectedDriver.latitude, selectedDriver.longitude]}
                      icon={L.divIcon({
                        html: `
                          <div class="driver-marker ${selectedDriver.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'} 
                                      text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white">
                            ${selectedDriver.driver_name.charAt(0)}
                          </div>
                        `,
                        className: 'custom-div-icon',
                        iconSize: [32, 32],
                        iconAnchor: [16, 16]
                      })}
                    >
                      <Popup>
                        <div dir="rtl" className="text-right">
                          <strong>נהג:</strong> {selectedDriver.driver_name}<br />
                          <strong>כתובת:</strong> {selectedDriver.address}
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverSchedulePage; 