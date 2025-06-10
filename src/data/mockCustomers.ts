
export interface Customer {
  customer_id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  registration_date: string;
  total_trips: number;
  total_spent: number;
  preferred_vehicle_type?: string;
  vip_status: boolean;
  notes?: string;
}

export const mockCustomers: Customer[] = [
  {
    customer_id: "C001",
    name: "שרה לוי",
    phone: "050-1234567",
    email: "sarah.levi@email.com",
    address: "רחוב הרצל 15, תל אביב",
    registration_date: "2023-06-15",
    total_trips: 28,
    total_spent: 1680,
    preferred_vehicle_type: "רכב פרטי",
    vip_status: true,
    notes: "לקוחה VIP - שירות מהיר"
  },
  {
    customer_id: "C002",
    name: "יוסי דוד",
    phone: "052-9876543",
    email: "yossi.david@email.com",
    address: "שדרות בן גוריון 25, רמת גן",
    registration_date: "2023-08-22",
    total_trips: 15,
    total_spent: 945,
    preferred_vehicle_type: "ואן",
    vip_status: false
  },
  {
    customer_id: "C003",
    name: "מרים כהן",
    phone: "054-5555555",
    email: "miriam.cohen@email.com",
    address: "רחוב סוקולוב 12, הרצליה",
    registration_date: "2023-04-10",
    total_trips: 42,
    total_spent: 2520,
    preferred_vehicle_type: "מונית",
    vip_status: true,
    notes: "נסיעות קבועות למקום העבודה"
  },
  {
    customer_id: "C004",
    name: "אליהו גרין",
    phone: "053-1111111",
    email: "eli.green@email.com",
    address: "רחוב אלנבי 45, תל אביב",
    registration_date: "2023-11-05",
    total_trips: 8,
    total_spent: 640,
    vip_status: false
  },
  {
    customer_id: "C005",
    name: "רחל ברק",
    phone: "050-7777777",
    email: "rachel.barak@email.com",
    address: "רחוב דיזנגוף 88, תל אביב",
    registration_date: "2023-09-18",
    total_trips: 22,
    total_spent: 1430,
    preferred_vehicle_type: "מונית",
    vip_status: false
  }
];
