import { lazy } from 'react';
import { IRoute } from './types';

const Login = lazy(() => import('../pages/Login'));
const Home = lazy(() => import('../pages/Home'));
const Post = lazy(() => import('../pages/Post'));
const PostAction = lazy(() => import('../pages/Post/Actions'));
const Category = lazy(() => import('../pages/Category'));
const CategoryAction = lazy(() => import('../pages/Category/Actions'));
const User = lazy(() => import('../pages/User'));
const Error = lazy(() => import('../pages/Error'));

export const routes: IRoute[] = [
  {
    path: '/',
    component: Login,
    public: true,
    adminOnly: false,
    redirectTo: '/home',
  },
  {
    path: '/home',
    component: Home,
    public: true,
    adminOnly: false,
    redirectTo: '/home',
  },

  {
    path: '/post/:id',
    component: Post,
    public: true,
    adminOnly: false,
    redirectTo: '/home',
  },
  {
    path: '/actions/post',
    component: PostAction,
    public: false,
    adminOnly: false,
    redirectTo: '/home',
  },
  {
    path: '/actions/post/:id',
    component: PostAction,
    public: false,
    adminOnly: false,
    redirectTo: '/home',
  },
  {
    path: '/category/:id',
    component: Category,
    public: true,
    adminOnly: false,
    redirectTo: '/home',
  },
  {
    path: '/actions/category',
    component: CategoryAction,
    public: false,
    adminOnly: true,
    redirectTo: '/home',
  },
  {
    path: '/user/:id',
    component: User,
    public: false,
    adminOnly: false,
    redirectTo: '/home',
  },
  {
    path: '*',
    component: Error,
    public: true,
    adminOnly: false,
    redirectTo: '/home',
  },
];
