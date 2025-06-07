
export interface Driver {
  id: string;
  name: string;
  status: 'available' | 'on-trip' | 'on-break' | 'offline';
  location: {
    lat: number;
    lng: number;
  };
  route?: Array<[number, number]>;
  vehicle?: {
    type: string;
    plateNumber: string;
  };
}
