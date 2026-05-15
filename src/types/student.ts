export interface MonthlyFee {
  _id: string;
  student: string;
  month: number;
  year: number;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  paidAt?: string;
  paymentMethod?: 'cash' | 'transfer' | 'card' | 'other';
  discount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  idNumber?: string;
  birthDate: string;
  email?: string;
  phone?: string;
  emergencyPhone?: string;
  address?: string;
  enrollmentDate: string;
  active: boolean;
  photo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastPayment?: MonthlyFee | null;
}
