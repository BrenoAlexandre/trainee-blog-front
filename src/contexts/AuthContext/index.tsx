import React, { createContext, useContext, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
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
  authorization: string;
}

interface AuthContextData {
  logged: boolean;
  user: IContextUser;
  Login({ data, authorization }: IContextLogin): Promise<void>;
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

  const Login = async ({ data, authorization }: IContextLogin): Promise<void> => {
    try {
      localStorage.clear();
      setUser(data);

      setTokenStorage('authorization', authorization);
      localStorage.setItem(
        'USER',
        JSON.stringify({ id: data.id, name: data.name, email: data.email, role: data.role, exp: data.exp })
      );
    } catch (error) {
      toastMsg(ToastType.Error, (error as AxiosError).cause?.message || 'Internal Server Error!');
    }
  };

  const Logout = (): void => {
    localStorage.clear();
    setUser(emptyUser);
  };

  const checkToken = (): boolean => {
    let isValid = false;
    if (user.exp) {
      if (new Date(user.exp * 1000) < new Date()) {
        Logout();
        toastMsg(ToastType.Warning, 'Sua sessão expirou.');
      } else isValid = true;
    }

    return isValid;
  };

  const updateUserName = (newName: string): void => {
    setUser({ ...user, name: newName });
  };

  useEffect(() => {
    let isCleaning = false;
    if (!isCleaning) {
      checkToken();
    }
    return () => {
      isCleaning = true;
    };
  });

  useEffect(() => {
    let isCleaning = false;
    if (!isCleaning) {
      const localToken = localStorage.getItem('authorization');
      const localUser = localStorage.getItem('USER');

      setAxiosAuth();

      if (localToken && localUser) {
        setUser(JSON.parse(localUser));
      }
    }
    return () => {
      isCleaning = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ logged: !!user.name, user, Login, Logout, checkToken, updateUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
