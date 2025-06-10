
export interface Driver {
  driver_id: string;
  driver_name: string;
  status: 'available' | 'busy' | 'offline' | 'on-trip' | 'on-break';
  latitude: number;
  longitude: number;
  address: string;
  vehicle?: {
    type: string;
    capacity: number;
  };
  polyline_to_origin_coords?: [number, number][];
  schedule?: {
    [key: string]: Array<{
      ride_id: string;
      origin_address: string;
      destination_address: string;
      origin_coords: [number, number];
      destination_coords: [number, number];
      start_time_iso: string;
      end_time_iso: string;
      duration_minutes: number;
      ride_polyline_coords?: [number, number][];
    }>;
  };
  // Additional properties for ride request results
  distance_to_start_km?: number;
  time_to_start_minutes?: number;
}

export interface RideDetails {
  origin_coords: [number, number];
  destination_coords: [number, number];
  ride_polyline_coords: [number, number][];
  estimated_travel_time_seconds?: number;
}
