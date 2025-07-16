import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/plugins/setup-mock';
import { MockRequest } from '@/mock/types.d';

setupMock({
  setup: () => {
    Mock.mock(new RegExp('/api/feedback/create'), (req: MockRequest) => {
      const body = JSON.parse(req?.body as string);
      return successResponseWrap(body);
    });
  },
});
