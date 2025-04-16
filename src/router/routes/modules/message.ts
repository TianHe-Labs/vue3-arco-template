import { DEFAULT_LAYOUT } from '../base';

export default {
  path: '/message',
  name: 'Message',
  redirect: '/message',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.message',
    icon: 'icon-message',
    requiresAuth: true,
    order: 8,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: '',
      name: 'MessageList',
      component: () => import('@/views/message/index.vue'),
      meta: {
        locale: 'menu.message.list',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Message',
      },
    },
  ],
};
