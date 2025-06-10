
export interface Trip {
  trip_id: string;
  driver_id: string;
  driver_name: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  status: 'active' | 'completed' | 'planned' | 'open' | 'cancelled';
  origin_address: string;
  destination_address: string;
  intermediate_stops?: string[];
  origin_coords: [number, number];
  destination_coords: [number, number];
  planned_start_time: string;
  planned_end_time: string;
  actual_start_time?: string;
  actual_end_time?: string;
  distance_km: number;
  estimated_duration_minutes: number;
  num_passengers: number;
  vehicle_type: string;
  price: number;
  notes?: string;
  polyline_coords?: [number, number][];
}

export const mockTrips: Trip[] = [
  {
    trip_id: "T001",
    driver_id: "D001",
    driver_name: "דוד כהן",
    customer_id: "C001",
    customer_name: "שרה לוי",
    customer_phone: "050-1234567",
    status: "active",
    origin_address: "רחוב הרצל 15, תל אביב",
    destination_address: "שדרות רוטשילד 40, תל אביב",
    origin_coords: [32.0853, 34.7818],
    destination_coords: [32.0668, 34.7647],
    planned_start_time: "2024-01-15T09:00:00",
    planned_end_time: "2024-01-15T09:30:00",
    actual_start_time: "2024-01-15T09:05:00",
    distance_km: 3.2,
    estimated_duration_minutes: 30,
    num_passengers: 2,
    vehicle_type: "רכב פרטי",
    price: 45,
    notes: "נסיעה עם עצירה בדרך"
  },
  {
    trip_id: "T002",
    driver_id: "D002",
    driver_name: "משה אברהם",
    customer_id: "C002",
    customer_name: "יוסי דוד",
    customer_phone: "052-9876543",
    status: "planned",
    origin_address: "שדרות בן גוריון 25, רמת גן",
    destination_address: "רחוב קק\"ל 8, פתח תקווה",
    origin_coords: [32.0719, 34.8225],
    destination_coords: [32.0922, 34.8878],
    planned_start_time: "2024-01-15T14:00:00",
    planned_end_time: "2024-01-15T14:45:00",
    distance_km: 8.5,
    estimated_duration_minutes: 45,
    num_passengers: 1,
    vehicle_type: "ואן",
    price: 85
  },
  {
    trip_id: "T003",
    driver_id: "D003",
    driver_name: "אבי שמואל",
    customer_id: "C003",
    customer_name: "מרים כהן",
    customer_phone: "054-5555555",
    status: "completed",
    origin_address: "רחוב סוקולוב 12, הרצליה",
    destination_address: "שדרות ירושלים 35, יפו",
    origin_coords: [32.1624, 34.8441],
    destination_coords: [32.0333, 34.7519],
    planned_start_time: "2024-01-15T08:00:00",
    planned_end_time: "2024-01-15T08:40:00",
    actual_start_time: "2024-01-15T08:02:00",
    actual_end_time: "2024-01-15T08:38:00",
    distance_km: 15.2,
    estimated_duration_minutes: 40,
    num_passengers: 3,
    vehicle_type: "מונית",
    price: 120
  },
  {
    trip_id: "T004",
    driver_id: "D004",
    driver_name: "רון דניאל",
    customer_id: "C004",
    customer_name: "אליהו גרין",
    customer_phone: "053-1111111",
    status: "open",
    origin_address: "רחוב אלנבי 45, תל אביב",
    destination_address: "שדרות ויצמן 22, כפר סבא",
    origin_coords: [32.0668, 34.7647],
    destination_coords: [32.1749, 34.9120],
    planned_start_time: "2024-01-15T16:30:00",
    planned_end_time: "2024-01-15T17:15:00",
    distance_km: 22.3,
    estimated_duration_minutes: 45,
    num_passengers: 1,
    vehicle_type: "רכב פרטי",
    price: 180
  },
  {
    trip_id: "T005",
    driver_id: "D005",
    driver_name: "עמי רוזן",
    customer_id: "C005",
    customer_name: "רחל ברק",
    customer_phone: "050-7777777",
    status: "cancelled",
    origin_address: "רחוב דיזנגוף 88, תל אביב",
    destination_address: "שדרות הנשיא 15, חולון",
    origin_coords: [32.0853, 34.7818],
    destination_coords: [32.0182, 34.7804],
    planned_start_time: "2024-01-15T12:00:00",
    planned_end_time: "2024-01-15T12:30:00",
    distance_km: 7.8,
    estimated_duration_minutes: 30,
    num_passengers: 2,
    vehicle_type: "מונית",
    price: 65
  }
];

export const getStatusInHebrew = (status: string): string => {
  switch (status) {
    case 'active': return 'בדרך';
    case 'completed': return 'הושלמה';
    case 'planned': return 'מתוכננת';
    case 'open': return 'פתוחה';
    case 'cancelled': return 'בוטלה';
    default: return status;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'planned': return 'bg-yellow-100 text-yellow-800';
    case 'open': return 'bg-orange-100 text-orange-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
