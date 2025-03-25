import Mock from 'mockjs';

import './servers/account';

import './servers/user';

import '@/components/message-box/mock';
import './servers/feedback';

Mock.setup({
  timeout: '600-1000',
});
