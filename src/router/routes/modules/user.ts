import { DEFAULT_LAYOUT } from '../base';

export default {
  path: '/user',
  name: 'User',
  redirect: '/user',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '用户管理',
    icon: 'icon-user-group',
    requiresAuth: true,
    order: 9,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: '',
      name: 'UserIndex',
      component: () => import('@/views/user/index.vue'),
      meta: {
        title: '用户列表',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'User',
      },
    },
  ],
};
