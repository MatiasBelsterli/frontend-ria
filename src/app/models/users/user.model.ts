import { UserRole } from "../../enums/user-role";

export interface User {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  image: string;
}
