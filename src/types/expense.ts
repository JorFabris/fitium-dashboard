export type ExpenseCategory = 'rent' | 'utilities' | 'equipment' | 'maintenance' | 'salaries' | 'marketing' | 'cleaning' | 'other';

export interface Expense {
  _id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  receipt?: string;
  supplier?: string;
  paymentMethod?: 'cash' | 'card' | 'transfer';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
