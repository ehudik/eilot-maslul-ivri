
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Driver } from '@/types/driver';

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Israel geographic boundaries
const ISRAEL_BOUNDS: L.LatLngBoundsExpression = [
  [29.4, 34.2], // Southwest corner
  [33.4, 35.9]  // Northeast corner
];

// Israel center point
const ISRAEL_CENTER: L.LatLngExpression = [31.5, 34.8];

interface MapComponentProps {
  drivers: Driver[];
  selectedDriver?: Driver | null;
  calculatedRoute?: any;
  showRouteMode?: boolean;
  onDriverLocationUpdate?: (driverId: string, lat: number, lng: number) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  drivers, 
  selectedDriver, 
  calculatedRoute,
  showRouteMode = false,
  onDriverLocationUpdate 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // Function to check if coordinates are within Israel bounds
  const isWithinIsrael = (lat: number, lng: number): boolean => {
    return lat >= 29.4 && lat <= 33.4 && lng >= 34.2 && lng <= 35.9;
  };

  // Function to adjust coordinates to nearest land point in Israel
  const adjustToIsraelLand = (lat: number, lng: number): [number, number] => {
    // If already within bounds, return as is
    if (isWithinIsrael(lat, lng)) {
      return [lat, lng];
    }
    
    // Adjust to closest point within Israel bounds
    const adjustedLat = Math.max(29.4, Math.min(33.4, lat));
    const adjustedLng = Math.max(34.2, Math.min(35.9, lng));
    
    return [adjustedLat, adjustedLng];
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map with Israel focus
    mapInstanceRef.current = L.map(mapRef.current).setView(ISRAEL_CENTER, 8);

    // Set max bounds to Israel
    mapInstanceRef.current.setMaxBounds(ISRAEL_BOUNDS);
    mapInstanceRef.current.setMinZoom(7);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      bounds: ISRAEL_BOUNDS
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update driver markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      mapInstanceRef.current!.removeLayer(marker);
    });
    markersRef.current = {};

    // Add driver markers
    drivers.forEach(driver => {
      // Ensure driver location is within Israel
      const [adjustedLat, adjustedLng] = adjustToIsraelLand(
        driver.location.lat, 
        driver.location.lng
      );

      const icon = L.divIcon({
        html: `
          <div class="driver-marker ${driver.status === 'available' ? 'bg-green-500' : driver.status === 'on-trip' ? 'bg-blue-500' : 'bg-yellow-500'} 
                      text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white">
            ${driver.name.charAt(0)}
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([adjustedLat, adjustedLng], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div dir="rtl" class="text-right">
            <h3 class="font-bold">${driver.name}</h3>
            <p class="text-sm">סטטוס: ${getStatusInHebrew(driver.status)}</p>
            <p class="text-sm">מספר נהג: ${driver.id}</p>
            <p class="text-sm">מיקום: ${adjustedLat.toFixed(4)}, ${adjustedLng.toFixed(4)}</p>
          </div>
        `);

      markersRef.current[driver.id] = marker;
    });
  }, [drivers]);

  // Handle selected driver
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedDriver) return;

    const marker = markersRef.current[selectedDriver.id];
    if (marker) {
      mapInstanceRef.current.setView(marker.getLatLng(), 12);
      marker.openPopup();
      
      // Show mock route for selected driver
      if (selectedDriver.route && selectedDriver.route.length > 0) {
        // Clear existing route
        if (routeLayerRef.current) {
          mapInstanceRef.current.removeLayer(routeLayerRef.current);
        }
        
        // Ensure all route points are within Israel
        const adjustedRoute = selectedDriver.route.map(point => 
          adjustToIsraelLand(point[0], point[1])
        );
        
        // Add route polyline
        routeLayerRef.current = L.polyline(adjustedRoute, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.8
        }).addTo(mapInstanceRef.current);
        
        // Add route stops
        adjustedRoute.forEach((point, index) => {
          const stopIcon = L.divIcon({
            html: `<div class="bg-white border-2 border-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-blue-500">${index + 1}</div>`,
            className: 'custom-stop-icon',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });
          
          L.marker(point, { icon: stopIcon })
            .addTo(mapInstanceRef.current!)
            .bindPopup(`<div dir="rtl" class="text-right">תחנה ${index + 1}</div>`);
        });
      }
    }
  }, [selectedDriver]);

  // Handle calculated route
  useEffect(() => {
    if (!mapInstanceRef.current || !calculatedRoute) return;

    // Clear existing route
    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
    }

    // Ensure calculated route points are within Israel
    const adjustedPolyline = calculatedRoute.polyline.map((point: [number, number]) => 
      adjustToIsraelLand(point[0], point[1])
    );

    // Add calculated route
    routeLayerRef.current = L.polyline(adjustedPolyline, {
      color: '#ef4444',
      weight: 5,
      opacity: 0.8
    }).addTo(mapInstanceRef.current);

    // Fit map to route bounds within Israel
    if (adjustedPolyline.length > 0) {
      const group = new L.FeatureGroup([routeLayerRef.current]);
      const bounds = group.getBounds();
      
      // Ensure bounds are within Israel
      const constrainedBounds = bounds.intersect(L.latLngBounds(ISRAEL_BOUNDS));
      mapInstanceRef.current.fitBounds(constrainedBounds.pad(0.1));
    }
  }, [calculatedRoute]);

  const getStatusInHebrew = (status: string) => {
    switch (status) {
      case 'available': return 'פנוי';
      case 'on-trip': return 'בנסיעה';
      case 'on-break': return 'בהפסקה';
      case 'offline': return 'לא מחובר';
      default: return status;
    }
  };

  return <div ref={mapRef} className="h-full w-full rounded-lg" />;
};
