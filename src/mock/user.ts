import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failResponseWrap,
} from '@/utils/setup-mock';

import { PostData } from '@/types/global';
import { isLogin } from '@/utils/auth';

setupMock({
  setup() {
    // Mock.XHR.prototype.withCredentials = true;

    // 登录
    Mock.mock(new RegExp('/api/user/login'), (params: PostData) => {
      const { username, password } = JSON.parse(params.body);
      if (!username) {
        return failResponseWrap('用户名不能为空', 50000);
      }
      if (!password) {
        return failResponseWrap('密码不能为空', 50000);
      }
      if (username === 'admin' && password === 'nslab321') {
        window.localStorage.setItem('userRole', 'admin');
        return successResponseWrap({
          access_token: '12345',
          refresh_token: '12345',
        });
      }
      if (username === 'user' && password === 'user') {
        window.localStorage.setItem('userRole', 'user');
        return successResponseWrap({
          access_token: '54321',
          refresh_token: '54321',
        });
      }
      return failResponseWrap('账号或者密码错误', 50000);
    });

    // 用户信息
    Mock.mock(new RegExp('/api/user/info'), () => {
      if (isLogin()) {
        const role = window.localStorage.getItem('userRole') || 'admin';
        return successResponseWrap({
          id: '15012312300',
          username: 'admin',
          name: '王立群',
          role,
          email: 'wangliqun@email.com',
          phone: '150****0000',
          avatar: '',
          sector: 'Frontend',
          job: 'frontend',
          location: 'beijing',
          certification: '',
          lastActiveAt: '2023-05-10 12:10:00',
          createdAt: '2023-01-10 12:10:00',
          updatedAt: '2023-04-10 12:10:00',
        });
      }
      return failResponseWrap('未登录', 50008);
    });

    // 用户的服务端菜单
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
