import localeMessageBox from '@/components/message-box/locale/en-US';

import localeLogin from '@/views/login/locale/en-US';

import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';

import localeUser from '@/views/user/locale/en-US';

import localeSettings from './en-US/settings';

export default {
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',

  'menu.dashboard': 'Dashboard',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',

  'menu.website': 'Tianhe Security',
  'menu.faq': 'FAQ',

  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeUser,
};
