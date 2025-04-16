import { DEFAULT_LAYOUT } from '../base';

export default {
  path: '/account',
  name: 'Account',
  redirect: '/account',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.account',
    icon: 'icon-user',
    requiresAuth: true,
    order: 7,
  },
  children: [
    {
      path: '',
      name: 'AccountIndex',
      component: () => import('@/views/account/index.vue'),
      meta: {
        locale: 'menu.account.index',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Account',
        hideInMenu: true,
      },
    },
  ],
};
