import localeErrors from './zh-CN/errors';

import localeOptions from './zh-CN/options';

export default {
  // 使用 i18n 来保持页面中的统一
  // 仪表盘
  'menu.dashboard': '仪表盘',
  'menu.dashboard.overview': '概览',
  // 数据检索
  'menu.data': '数据管理',
  'menu.data.search': '数据检索',
  'menu.data.detail': '数据详情',
  // 消息通知
  'menu.message': '消息通知',
  'menu.message.list': '消息列表',
  // 用户管理
  'menu.user': '用户管理',
  'menu.user.list': '用户列表',
  // 账号中心
  'menu.account': '账号中心',
  'menu.account.index': '账号中心',
  // 预览
  'menu.preview': '组件预览',
  'menu.preview.index': '组件预览',

  ...localeErrors,
  ...localeOptions,
};
