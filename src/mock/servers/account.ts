import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failureResponseWrap,
} from '@/plugins/setup-mock';
import { MockRequest } from '@/mock/types';
import { USERROLE } from '@/store/modules/user/types';

const users = [
  {
    id: '15012312300',
    username: 'admin',
    password: 'nslab321',
    role: USERROLE.ADMIN,
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pc3QifQ.95aGaCg7ovpUWSpoZdCoam6Mvr-vE374VjMfthTpKPo',
    refreshToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pc3QifQ.95aGaCg7ovpUWSpoZdCoam6Mvr-vE374VjMfthTpKPo',
    createdAt: '2023-01-10 12:10:00',
    updatedAt: '2023-04-10 12:10:00',
  },
];

setupMock({
  setup() {
    // 用户登录
    Mock.mock(new RegExp('/api/user/login'), (req: MockRequest) => {
      const { username, password } = JSON.parse(req?.body as string);
      if (!username) {
        return failureResponseWrap('用户名不能为空');
      }
      if (!password) {
        return failureResponseWrap('密码不能为空');
      }

      const foundItem = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundItem) {
        const { accessToken, refreshToken } = foundItem;
        return successResponseWrap({ accessToken, refreshToken });
      }
      return failureResponseWrap('用户名或密码错误！');
    });

    // 获取用户信息
    Mock.mock(new RegExp('/api/user/info'), () => {
      const foundItem = users[0];

      if (foundItem) {
        const { username, role } = foundItem;
        return successResponseWrap({ username, role });
      }
      return failureResponseWrap('用户名或密码错误！');
    });

    // 后去用户服务端菜单
    Mock.mock(new RegExp('/api/user/menu'), () => {
      const menuList = [
        {
          path: '/dashboard',
          name: 'Dashboard',
          meta: {
            title: '仪表盘',
            requiresAuth: true,
            icon: 'icon-dashboard',
            order: 1,
          },
          children: [
            {
              path: 'overview',
              name: 'Overview',
              meta: {
                title: '概览',
                requiresAuth: true,
              },
            },
          ],
        },
      ];
      return successResponseWrap(menuList);
    });
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
