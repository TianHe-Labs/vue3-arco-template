import localeGlobalSetting from '@/components/global-setting/locale/en-US';
import localeToolbar from '@/components/toolbar/locale/en-US';
import localeMessageBox from '@/components/message-box/locale/en-US';
import localeFeedbackPanel from '@/components/feedback-panel/locale/en-US';

import localeLogin from '@/views/login/locale/en-US';

import localeDashboard from '@/views/dashboard/locale/en-US';

import localeUser from '@/views/user/locale/en-US';

import localeNotFound from '@/views/not-found/locale/en-US';

import localeErrors from './en-US/errors';

export default {
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',

  'menu.dashboard': 'Dashboard',
  'menu.user': 'User Center',

  'menu.website': 'Tianhe Security',
  'menu.faq': 'FAQ',

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
