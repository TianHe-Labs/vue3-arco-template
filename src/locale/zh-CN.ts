import localeMessageBox from '@/components/message-box/locale/zh-CN';

import localeLogin from '@/views/login/locale/zh-CN';

import localeDashboard from '@/views/dashboard/locale/zh-CN';

import localeUser from '@/views/user/locale/zh-CN';

import localeNotFound from '@/views/not-found/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',

  'menu.dashboard': '仪表盘',
  'menu.user': '个人中心',

  'menu.website': '天合安全',
  'menu.faq': '常见问题',

  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeDashboard,
  ...localeUser,
  ...localeNotFound,
};
