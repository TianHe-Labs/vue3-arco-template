import localeMessageBox from '@/components/message-box/locale/en-US';

import localeLogin from '@/views/login/locale/en-US';

import localeDashboard from '@/views/dashboard/locale/en-US';

import localeUser from '@/views/user/locale/en-US';

import localeNotFound from '@/views/not-found/locale/en-US';

import localeSettings from './en-US/settings';

export default {
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',

  'menu.dashboard': 'Dashboard',
  'menu.user': 'User Center',

  'menu.website': 'Tianhe Security',
  'menu.faq': 'FAQ',

  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeDashboard,
  ...localeUser,
  ...localeNotFound,
};
