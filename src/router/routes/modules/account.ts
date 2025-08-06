import { DEFAULT_LAYOUT } from '../base';

export default {
  path: '/account',
  name: 'Account',
  redirect: '/account/setting',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.account',
    icon: 'icon-user',
    requiresAuth: true,
    order: 10,
  },
  children: [
    {
      path: 'setting',
      name: 'AccountSetting',
      component: () => import('@/views/account/setting/index.vue'),
      meta: {
        locale: 'menu.account.setting',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'login-log',
      name: 'AccountLoginLog',
      component: () => import('@/views/account/login-log/index.vue'),
      meta: {
        locale: 'menu.account.loginLog',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};
