import Mock from 'mockjs';

import './servers/dashboard';

import './servers/account';

import './servers/user';

import './servers/message';

import './servers/feedback';

Mock.setup({
  timeout: '600-1000',
});
