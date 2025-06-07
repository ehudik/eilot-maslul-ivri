
import { TaskAssignment } from '@/types/task';

export const mockTaskAssignments: TaskAssignment[] = [
  {
    task_id: 'T001',
    driver_id: 'D001',
    task_name: 'איסוף חבילה A',
    start_time: '09:00',
    end_time: '09:45',
    location_address: 'רחוב הרצל 5, תל אביב',
    status: 'הושלם',
    duration_minutes: 45
  },
  {
    task_id: 'T002',
    driver_id: 'D001',
    task_name: 'הורדה בלקוח B',
    start_time: '10:30',
    end_time: '11:15',
    location_address: 'שדרות רוטשילד 12, תל אביב',
    status: 'הושלם',
    duration_minutes: 45
  },
  {
    task_id: 'T003',
    driver_id: 'D002',
    task_name: 'משלוח לירושלים',
    start_time: '08:00',
    end_time: '10:30',
    location_address: 'רחוב יפו 23, ירושלים',
    status: 'בביצוע',
    duration_minutes: 150
  },
  {
    task_id: 'T004',
    driver_id: 'D002',
    task_name: 'איסוף ממחסן',
    start_time: '11:00',
    end_time: '11:30',
    location_address: 'רחוב התעשייה 8, ירושלים',
    status: 'מתוכנן',
    duration_minutes: 30
  },
  {
    task_id: 'T005',
    driver_id: 'D003',
    task_name: 'משלוח לחיפה',
    start_time: '07:30',
    end_time: '09:00',
    location_address: 'שדרות הנשיא 15, חיפה',
    status: 'הושלם',
    duration_minutes: 90
  },
  {
    task_id: 'T006',
    driver_id: 'D003',
    task_name: 'איסוף מנמל',
    start_time: '14:00',
    end_time: '15:30',
    location_address: 'נמל חיפה, חיפה',
    status: 'מתוכנן',
    duration_minutes: 90
  },
  {
    task_id: 'T007',
    driver_id: 'D005',
    task_name: 'משלוח לנצרת',
    start_time: '09:30',
    end_time: '11:00',
    location_address: 'רחוב פאול השישי 2, נצרת',
    status: 'בביצוע',
    duration_minutes: 90
  },
  {
    task_id: 'T008',
    driver_id: 'D007',
    task_name: 'איסוף חבילות',
    start_time: '08:15',
    end_time: '09:30',
    location_address: 'רחוב הרצוג 10, רחובות',
    status: 'הושלם',
    duration_minutes: 75
  },
  {
    task_id: 'T009',
    driver_id: 'D007',
    task_name: 'משלוח מהיר',
    start_time: '13:00',
    end_time: '14:15',
    location_address: 'רחוב ויצמן 25, רחובות',
    status: 'מתוכנן',
    duration_minutes: 75
  }
];
