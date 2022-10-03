import React, { createContext, useContext, useEffect, useState } from 'react';
import { AxiosError, AxiosResponseHeaders } from 'axios';
import { IUser } from '../../interfaces';
import toastMsg, { ToastType } from '../../utils/toastMsg';
import setTokenStorage from '../../utils/setTokenStorage';

interface IContextUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface IContextLogin {
  data: IUser;
  headers: AxiosResponseHeaders;
}

interface AuthContextData {
  logged: boolean;
  user: IContextUser;
  Login({ data, headers }: IContextLogin): Promise<void>;
  Logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export const AuthProvider = ({ children }: { children: React.ReactElement }): React.ReactElement => {
  const [user, setUser] = useState<IContextUser>({ id: '', name: '', email: '', role: '' });

  useEffect(() => {
    const localToken = localStorage.getItem('authorization');
    const localUser = localStorage.getItem('USER');

    if (localToken && localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

  async function Login({ data, headers }: IContextLogin): Promise<void> {
    try {
      localStorage.clear();
      setUser(data);

      setTokenStorage('authorization', headers.authorization);
      localStorage.setItem(
        'USER',
        JSON.stringify({ id: data.id, name: data.name, email: data.email, role: data.role })
      );
      return;
    } catch (error) {
      toastMsg(ToastType.Error, (error as AxiosError).response?.data || 'Internal Server Error!');
    }
  }

  function Logout(): void {
    localStorage.clear();
    setUser({ id: '', name: '', email: '', role: '' });
  }

  return <AuthContext.Provider value={{ logged: !!user, user, Login, Logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
