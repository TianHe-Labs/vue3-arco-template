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
    nickname: '管理员',
    role: USERROLE.ADMIN,
    email: 'ex@172.com',
    phone: '19023232243',

    sector: '网络部',
    status: '专注中',
    avatar: '',
    createdAt: '2023-01-10 12:10:00',
    updatedAt: '2023-04-10 12:10:00',
  },
  {
    id: '123243523233',
    username: 'th363',
    password: 'nslab321',
    nickname: '飞翔的荷兰人',
    role: USERROLE.COMMON,
    email: 'th354@173.com',
    phone: '13032322436',

    sector: '事业部',
    status: '上班中',
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
    // 创建更新
    Mock.mock(new RegExp('/api/user/create-update'), (req: MockRequest) => {
      const reqBody = JSON.parse(req?.body as string);
      return successResponseWrap({
        id: reqBody.username, // 创建时需要生成一个ID
        ...reqBody,
        nickname: reqBody.username,
        password: reqBody.username,
      });
    });
    // 删除
    Mock.mock(new RegExp('/api/user/delete'), (req: MockRequest) => {
      const { ids } = JSON.parse(req?.body as string);
      return successResponseWrap({
        ids,
      });
    });
  },
});
