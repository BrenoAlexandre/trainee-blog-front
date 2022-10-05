import { Secret, verify } from 'jsonwebtoken';
import { AxiosResponseHeaders } from 'axios';
import HttpClient from './httpClient';
import { IAuthUser, IUser } from '../interfaces';
import ERole from '../enums/ERole';

class UsersService {
  static async create(user: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: ERole | 'user';
  }): Promise<void> {
    const { data } = await HttpClient.api.post('/user', user);
    return data;
  }

  static async findById(id: string): Promise<IUser> {
    const { data } = await HttpClient.api.get(`/user/${id}`);
    return data;
  }

  static async update(name: string): Promise<void> {
    const { data } = await HttpClient.api.put(`/user`, { name });
    return data;
  }

  static async login(email: string, password: string): Promise<{ headers: AxiosResponseHeaders; data: IAuthUser }> {
    const { headers } = await HttpClient.api.post('user/login', { email, password });

    if (!headers || !headers.authorization) {
      throw new Error('Token not received');
    }

    const data = verify(headers.authorization, '1q2w3e4r' as Secret) as unknown as IAuthUser;
    return { headers, data };
  }
}

export default UsersService;
