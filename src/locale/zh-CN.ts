import localeMessageBox from '@/components/message-box/locale/zh-CN';

import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeUser from '@/views/user/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',

  'menu.dashboard': '仪表盘',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',

  'menu.website': '天合安全',
  'menu.faq': '常见问题',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeUser,
};
