import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import { Driver } from '@/types/driver';
import 'leaflet/dist/leaflet.css';

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
  rideDetails?: {
    origin_coords: [number, number];
    destination_coords: [number, number];
    ride_polyline_coords: [number, number][];
  } | null;
  showRouteMode?: boolean;
  onDriverLocationUpdate?: (driverId: string, lat: number, lng: number) => void;
}

export interface MapComponentRef {
  fitBoundsToContent: () => void;
}

export const MapComponent = forwardRef<MapComponentRef, MapComponentProps>(({ 
  drivers, 
  selectedDriver, 
  rideDetails,
  showRouteMode = false,
  onDriverLocationUpdate 
}, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const driverRouteLayersRef = useRef<{ [key: string]: L.Polyline }>({});

  // Function to check if coordinates are valid numbers
  const isValidCoordinate = (lat: any, lng: any): boolean => {
    return typeof lat === 'number' && 
           typeof lng === 'number' && 
           !isNaN(lat) && 
           !isNaN(lng) && 
           isFinite(lat) && 
           isFinite(lng);
  };

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

  // Function to safely create a LatLng object
  const safeCreateLatLng = (lat: number, lng: number): L.LatLng | null => {
    if (!isValidCoordinate(lat, lng)) return null;
    const [adjustedLat, adjustedLng] = adjustToIsraelLand(lat, lng);
    return L.latLng(adjustedLat, adjustedLng);
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map with Israel focus
    mapInstanceRef.current = L.map(mapRef.current, {
      center: ISRAEL_CENTER,
      zoom: 8,
      minZoom: 7,
      maxBounds: ISRAEL_BOUNDS,
      maxBoundsViscosity: 1.0
    });

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

  // Update map content (markers, routes, etc.)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers and routes
    Object.values(markersRef.current).forEach(marker => {
      mapInstanceRef.current!.removeLayer(marker);
    });
    markersRef.current = {};

    Object.values(driverRouteLayersRef.current).forEach(layer => {
      mapInstanceRef.current!.removeLayer(layer);
    });
    driverRouteLayersRef.current = {};

    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    // Add driver markers
    drivers.forEach(driver => {
      if (!isValidCoordinate(driver.latitude, driver.longitude)) {
        console.warn(`Invalid coordinates for driver ${driver.driver_id}`);
        return;
      }

      const [adjustedLat, adjustedLng] = adjustToIsraelLand(
        driver.latitude,
        driver.longitude
      );

      const icon = L.divIcon({
        html: `
          <div class="driver-marker ${driver.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'} 
                      text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white">
            ${driver.driver_name.charAt(0)}
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
            <h3 class="font-bold">${driver.driver_name}</h3>
            <p class="text-sm">סטטוס: ${getStatusInHebrew(driver.status)}</p>
            <p class="text-sm">מספר נהג: ${driver.driver_id}</p>
            <p class="text-sm">מיקום: ${adjustedLat.toFixed(4)}, ${adjustedLng.toFixed(4)}</p>
          </div>
        `);

      markersRef.current[driver.driver_id] = marker;

      // Add driver route to origin if available and showRouteMode is true
      if (showRouteMode && driver.polyline_to_origin_coords && Array.isArray(driver.polyline_to_origin_coords)) {
        const validCoords = driver.polyline_to_origin_coords
          .map(coord => {
            if (Array.isArray(coord) && isValidCoordinate(coord[0], coord[1])) {
              return adjustToIsraelLand(coord[0], coord[1]);
            }
            return null;
          })
          .filter((coord): coord is [number, number] => coord !== null);

        if (validCoords.length > 1) {
          driverRouteLayersRef.current[driver.driver_id] = L.polyline(validCoords, {
            color: '#3b82f6',
            weight: 3,
            opacity: 0.6,
            dashArray: '5, 10'
          }).addTo(mapInstanceRef.current!);
        }
      }
    });

    // Add main ride route if available
    if (rideDetails?.ride_polyline_coords && Array.isArray(rideDetails.ride_polyline_coords)) {
      const validCoords = rideDetails.ride_polyline_coords
        .map(coord => {
          if (Array.isArray(coord) && isValidCoordinate(coord[0], coord[1])) {
            return adjustToIsraelLand(coord[0], coord[1]);
          }
          return null;
        })
        .filter((coord): coord is [number, number] => coord !== null);

      if (validCoords.length > 1) {
        routeLayerRef.current = L.polyline(validCoords, {
          color: '#ef4444',
          weight: 5,
          opacity: 0.8
        }).addTo(mapInstanceRef.current!);
      }
    }

  }, [drivers, rideDetails, showRouteMode]);

  // Handle selected driver
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedDriver) return;

    const marker = markersRef.current[selectedDriver.driver_id];
    if (marker) {
      mapInstanceRef.current.setView(marker.getLatLng(), 12);
      marker.openPopup();
    }
  }, [selectedDriver]);

  // Expose fitBoundsToContent method
  useImperativeHandle(ref, () => ({
    fitBoundsToContent: () => {
      if (!mapInstanceRef.current) return;

      const allLatLngs: L.LatLng[] = [];

      // Add ride origin and destination
      if (rideDetails?.origin_coords && Array.isArray(rideDetails.origin_coords)) {
        const originLatLng = safeCreateLatLng(rideDetails.origin_coords[0], rideDetails.origin_coords[1]);
        if (originLatLng) allLatLngs.push(originLatLng);
      }

      if (rideDetails?.destination_coords && Array.isArray(rideDetails.destination_coords)) {
        const destLatLng = safeCreateLatLng(rideDetails.destination_coords[0], rideDetails.destination_coords[1]);
        if (destLatLng) allLatLngs.push(destLatLng);
      }

      // Add driver locations
      drivers.forEach(driver => {
        if (isValidCoordinate(driver.latitude, driver.longitude)) {
          const driverLatLng = safeCreateLatLng(driver.latitude, driver.longitude);
          if (driverLatLng) allLatLngs.push(driverLatLng);
        }
      });

      // Add polyline coordinates
      if (rideDetails?.ride_polyline_coords && Array.isArray(rideDetails.ride_polyline_coords)) {
        rideDetails.ride_polyline_coords.forEach(coord => {
          if (Array.isArray(coord) && isValidCoordinate(coord[0], coord[1])) {
            const polylineLatLng = safeCreateLatLng(coord[0], coord[1]);
            if (polylineLatLng) allLatLngs.push(polylineLatLng);
          }
        });
      }

      // Add driver route coordinates if showRouteMode is true
      if (showRouteMode) {
        drivers.forEach(driver => {
          if (driver.polyline_to_origin_coords && Array.isArray(driver.polyline_to_origin_coords)) {
            driver.polyline_to_origin_coords.forEach(coord => {
              if (Array.isArray(coord) && isValidCoordinate(coord[0], coord[1])) {
                const routeLatLng = safeCreateLatLng(coord[0], coord[1]);
                if (routeLatLng) allLatLngs.push(routeLatLng);
              }
            });
          }
        });
      }

      // Only fit bounds if we have valid coordinates
      if (allLatLngs.length > 0) {
        const bounds = L.latLngBounds(allLatLngs);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }));

  const getStatusInHebrew = (status: string) => {
    switch (status) {
      case 'available': return 'פנוי';
      case 'on-trip': return 'בנסיעה';
      case 'on-break': return 'בהפסקה';
      case 'offline': return 'לא מחובר';
      default: return status;
    }
  };

  return <div ref={mapRef} className="h-full w-full" />;
});
