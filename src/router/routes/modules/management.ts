import { DEFAULT_LAYOUT } from '../base';

// 人员管理路由配置
export default {
  path: '/management',
  name: 'Management',
  redirect: '/management/user',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.management',
    icon: 'icon-user-group',
    requiresAuth: true,
    order: 9, // 组织管理
  },
  children: [
    {
      path: 'user',
      name: 'UserManagement',
      component: () => import('@/views/management/user/index.vue'),
      meta: {
        locale: 'menu.management.user',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'org',
      name: 'OrgManagement',
      component: () => import('@/views/management/org/index.vue'),
      meta: {
        locale: 'menu.management.org',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};
