import { DEFAULT_LAYOUT } from '../base';

export default {
  path: '/xxxx',
  name: 'Xxxx',
  redirect: '/xxxx',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '数据管理',
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
        title: '数据查询',
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
        title: '数据查询',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Xxxx',
      },
    },
  ],
};
