import { Secret, verify } from 'jsonwebtoken';
import HttpClient from './httpClient';
import { IAuthUser, IUser } from '../interfaces';
import ERole from '../enums/ERole';
import toastMsg, { ToastType } from '../utils/toastMsg';

class UsersService {
  private static baseUrl = '/user';

  private static toastError = (msg: string): void => {
    toastMsg(ToastType.Error, msg);
  };

  static async create(user: {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    role?: ERole;
  }): Promise<void> {
    return HttpClient.api.post(this.baseUrl, { ...user, role: user.role ?? 'user' }).then((response) => response.data);
  }

  static async findById(id: string): Promise<IUser> {
    return HttpClient.api.get(`${this.baseUrl}/${id}`).then((response) => response.data);
  }

  static async update(name: string): Promise<void> {
    return HttpClient.api.put(`${this.baseUrl}`, { name }).then((response) => response.data);
  }

  static async login(email: string, password: string): Promise<{ authorization: string; data: IAuthUser }> {
    return HttpClient.api.post(`${this.baseUrl}/login`, { email, password }).then((response) => {
      const { authorization } = response.headers;

      if (!authorization) {
        this.toastError('Token not received');
        throw new Error();
      }

      const data = verify(authorization, process.env.REACT_APP_TOKEN_KEY as Secret) as unknown as IAuthUser;
      return { authorization, data };
    });
  }
}

export default UsersService;
