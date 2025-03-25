import { DEFAULT_LAYOUT } from '../base';

export default {
  path: '/account',
  name: 'Account',
  redirect: '/account',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '用户中心',
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
        title: '用户中心',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Account',
        hideInMenu: true,
      },
    },
  ],
};
