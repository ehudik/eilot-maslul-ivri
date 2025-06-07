
import { Driver } from '@/types/driver';

export const mockDrivers: Driver[] = [
  {
    id: 'D001',
    name: 'יוסי כהן',
    status: 'available',
    location: { lat: 32.0853, lng: 34.7818 },
    vehicle: { type: 'רכב פרטי', plateNumber: '123-45-678' }
  },
  {
    id: 'D002', 
    name: 'מרים לוי',
    status: 'on-trip',
    location: { lat: 32.0944, lng: 34.7767 },
    route: [
      [32.0944, 34.7767],
      [32.0980, 34.7720],
      [32.1015, 34.7680],
      [32.1050, 34.7640]
    ],
    vehicle: { type: 'מיניבוס', plateNumber: '987-65-432' }
  },
  {
    id: 'D003',
    name: 'אבי דוד',
    status: 'on-break',
    location: { lat: 32.0750, lng: 34.7900 },
    vehicle: { type: 'רכב פרטי', plateNumber: '555-44-333' }
  },
  {
    id: 'D004',
    name: 'שרה אברהם',
    status: 'available',
    location: { lat: 32.1000, lng: 34.7600 },
    vehicle: { type: 'רכב מסחרי', plateNumber: '777-88-999' }
  },
  {
    id: 'D005',
    name: 'רמי ישראל',
    status: 'on-trip',
    location: { lat: 32.0700, lng: 34.8000 },
    route: [
      [32.0700, 34.8000],
      [32.0730, 34.7950],
      [32.0760, 34.7900]
    ],
    vehicle: { type: 'רכב פרטי', plateNumber: '111-22-333' }
  },
  {
    id: 'D006',
    name: 'דנה מזרחי',
    status: 'offline',
    location: { lat: 32.0600, lng: 34.7700 },
    vehicle: { type: 'רכב פרטי', plateNumber: '444-55-666' }
  },
  {
    id: 'D007',
    name: 'אלון גולן',
    status: 'available',
    location: { lat: 32.1100, lng: 34.7500 },
    vehicle: { type: 'מיניבוס', plateNumber: '888-99-000' }
  },
  {
    id: 'D008',
    name: 'נועה ברק',
    status: 'on-trip',
    location: { lat: 32.0900, lng: 34.7850 },
    route: [
      [32.0900, 34.7850],
      [32.0920, 34.7800],
      [32.0940, 34.7750],
      [32.0960, 34.7700],
      [32.0980, 34.7650]
    ],
    vehicle: { type: 'רכב פרטי', plateNumber: '222-33-444' }
  }
];
