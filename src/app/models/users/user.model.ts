import { userRole } from '../../enums/userRole';
export interface User {
  email: string;
  password: string;
  role: userRole;
  phone: string;
}