import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failureResponseWrap,
} from '@/plugins/setup-mock';

import { MockRequest } from '@/types/global';

const users = [
  {
    id: '15012312300',
    username: 'admin',
    password: 'nslab321',
    role: 'admin',
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

    // 用户信息
    Mock.mock(new RegExp('/api/user/info'), () => {
      const foundItem = users[0];

      if (foundItem) {
        const { username, role } = foundItem;
        return successResponseWrap({ username, role });
      }
      return failureResponseWrap('用户名或密码错误！');
    });

    // 用户服务端菜单
    Mock.mock(new RegExp('/api/user/menu'), () => {
      const menuList = [
        {
          path: '/dashboard',
          name: 'Dashboard',
          meta: {
            locale: 'menu.server.dashboard',
            requiresAuth: true,
            icon: 'icon-dashboard',
            order: 1,
          },
          children: [
            {
              path: 'workplace',
              name: 'Workplace',
              meta: {
                locale: 'menu.server.workplace',
                requiresAuth: true,
              },
            },
          ],
        },
      ];
      return successResponseWrap(menuList);
    });
  },
});
