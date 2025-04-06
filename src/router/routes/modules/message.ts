import { DEFAULT_LAYOUT } from '../base';

export default {
  path: '/message',
  name: 'Message',
  redirect: '/message',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '消息通知',
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
        title: '消息列表',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Message',
      },
    },
  ],
};
