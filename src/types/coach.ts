export interface Coach {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'coach' | 'student';
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
