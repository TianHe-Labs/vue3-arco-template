import { DEFAULT_LAYOUT } from '../base';

export default {
  path: '/xxxx',
  name: 'Xxxx',
  redirect: '/xxxx',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.data',
    icon: 'icon-search',
    requiresAuth: true,
    order: 2,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: '',
      name: 'XxxxSearch',
      component: () => import('@/views/data/search/index.vue'),
      meta: {
        locale: 'menu.data.search',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Xxxx',
      },
    },
    {
      path: 'detail/:id',
      name: 'XxxxDetail',
      props: true,
      component: () => import('@/views/data/detail/index.vue'),
      meta: {
        locale: 'menu.data.detail',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Xxxx',
      },
    },
  ],
};
