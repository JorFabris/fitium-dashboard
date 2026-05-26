import type { Coach } from './coach';
import type { Student } from './student';

export interface Class {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  weekDays: string[];
  coach: string | Coach;
  capacity: number;
  bookings: (string | Student)[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
