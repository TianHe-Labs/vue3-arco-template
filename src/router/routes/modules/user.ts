import { DEFAULT_LAYOUT } from '../base';

export default {
  path: '/user',
  name: 'User',
  redirect: '/user',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.user',
    icon: 'icon-user-group',
    requiresAuth: true,
    order: 8,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: '',
      name: 'UserIndex',
      component: () => import('@/views/user/index.vue'),
      meta: {
        locale: 'menu.user.list',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'User',
      },
    },
  ],
};
