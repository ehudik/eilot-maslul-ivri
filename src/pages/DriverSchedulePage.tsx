import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- START: ROBUST FIX for default Leaflet icon loading issues ---
// First, ensure we have a clean slate by removing any existing icon definitions
if (L.Icon.Default.prototype._getIconUrl) {
  delete L.Icon.Default.prototype._getIconUrl;
}

// Create a new default icon with explicit CDN paths
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Set this as the default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;

// Define custom icons with explicit error handling
const createCustomIcon = (color: string, text: string) => {
  try {
    return L.icon({
      iconUrl: `https://placehold.co/25x25/${color}/FFFFFF?text=${encodeURIComponent(text)}`,
      iconSize: [25, 25],
      iconAnchor: [12, 25],
      popupAnchor: [0, -25],
      className: 'custom-icon'
    });
  } catch (error) {
    console.error('Error creating custom icon:', error);
    return DefaultIcon; // Fallback to default icon
  }
};

// Create custom icons with fallback to default
const driverBaseIcon = createCustomIcon('0000FF', 'נהג');
const rideOriginIcon = createCustomIcon('008000', 'מוצא');
const rideDestinationIcon = createCustomIcon('FF0000', 'יעד');
// --- END: ROBUST FIX for default Leaflet icon loading issues ---

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
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
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
    
    // Add driver's base location
    if (selectedDriver.base_address_coords) {
      elements.push(selectedDriver.base_address_coords);
    }

    // Add ride locations
    const daySchedule = selectedDriver.schedule[selectedDay] || [];
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

  return (
    <div className="container mx-auto p-4 space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold text-right mb-6">ניהול לוחות זמנים לנהגים</h1>

      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            בחר נהג:
          </label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedDriver?.id || ''}
            onChange={(e) => {
              const driver = drivers.find(d => d.id === e.target.value);
              setSelectedDriver(driver || null);
            }}
            disabled={drivers.length === 0}
          >
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        {selectedDriver && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver Info & Day Selector */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                  פרטי נהג: {selectedDriver.name}
                </h2>
                <div className="space-y-2">
                  <p><strong>כתובת בסיס:</strong> {selectedDriver.base_address}</p>
                  <p><strong>סטטוס:</strong> {selectedDriver.is_available ? 'זמין' : 'לא זמין'}</p>
                  <p><strong>שעות עבודה מקסימליות:</strong> {selectedDriver.max_daily_hours}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  בחר יום:
                </label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {daysOfWeek.map((day, index) => (
                    <option key={day} value={day}>
                      {daysOfWeekHebrew[index]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Map Display with error handling */}
            <div className="bg-white p-4 rounded-lg shadow">
              <MapContainer
                center={selectedDriver.base_address_coords || [31.77, 35.21]}
                zoom={8}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ScheduleMapUpdater mapElements={getMapElements()} />

                {/* Driver Base Marker with error handling */}
                {selectedDriver.base_address_coords && (
                  <Marker
                    position={selectedDriver.base_address_coords}
                    icon={driverBaseIcon}
                  >
                    <L.Popup>
                      <strong>נהג:</strong> {selectedDriver.name}<br />
                      <strong>כתובת בסיס:</strong> {selectedDriver.base_address}
                    </L.Popup>
                  </Marker>
                )}

                {/* Ride Markers and Polylines with error handling */}
                {(selectedDriver.schedule[selectedDay] || []).map((ride: any, index: number) => (
                  <React.Fragment key={ride.ride_id}>
                    {ride.origin_coords && (
                      <Marker 
                        position={ride.origin_coords}
                        icon={rideOriginIcon}
                      >
                        <L.Popup>
                          <strong>מוצא:</strong> {ride.origin_address}<br />
                          <strong>זמן התחלה:</strong> {formatTime(ride.start_time_iso)}
                        </L.Popup>
                      </Marker>
                    )}
                    {ride.destination_coords && (
                      <Marker 
                        position={ride.destination_coords}
                        icon={rideDestinationIcon}
                      >
                        <L.Popup>
                          <strong>יעד:</strong> {ride.destination_address}<br />
                          <strong>זמן סיום:</strong> {formatTime(ride.end_time_iso)}
                        </L.Popup>
                      </Marker>
                    )}
                    {ride.ride_polyline_coords && (
                      <Polyline
                        positions={ride.ride_polyline_coords}
                        color="purple"
                        weight={4}
                      >
                        <L.Popup>
                          <strong>מסלול נסיעה:</strong> {ride.origin_address} → {ride.destination_address}
                        </L.Popup>
                      </Polyline>
                    )}
                  </React.Fragment>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {/* Schedule Details */}
        {selectedDriver && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              לוח זמנים ליום {getHebrewDayName(selectedDay)}:
            </h2>
            {(selectedDriver.schedule[selectedDay] || []).length > 0 ? (
              <div className="space-y-4">
                {selectedDriver.schedule[selectedDay].map((ride: any) => (
                  <div key={ride.ride_id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>מזהה נסיעה:</strong> {ride.ride_id}</p>
                        <p><strong>מוצא:</strong> {ride.origin_address}</p>
                        <p><strong>יעד:</strong> {ride.destination_address}</p>
                      </div>
                      <div>
                        <p><strong>זמן התחלה:</strong> {formatTime(ride.start_time_iso)}</p>
                        <p><strong>זמן סיום:</strong> {formatTime(ride.end_time_iso)}</p>
                        <p><strong>משך נסיעה:</strong> {ride.duration_minutes} דקות</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">אין נסיעות מתוכננות ליום זה</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverSchedulePage; 