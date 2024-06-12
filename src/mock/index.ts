import Mock from 'mockjs';

import './user';
import './message-box';
import './feedback';

import '@/views/dashboard/mock';

Mock.setup({
  timeout: '600-1000',
});
