import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/plugins/setup-mock';
import { MockRequest } from '@/types/global';

setupMock({
  setup() {
    // 更新信息
    Mock.mock(new RegExp('/api/user/info/update'), (req: MockRequest) => {
      const { username } = JSON.parse(req.body as string);
      return successResponseWrap({ username });
    });
    // 更新密码
    Mock.mock(new RegExp('/api/user/passwd/update'), (req: MockRequest) => {
      const { username } = JSON.parse(req.body as string);
      return successResponseWrap({ username });
    });
  },
});
