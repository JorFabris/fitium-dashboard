import type { Student } from './student';

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  durationSec?: number;
  restSec?: number;
  weightKg?: number;
  notes?: string;
}

export interface WorkoutDay {
  day: WeekDay;
  label?: string;
  exercises: Exercise[];
}

export interface Routine {
  _id: string;
  student: string | Student;
  name: string;
  description?: string;
  days: WorkoutDay[];
  startDate: string;
  endDate?: string;
  active: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
