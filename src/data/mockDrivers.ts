
import { Driver } from '@/types/driver';

export const mockDrivers: Driver[] = [
  // מונית - עד 4 מקומות
  {
    driver_id: 'D001',
    driver_name: 'דוד כהן',
    status: 'available',
    latitude: 32.0853,
    longitude: 34.7818,
    address: 'רחוב הרצל 15, תל אביב',
    vehicle: {
      type: 'מונית',
      capacity: 4
    }
  },
  {
    driver_id: 'D002',
    driver_name: 'שרה לוי',
    status: 'on-trip',
    latitude: 32.0668,
    longitude: 34.7647,
    address: 'רחוב דיזנגוף 88, תל אביב',
    vehicle: {
      type: 'מונית',
      capacity: 4
    }
  },
  {
    driver_id: 'D003',
    driver_name: 'מיכאל אברהם',
    status: 'available',
    latitude: 32.0719,
    longitude: 34.8225,
    address: 'שדרות בן גוריון 25, רמת גן',
    vehicle: {
      type: 'מונית',
      capacity: 4
    }
  },

  // טרנזיט - עד 8 מקומות
  {
    driver_id: 'D004',
    driver_name: 'רחל מזרחי',
    status: 'available',
    latitude: 32.1624,
    longitude: 34.8441,
    address: 'רחוב סוקולוב 12, הרצליה',
    vehicle: {
      type: 'טרנזיט',
      capacity: 8
    }
  },
  {
    driver_id: 'D005',
    driver_name: 'יוסי פרידמן',
    status: 'on-break',
    latitude: 32.0182,
    longitude: 34.7804,
    address: 'שדרות הנשיא 15, חולון',
    vehicle: {
      type: 'טרנזיט',
      capacity: 8
    }
  },
  {
    driver_id: 'D006',
    driver_name: 'ענת גולדברג',
    status: 'available',
    latitude: 32.1749,
    longitude: 34.9120,
    address: 'שדרות ויצמן 22, כפר סבא',
    vehicle: {
      type: 'טרנזיט',
      capacity: 8
    }
  },

  // מיניבוס - עד 10 מקומות
  {
    driver_id: 'D007',
    driver_name: 'אמיר שפירא',
    status: 'available',
    latitude: 32.0922,
    longitude: 34.8878,
    address: 'רחוב קק"ל 8, פתח תקווה',
    vehicle: {
      type: 'מיניבוס',
      capacity: 10
    }
  },
  {
    driver_id: 'D008',
    driver_name: 'נעמי רוזן',
    status: 'on-trip',
    latitude: 32.0333,
    longitude: 34.7519,
    address: 'שדרות ירושלים 35, יפו',
    vehicle: {
      type: 'מיניבוס',
      capacity: 10
    }
  },
  {
    driver_id: 'D009',
    driver_name: 'אלי דניאל',
    status: 'available',
    latitude: 31.8969,
    longitude: 34.8186,
    address: 'רחוב הרצל 20, רחובות',
    vehicle: {
      type: 'מיניבוס',
      capacity: 10
    }
  },

  // מיניבוס VIP - עד 15 מקומות
  {
    driver_id: 'D010',
    driver_name: 'גיל בן דוד',
    status: 'available',
    latitude: 32.3215,
    longitude: 34.8532,
    address: 'רחוב הרצל 30, נתניה',
    vehicle: {
      type: 'מיניבוס VIP',
      capacity: 15
    }
  },
  {
    driver_id: 'D011',
    driver_name: 'מירה חסון',
    status: 'offline',
    latitude: 31.2518,
    longitude: 34.7915,
    address: 'רחוב הרצל 50, באר שבע',
    vehicle: {
      type: 'מיניבוס VIP',
      capacity: 15
    }
  },
  {
    driver_id: 'D012',
    driver_name: 'רוני ברק',
    status: 'available',
    latitude: 32.7940,
    longitude: 35.3035,
    address: 'רחוב הראשי 45, נצרת',
    vehicle: {
      type: 'מיניבוס VIP',
      capacity: 15
    }
  },

  // מיניבוס VIP גדול - עד 20 מקומות
  {
    driver_id: 'D013',
    driver_name: 'אבי שמואל',
    status: 'available',
    latitude: 32.8156,
    longitude: 34.9892,
    address: 'שדרות בן גוריון 78, חיפה',
    vehicle: {
      type: 'מיניבוס VIP גדול',
      capacity: 20
    }
  },
  {
    driver_id: 'D014',
    driver_name: 'רות כהן',
    status: 'on-trip',
    latitude: 31.7683,
    longitude: 35.2137,
    address: 'רחוב יפו 123, ירושלים',
    vehicle: {
      type: 'מיניבוס VIP גדול',
      capacity: 20
    }
  },
  {
    driver_id: 'D015',
    driver_name: 'משה גרין',
    status: 'available',
    latitude: 32.7940,
    longitude: 35.3035,
    address: 'רחוב הגליל 67, טבריה',
    vehicle: {
      type: 'מיניבוס VIP גדול',
      capacity: 20
    }
  }
];
