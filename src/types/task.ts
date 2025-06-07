
export interface TaskAssignment {
  task_id: string;
  driver_id: string;
  task_name: string;
  start_time: string;
  end_time: string;
  location_address: string;
  status: 'מתוכנן' | 'בביצוע' | 'הושלם';
  duration_minutes?: number;
}
