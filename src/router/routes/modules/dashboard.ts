import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  redirect: '/dashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.dashboard',
    icon: 'icon-dashboard',
    requiresAuth: true,
    order: 0,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: '',
      name: 'Workplace',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        locale: 'menu.dashboard.workplace',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Dashboard',
      },
    },
  ],
};

export default DASHBOARD;
