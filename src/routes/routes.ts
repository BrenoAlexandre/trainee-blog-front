import { lazy } from 'react';
import { IRoute } from './types';

const Login = lazy(() => import('../pages/Login'));
const Error = lazy(() => import('../pages/Error'));

export const routes: IRoute[] = [
  {
    path: '/',
    component: Login,
    isPublic: true,
    adminOnly: false,
  },
  {
    path: '*',
    component: Error,
    isPublic: true,
    adminOnly: false,
  },
];
