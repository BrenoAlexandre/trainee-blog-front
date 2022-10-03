import ERole from '../enums/ERole';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: ERole;
  exp?: string;
}
