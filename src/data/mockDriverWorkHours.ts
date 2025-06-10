
export interface DriverWorkHours {
  driver_id: string;
  current_continuous_driving: number; // in minutes
  daily_driving_time: number; // in minutes
  weekly_driving_time: number; // in minutes
  daily_work_time: number; // in minutes
  last_break_time: string; // ISO string
  last_daily_rest: string; // ISO string
  last_weekly_rest: string; // ISO string
  needs_break: boolean;
  needs_daily_rest: boolean;
  needs_weekly_rest: boolean;
  compliance_violations: number;
  status: 'available' | 'driving' | 'on_break' | 'resting' | 'off_duty';
}

export const mockDriverWorkHours: DriverWorkHours[] = [
  {
    driver_id: "D001",
    current_continuous_driving: 180, // 3 hours
    daily_driving_time: 420, // 7 hours
    weekly_driving_time: 2100, // 35 hours
    daily_work_time: 480, // 8 hours
    last_break_time: "2024-01-08T14:30:00Z",
    last_daily_rest: "2024-01-07T22:00:00Z",
    last_weekly_rest: "2024-01-06T18:00:00Z",
    needs_break: false,
    needs_daily_rest: false,
    needs_weekly_rest: false,
    compliance_violations: 0,
    status: 'available'
  },
  {
    driver_id: "D002",
    current_continuous_driving: 240, // 4 hours - needs break!
    daily_driving_time: 660, // 11 hours
    weekly_driving_time: 4200, // 70 hours
    daily_work_time: 720, // 12 hours
    last_break_time: "2024-01-08T10:00:00Z",
    last_daily_rest: "2024-01-07T23:00:00Z",
    last_weekly_rest: "2024-01-02T20:00:00Z",
    needs_break: true,
    needs_daily_rest: false,
    needs_weekly_rest: false,
    compliance_violations: 2,
    status: 'driving'
  },
  {
    driver_id: "D003",
    current_continuous_driving: 90, // 1.5 hours
    daily_driving_time: 360, // 6 hours
    weekly_driving_time: 2520, // 42 hours
    daily_work_time: 420, // 7 hours
    last_break_time: "2024-01-08T13:00:00Z",
    last_daily_rest: "2024-01-07T21:30:00Z",
    last_weekly_rest: "2024-01-05T19:00:00Z",
    needs_break: false,
    needs_daily_rest: false,
    needs_weekly_rest: false,
    compliance_violations: 0,
    status: 'available'
  },
  {
    driver_id: "D004",
    current_continuous_driving: 0,
    daily_driving_time: 720, // 12 hours - at limit!
    weekly_driving_time: 4260, // 71 hours
    daily_work_time: 720, // 12 hours - at limit!
    last_break_time: "2024-01-08T16:00:00Z",
    last_daily_rest: "2024-01-07T22:30:00Z",
    last_weekly_rest: "2024-01-03T17:00:00Z",
    needs_break: false,
    needs_daily_rest: true,
    needs_weekly_rest: false,
    compliance_violations: 1,
    status: 'on_break'
  },
  {
    driver_id: "D005",
    current_continuous_driving: 150, // 2.5 hours
    daily_driving_time: 300, // 5 hours
    weekly_driving_time: 4320, // 72 hours - at weekly limit!
    daily_work_time: 360, // 6 hours
    last_break_time: "2024-01-08T14:00:00Z",
    last_daily_rest: "2024-01-07T23:30:00Z",
    last_weekly_rest: "2024-01-01T16:00:00Z",
    needs_break: false,
    needs_daily_rest: false,
    needs_weekly_rest: true,
    compliance_violations: 1,
    status: 'available'
  },
  {
    driver_id: "D006",
    current_continuous_driving: 30, // 0.5 hours
    daily_driving_time: 180, // 3 hours
    weekly_driving_time: 1800, // 30 hours
    daily_work_time: 240, // 4 hours
    last_break_time: "2024-01-08T15:30:00Z",
    last_daily_rest: "2024-01-07T21:00:00Z",
    last_weekly_rest: "2024-01-04T18:00:00Z",
    needs_break: false,
    needs_daily_rest: false,
    needs_weekly_rest: false,
    compliance_violations: 0,
    status: 'available'
  }
];

export const getDriverWorkStatus = (driverId: string): DriverWorkHours | null => {
  return mockDriverWorkHours.find(driver => driver.driver_id === driverId) || null;
};

export const getDriversNeedingBreak = (): DriverWorkHours[] => {
  return mockDriverWorkHours.filter(driver => driver.needs_break);
};

export const getDriversNeedingRest = (): DriverWorkHours[] => {
  return mockDriverWorkHours.filter(driver => driver.needs_daily_rest || driver.needs_weekly_rest);
};

export const getComplianceViolations = (): DriverWorkHours[] => {
  return mockDriverWorkHours.filter(driver => driver.compliance_violations > 0);
};
