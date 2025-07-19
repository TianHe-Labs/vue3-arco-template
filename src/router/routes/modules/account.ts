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
    order: 9,
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
      path: 'info',
      name: 'AccountInfo',
      component: () => import('@/views/account/info/index.vue'),
      meta: {
        locale: 'menu.account.info',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};
