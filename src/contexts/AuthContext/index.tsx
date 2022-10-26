import React, { createContext, useContext, useEffect, useState } from 'react';
import { AxiosError, AxiosResponseHeaders } from 'axios';
import toastMsg, { ToastType } from '../../utils/toastMsg';
import setTokenStorage from '../../utils/setTokenStorage';
import { IAuthUser } from '../../interfaces';
import { setAxiosAuth } from '../../services/httpClient';

interface IContextUser {
  id: string;
  name: string;
  email: string;
  role: string;
  exp: number;
}

interface IContextLogin {
  data: IAuthUser;
  headers: AxiosResponseHeaders;
}

interface AuthContextData {
  logged: boolean;
  user: IContextUser;
  Login({ data, headers }: IContextLogin): Promise<void>;
  Logout(): void;
  checkToken(): boolean;
  updateUserName(newName: string): void;
}

const emptyUser = { id: '', name: '', email: '', role: '', exp: 0 };

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export const AuthProvider = ({ children }: { children: React.ReactElement }): React.ReactElement => {
  const [user, setUser] = useState<IContextUser>(emptyUser);

  useEffect(() => {
    const localToken = localStorage.getItem('authorization');
    const localUser = localStorage.getItem('USER');

    setAxiosAuth();

    if (localToken && localUser) {
      const objUser: IContextUser = JSON.parse(localUser);
      const expDate = new Date(objUser.exp * 1000);

      if (expDate < new Date()) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        Logout();
        toastMsg(ToastType.Info, 'Sua sessão expirou');
      }

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
        JSON.stringify({ id: data.id, name: data.name, email: data.email, role: data.role, exp: data.exp })
      );
    } catch (error) {
      toastMsg(ToastType.Error, (error as AxiosError).response?.data || 'Internal Server Error!');
    }
  }

  const Logout = (): void => {
    localStorage.clear();
    setUser(emptyUser);
  };

  function checkToken(): boolean {
    if (new Date(user.exp * 1000) < new Date()) {
      Logout();
      toastMsg(ToastType.Warning, 'Sua sessão expirou.');
      return false;
    }

    return true;
  }

  const updateUserName = (newName: string): void => {
    setUser({ ...user, name: newName });
  };

  return (
    <AuthContext.Provider value={{ logged: !!user.name, user, Login, Logout, checkToken, updateUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
