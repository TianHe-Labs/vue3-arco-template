import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/user',
  name: 'User',
  redirect: '/user',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.user',
    icon: 'icon-user',
    requiresAuth: true,
    order: 7,
  },
  children: [
    {
      path: '',
      name: 'Profile',
      component: () => import('@/views/user/index.vue'),
      meta: {
        locale: 'menu.user.profile',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'User',
        hideInMenu: true,
      },
    },
  ],
};

export default USER;
