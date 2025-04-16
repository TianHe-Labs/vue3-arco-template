import { DEFAULT_LAYOUT } from '../base';

export default {
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
      name: 'Overview',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        locale: 'menu.dashboard.overview',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Dashboard',
      },
    },
  ],
};
