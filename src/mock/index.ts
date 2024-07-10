import Mock from 'mockjs';

import '@/views/dashboard/mock';

import '@/views/user/mock';

import '@/components/message-box/mock';
import '@/components/feedback-panel/mock';

Mock.setup({
  timeout: '600-1000',
});
