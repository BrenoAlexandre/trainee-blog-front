import { lazy } from 'react';
import { IRoute } from './types';

const Login = lazy(() => import('../pages/Login'));
const Home = lazy(() => import('../pages/Home'));
const Error = lazy(() => import('../pages/Error'));

export const routes: IRoute[] = [
  {
    path: '/',
    component: Login,
    public: true,
    adminOnly: false,
  },
  {
    path: '/home',
    component: Home,
    public: true,
    adminOnly: false,
  },
  {
    path: '*',
    component: Error,
    public: true,
    adminOnly: false,
  },
];
