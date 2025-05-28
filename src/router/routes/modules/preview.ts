import { DEFAULT_LAYOUT } from '../base';

export default {
  path: '/preview',
  name: 'Preview',
  redirect: '/preview',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.preview',
    icon: 'icon-common',
    requiresAuth: true,
    order: 0,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: '',
      name: 'PreviewIndex',
      component: () => import('@/views/preview/index.vue'),
      meta: {
        locale: 'menu.preview.index',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Preview',
      },
    },
  ],
};
