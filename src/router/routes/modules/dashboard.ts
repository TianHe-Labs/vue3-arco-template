import { DEFAULT_LAYOUT } from '../base';

export default {
  path: '/dashboard',
  name: 'Dashboard',
  redirect: '/dashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '仪表盘',
    icon: 'icon-dashboard',
    requiresAuth: true,
    order: 0,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: '',
      name: 'Overview',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: '概览',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Dashboard',
      },
    },
  ],
};
