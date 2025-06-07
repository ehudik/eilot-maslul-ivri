
import { Driver } from '@/types/driver';

export const mockDrivers: Driver[] = [
  {
    id: 'D001',
    name: 'דוד כהן',
    status: 'available',
    location: {
      lat: 32.0853, // Tel Aviv center
      lng: 34.7818
    },
    route: [
      [32.0853, 34.7818], // Tel Aviv
      [32.0904, 34.7767], // North Tel Aviv
      [32.0945, 34.7698], // Ramat Gan
      [32.1009, 34.7589]  // Petah Tikva
    ],
    vehicle: {
      type: 'ואן',
      plateNumber: '123-45-678'
    }
  },
  {
    id: 'D002',
    name: 'שרה לוי',
    status: 'on-trip',
    location: {
      lat: 31.7683, // Jerusalem center
      lng: 35.2137
    },
    route: [
      [31.7683, 35.2137], // Jerusalem
      [31.7784, 35.2066], // West Jerusalem
      [31.7877, 35.1981]  // Ein Kerem
    ],
    vehicle: {
      type: 'משאית',
      plateNumber: '789-12-345'
    }
  },
  {
    id: 'D003',
    name: 'מיכאל אברהם',
    status: 'available',
    location: {
      lat: 32.8156, // Haifa center
      lng: 34.9892
    },
    vehicle: {
      type: 'ואן',
      plateNumber: '456-78-901'
    }
  },
  {
    id: 'D004',
    name: 'רחל מזרחי',
    status: 'on-break',
    location: {
      lat: 31.2518, // Be'er Sheva center
      lng: 34.7915
    },
    vehicle: {
      type: 'משאית גדולה',
      plateNumber: '234-56-789'
    }
  },
  {
    id: 'D005',
    name: 'יוסי פרידמן',
    status: 'available',
    location: {
      lat: 32.7940, // Nazareth center
      lng: 35.3035
    },
    route: [
      [32.7940, 35.3035], // Nazareth
      [32.8021, 35.2987], // Near Nazareth
      [32.8156, 34.9892], // Haifa
    ],
    vehicle: {
      type: 'ואן',
      plateNumber: '567-89-012'
    }
  },
  {
    id: 'D006',
    name: 'ענת גולדברג',
    status: 'offline',
    location: {
      lat: 32.3215, // Netanya center
      lng: 34.8532
    },
    vehicle: {
      type: 'משאית',
      plateNumber: '890-12-345'
    }
  },
  {
    id: 'D007',
    name: 'אמיר שפירא',
    status: 'available',
    location: {
      lat: 31.8969, // Rehovot center
      lng: 34.8186
    },
    vehicle: {
      type: 'ואן',
      plateNumber: '345-67-890'
    }
  }
];
