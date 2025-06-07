
import { Driver } from '@/types/driver';

export const mockDrivers: Driver[] = [
  {
    id: 'D001',
    name: 'דוד כהן',
    status: 'available',
    location: {
      lat: 32.0853, // Tel Aviv
      lng: 34.7818
    },
    route: [
      [32.0853, 34.7818], // Tel Aviv
      [32.0904, 34.7767],
      [32.0945, 34.7698],
      [32.1009, 34.7589]
    ],
    vehicle: {
      type: 'רכב רגיל',
      plateNumber: '123-45-678'
    }
  },
  {
    id: 'D002',
    name: 'שרה לוי',
    status: 'on-trip',
    location: {
      lat: 31.7683, // Jerusalem
      lng: 35.2137
    },
    route: [
      [31.7683, 35.2137], // Jerusalem
      [31.7784, 35.2066],
      [31.7877, 35.1981]
    ],
    vehicle: {
      type: 'מיניבוס',
      plateNumber: '789-12-345'
    }
  },
  {
    id: 'D003',
    name: 'מיכאל אברהם',
    status: 'available',
    location: {
      lat: 32.8156, // Haifa
      lng: 34.9892
    },
    vehicle: {
      type: 'רכב רגיל',
      plateNumber: '456-78-901'
    }
  },
  {
    id: 'D004',
    name: 'רחל מזרחי',
    status: 'on-break',
    location: {
      lat: 31.2518, // Be'er Sheva
      lng: 34.7915
    },
    vehicle: {
      type: 'רכב גדול',
      plateNumber: '234-56-789'
    }
  },
  {
    id: 'D005',
    name: 'יוסי פרידמן',
    status: 'available',
    location: {
      lat: 32.7940, // Nazareth
      lng: 35.3035
    },
    route: [
      [32.7940, 35.3035], // Nazareth
      [32.8021, 35.2987],
      [32.8156, 34.9892], // to Haifa
    ],
    vehicle: {
      type: 'רכב רגיל',
      plateNumber: '567-89-012'
    }
  },
  {
    id: 'D006',
    name: 'ענת גולדברג',
    status: 'offline',
    location: {
      lat: 32.3215, // Netanya
      lng: 34.8532
    },
    vehicle: {
      type: 'מיניבוס',
      plateNumber: '890-12-345'
    }
  },
  {
    id: 'D007',
    name: 'אמיר שפירא',
    status: 'available',
    location: {
      lat: 31.8969, // Rehovot
      lng: 34.8186
    },
    vehicle: {
      type: 'רכב רגיל',
      plateNumber: '345-67-890'
    }
  },
  {
    id: 'D008',
    name: 'נועה בן דוד',
    status: 'on-trip',
    location: {
      lat: 32.4279, // Kfar Saba
      lng: 34.9064
    },
    route: [
      [32.4279, 34.9064], // Kfar Saba
      [32.3879, 34.8864],
      [32.3215, 34.8532], // to Netanya
    ],
    vehicle: {
      type: 'רכב גדול',
      plateNumber: '678-90-123'
    }
  }
];
