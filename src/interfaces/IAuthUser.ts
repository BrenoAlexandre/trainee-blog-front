import ERole from '../enums/ERole';

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: ERole;
  exp: number;
}
