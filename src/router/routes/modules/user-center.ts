import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USERCENTER: AppRouteRecordRaw = {
  path: '/user-center',
  name: 'UserCenter',
  redirect: '/user-center/settings',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.userCenter',
    icon: 'icon-user',
    requiresAuth: true,
    order: 7,
    hideInMenu: true,
  },
  children: [
    {
      path: 'settings',
      name: 'UserSettings',
      component: () => import('@/views/user-center/index.vue'),
      meta: {
        locale: 'menu.userCenter.settings',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};

export default USERCENTER;
