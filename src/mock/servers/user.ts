import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/plugins/setup-mock';
import { MockRequest } from '@/mock/types';
import { USERROLE } from '@/store/modules/user/types';

const users = [
  {
    id: '15012312300',
    username: 'admin',
    password: 'nslab321',
    nickname: '系统管理员',
    role: USERROLE.ADMIN,
    email: 'ex@172.com',
    phone: 19023232243,

    sector: '网络部',
    status: '专注中',
    avatar: '',
    createdAt: '2023-01-10 12:10:00',
    updatedAt: '2023-04-10 12:10:00',
  },
];

setupMock({
  setup() {
    // 用户检索
    Mock.mock(new RegExp('/api/user/search'), (req: MockRequest) => {
      const { current = 1, pageSize = 20 } = qs.parse(req?.url as string);

      const page = Number(current);
      const size = Number(pageSize);

      const list = users.slice((page - 1) * size, page * size);
      return successResponseWrap({
        total: 200,
        list,
      });
    });
  },
});
