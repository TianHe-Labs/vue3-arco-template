import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/plugins/setup-mock';
import { MockRequest } from '@/types/global';

setupMock({
  setup: () => {
    Mock.mock(new RegExp('/api/feedback/create'), (params: MockRequest) => {
      const body = JSON.parse(params?.body as string);
      return successResponseWrap(body);
    });
  },
});
