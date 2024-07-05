import localeGlobalSetting from '@/components/global-setting/locale/zh-CN';
import localeToolbar from '@/components/toolbar/locale/zh-CN';
import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeFeedbackPanel from '@/components/feedback-panel/locale/zh-CN';

import localeLogin from '@/views/login/locale/zh-CN';

import localeDashboard from '@/views/dashboard/locale/zh-CN';

import localeUser from '@/views/user/locale/zh-CN';

import localeNotFound from '@/views/not-found/locale/zh-CN';

import localeErrors from './zh-CN/errors';

export default {
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.overview': '态势感知-服务端',
  'menu.server.screen': '数字孪生-服务端',

  'menu.dashboard': '仪表盘',
  'menu.user': '个人中心',

  'menu.website': '天合安全',
  'menu.faq': '常见问题',

  ...localeGlobalSetting,
  ...localeToolbar,
  ...localeMessageBox,
  ...localeFeedbackPanel,
  ...localeLogin,
  ...localeDashboard,
  ...localeUser,
  ...localeNotFound,
  ...localeErrors,
};
