import Mock from 'mockjs';

import './user';
import '@/components/message-box/mock';

import '@/views/dashboard/workplace/mock';

Mock.setup({
  timeout: '600-1000',
});
