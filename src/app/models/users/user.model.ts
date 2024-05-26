import { UserRole } from "../../enums/user-role";

export interface User {
  email: string;
  password: string;
  role: UserRole;
  phone: string;
}