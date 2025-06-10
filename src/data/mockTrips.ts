
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
  is_regular?: boolean; // נסיעה קבועה
  regular_type?: 'pickup' | 'dropoff'; // פיזור או איסוף
}

// נוצר mock trips עבור 10 ימים (10/6/2025 - 20/6/2025) עם לפחות 40 נסיעות ביום
const generateTrips = (): Trip[] => {
  const trips: Trip[] = [];
  const startDate = new Date('2025-06-10');
  const endDate = new Date('2025-06-20');
  
  const locations = [
    { name: 'רחוב הרצל 15, תל אביב', coords: [32.0853, 34.7818] as [number, number] },
    { name: 'שדרות רוטשילד 40, תל אביב', coords: [32.0668, 34.7647] as [number, number] },
    { name: 'שדרות בן גוריון 25, רמת גן', coords: [32.0719, 34.8225] as [number, number] },
    { name: 'רחוב קק"ל 8, פתח תקווה', coords: [32.0922, 34.8878] as [number, number] },
    { name: 'רחוב סוקולוב 12, הרצליה', coords: [32.1624, 34.8441] as [number, number] },
    { name: 'שדרות ירושלים 35, יפו', coords: [32.0333, 34.7519] as [number, number] },
    { name: 'רחוב אלנבי 45, תל אביב', coords: [32.0668, 34.7647] as [number, number] },
    { name: 'שדרות ויצמן 22, כפר סבא', coords: [32.1749, 34.9120] as [number, number] },
    { name: 'רחוב דיזנגוף 88, תל אביב', coords: [32.0853, 34.7818] as [number, number] },
    { name: 'שדרות הנשיא 15, חולון', coords: [32.0182, 34.7804] as [number, number] },
    { name: 'רחוב הרצל 20, רחובות', coords: [31.8969, 34.8186] as [number, number] },
    { name: 'רחוב הרצל 30, נתניה', coords: [32.3215, 34.8532] as [number, number] },
    { name: 'שדרות בן גוריון 78, חיפה', coords: [32.8156, 34.9892] as [number, number] },
    { name: 'רחוב יפו 123, ירושלים', coords: [31.7683, 35.2137] as [number, number] },
    { name: 'רחוב הראשי 45, נצרת', coords: [32.7940, 35.3035] as [number, number] }
  ];

  const customers = [
    { id: 'C001', name: 'שרה לוי', phone: '050-1234567' },
    { id: 'C002', name: 'יוסי דוד', phone: '052-9876543' },
    { id: 'C003', name: 'מרים כהן', phone: '054-5555555' },
    { id: 'C004', name: 'אליהו גרין', phone: '053-1111111' },
    { id: 'C005', name: 'רחל ברק', phone: '050-7777777' },
    { id: 'C006', name: 'דני רוזן', phone: '052-2222222' },
    { id: 'C007', name: 'לאה שמיר', phone: '054-3333333' },
    { id: 'C008', name: 'עמוס דוד', phone: '053-4444444' },
    { id: 'C009', name: 'רינה לוי', phone: '050-5555555' },
    { id: 'C010', name: 'אבי כהן', phone: '052-6666666' }
  ];

  const drivers = [
    { id: 'D001', name: 'דוד כהן', vehicle: 'מונית' },
    { id: 'D002', name: 'שרה לוי', vehicle: 'מונית' },
    { id: 'D003', name: 'מיכאל אברהם', vehicle: 'מונית' },
    { id: 'D004', name: 'רחל מזרחי', vehicle: 'טרנזיט' },
    { id: 'D005', name: 'יוסי פרידמן', vehicle: 'טרנזיט' },
    { id: 'D006', name: 'ענת גולדברג', vehicle: 'טרנזיט' },
    { id: 'D007', name: 'אמיר שפירא', vehicle: 'מיניבוס' },
    { id: 'D008', name: 'נעמי רוזן', vehicle: 'מיניבוס' },
    { id: 'D009', name: 'אלי דניאל', vehicle: 'מיניבוס' },
    { id: 'D010', name: 'גיל בן דוד', vehicle: 'מיניבוס VIP' },
    { id: 'D011', name: 'מירה חסון', vehicle: 'מיניבוס VIP' },
    { id: 'D012', name: 'רוני ברק', vehicle: 'מיניבוס VIP' },
    { id: 'D013', name: 'אבי שמואל', vehicle: 'מיניבוס VIP גדול' },
    { id: 'D014', name: 'רות כהן', vehicle: 'מיניבוס VIP גדול' },
    { id: 'D015', name: 'משה גרין', vehicle: 'מיניבוס VIP גדול' }
  ];

  const statuses: Trip['status'][] = ['active', 'completed', 'planned', 'open'];
  let tripCounter = 1;

  // נוצר נסיעות עבור כל יום
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    
    // נסיעות קבועות - פיזור (8:00-11:00)
    for (let hour = 8; hour < 11; hour++) {
      for (let i = 0; i < 5; i++) {
        const minute = i * 12; // כל 12 דקות
        const origin = locations[Math.floor(Math.random() * locations.length)];
        const destination = locations[Math.floor(Math.random() * locations.length)];
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const driver = drivers[Math.floor(Math.random() * drivers.length)];
        
        const startTime = new Date(d);
        startTime.setHours(hour, minute, 0);
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 45);

        trips.push({
          trip_id: `T${String(tripCounter++).padStart(3, '0')}`,
          driver_id: driver.id,
          driver_name: driver.name,
          customer_id: customer.id,
          customer_name: customer.name,
          customer_phone: customer.phone,
          status: hour === 8 && minute < 30 ? 'completed' : 'planned',
          origin_address: origin.name,
          destination_address: destination.name,
          origin_coords: origin.coords,
          destination_coords: destination.coords,
          planned_start_time: startTime.toISOString(),
          planned_end_time: endTime.toISOString(),
          distance_km: Math.round((Math.random() * 20 + 5) * 10) / 10,
          estimated_duration_minutes: 45,
          num_passengers: Math.floor(Math.random() * 4) + 1,
          vehicle_type: driver.vehicle,
          price: Math.floor(Math.random() * 100) + 50,
          is_regular: true,
          regular_type: 'dropoff'
        });
      }
    }

    // נסיעות קבועות - איסוף (16:00-19:00)
    for (let hour = 16; hour < 19; hour++) {
      for (let i = 0; i < 5; i++) {
        const minute = i * 12;
        const origin = locations[Math.floor(Math.random() * locations.length)];
        const destination = locations[Math.floor(Math.random() * locations.length)];
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const driver = drivers[Math.floor(Math.random() * drivers.length)];
        
        const startTime = new Date(d);
        startTime.setHours(hour, minute, 0);
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 45);

        trips.push({
          trip_id: `T${String(tripCounter++).padStart(3, '0')}`,
          driver_id: driver.id,
          driver_name: driver.name,
          customer_id: customer.id,
          customer_name: customer.name,
          customer_phone: customer.phone,
          status: hour < 17 ? 'completed' : 'planned',
          origin_address: origin.name,
          destination_address: destination.name,
          origin_coords: origin.coords,
          destination_coords: destination.coords,
          planned_start_time: startTime.toISOString(),
          planned_end_time: endTime.toISOString(),
          distance_km: Math.round((Math.random() * 20 + 5) * 10) / 10,
          estimated_duration_minutes: 45,
          num_passengers: Math.floor(Math.random() * 6) + 1,
          vehicle_type: driver.vehicle,
          price: Math.floor(Math.random() * 100) + 50,
          is_regular: true,
          regular_type: 'pickup'
        });
      }
    }

    // נסיעות רגילות (לא קבועות) - יתר השעות
    const regularHours = [6, 7, 12, 13, 14, 15, 20, 21, 22];
    for (const hour of regularHours) {
      for (let i = 0; i < 3; i++) {
        const minute = Math.floor(Math.random() * 60);
        const origin = locations[Math.floor(Math.random() * locations.length)];
        const destination = locations[Math.floor(Math.random() * locations.length)];
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const driver = drivers[Math.floor(Math.random() * drivers.length)];
        
        const startTime = new Date(d);
        startTime.setHours(hour, minute, 0);
        const endTime = new Date(startTime);
        const duration = Math.floor(Math.random() * 60) + 30;
        endTime.setMinutes(endTime.getMinutes() + duration);

        const status = Math.random() > 0.3 ? statuses[Math.floor(Math.random() * statuses.length)] : 'open';

        trips.push({
          trip_id: `T${String(tripCounter++).padStart(3, '0')}`,
          driver_id: status === 'open' ? '' : driver.id,
          driver_name: status === 'open' ? '' : driver.name,
          customer_id: customer.id,
          customer_name: customer.name,
          customer_phone: customer.phone,
          status: status,
          origin_address: origin.name,
          destination_address: destination.name,
          origin_coords: origin.coords,
          destination_coords: destination.coords,
          planned_start_time: startTime.toISOString(),
          planned_end_time: endTime.toISOString(),
          distance_km: Math.round((Math.random() * 30 + 3) * 10) / 10,
          estimated_duration_minutes: duration,
          num_passengers: Math.floor(Math.random() * 8) + 1,
          vehicle_type: status === 'open' ? '' : driver.vehicle,
          price: Math.floor(Math.random() * 150) + 40,
          is_regular: false
        });
      }
    }
  }

  return trips.sort((a, b) => new Date(a.planned_start_time).getTime() - new Date(b.planned_start_time).getTime());
};

export const mockTrips: Trip[] = generateTrips();

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
