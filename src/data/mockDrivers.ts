import { Driver } from '@/types/driver';

export const mockDrivers: Driver[] = [
  {
    driver_id: 'D001',
    driver_name: 'דוד כהן',
    status: 'available',
    latitude: 32.0853, // Tel Aviv center
    longitude: 34.7818,
    polyline_to_origin_coords: [
      [32.0853, 34.7818], // Tel Aviv
      [32.0904, 34.7767], // North Tel Aviv
      [32.0945, 34.7698], // Ramat Gan
      [32.1009, 34.7589]  // Petah Tikva
    ],
    vehicle: {
      type: 'ואן',
      capacity: 8
    },
    address: 'רחוב הרצל 15, תל אביב'
  },
  {
    driver_id: 'D002',
    driver_name: 'שרה לוי',
    status: 'on-trip',
    latitude: 31.7683, // Jerusalem center
    longitude: 35.2137,
    polyline_to_origin_coords: [
      [31.7683, 35.2137], // Jerusalem
      [31.7784, 35.2066], // West Jerusalem
      [31.7877, 35.1981]  // Ein Kerem
    ],
    vehicle: {
      type: 'משאית',
      capacity: 12
    },
    address: 'רחוב יפו 123, ירושלים'
  },
  {
    driver_id: 'D003',
    driver_name: 'מיכאל אברהם',
    status: 'available',
    latitude: 32.8156, // Haifa center
    longitude: 34.9892,
    vehicle: {
      type: 'ואן',
      capacity: 8
    },
    address: 'שדרות בן גוריון 78, חיפה'
  },
  {
    driver_id: 'D004',
    driver_name: 'רחל מזרחי',
    status: 'on-break',
    latitude: 31.2518, // Be'er Sheva center
    longitude: 34.7915,
    vehicle: {
      type: 'משאית גדולה',
      capacity: 16
    },
    address: 'רחוב הרצל 50, באר שבע'
  },
  {
    driver_id: 'D005',
    driver_name: 'יוסי פרידמן',
    status: 'available',
    latitude: 32.7940, // Nazareth center
    longitude: 35.3035,
    polyline_to_origin_coords: [
      [32.7940, 35.3035], // Nazareth
      [32.8021, 35.2987], // Near Nazareth
      [32.8156, 34.9892], // Haifa
    ],
    vehicle: {
      type: 'ואן',
      capacity: 8
    },
    address: 'רחוב הראשי 45, נצרת'
  },
  {
    driver_id: 'D006',
    driver_name: 'ענת גולדברג',
    status: 'offline',
    latitude: 32.3215, // Netanya center
    longitude: 34.8532,
    vehicle: {
      type: 'משאית',
      capacity: 12
    },
    address: 'רחוב הרצל 30, נתניה'
  },
  {
    driver_id: 'D007',
    driver_name: 'אמיר שפירא',
    status: 'available',
    latitude: 31.8969, // Rehovot center
    longitude: 34.8186,
    vehicle: {
      type: 'ואן',
      capacity: 8
    },
    address: 'רחוב הרצל 20, רחובות'
  }
];
