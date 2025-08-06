import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failureResponseWrap,
} from '@/plugins/setup-mock';
import { MockRequest } from '@/mock/types.d';
import { USERROLE, USERSTATUS } from '@/api/user';
import { omit } from 'lodash';

const users = [
  {
    id: '15012312300',
    username: 'admin',
    nickname: '管理员',
    password: 'nslab321',
    role: USERROLE.ADMIN,
    // roles: [USERROLE.ADMIN, USERROLE.COMMON],
    org: '网络部',
    status: USERSTATUS.ACTIVE,
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
        (u) => u.username === username && u.password === password,
      );

      if (foundItem) {
        const { accessToken, refreshToken } = foundItem;
        return successResponseWrap({ accessToken, refreshToken });
      }
      return failureResponseWrap('用户名或密码错误');
    });

    // 获取用户信息
    Mock.mock(new RegExp('/api/user/info'), () => {
      const foundItem = users[0];

      if (foundItem) {
        return successResponseWrap(
          omit(foundItem, ['password', 'accessToken', 'refreshToken']),
        );
      }
      return failureResponseWrap('用户名或密码错误');
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

    // 更新头像
    Mock.mock(new RegExp('/api/user/avatar/update'), () => {
      console.log('update avatar');
      return successResponseWrap(Mock.mock({ avatar: '@image(200x200)' }));
    });

    // 更新密码
    Mock.mock(new RegExp('/api/user/password/update'), () => {
      return successResponseWrap({});
    });

    // 获取登录日志
    Mock.mock(new RegExp('/api/user/log/login'), () => {
      return successResponseWrap({
        list: Mock.mock({
          'list|20': [
            {
              id: '@id()',
              userId: '15012312300',
              result: '@pick(["success", "failure", "fault"])',
              bioResult: '@pick(["success", "failure", "fault"])',
              bioConfidence: '@natural(0, 100)',
              mfaResult: '@pick(["success", "failure", "fault"])',
              statusCode: '@pick([200, 401, 403, 404, 500])',
              errorMessage:
                '@pick(["用户名或密码错误", "用户名不存在", "密码错误", "用户被锁定", "用户被禁用"])',
              sourceAgent: '@pick(["web", "app", "api"])',
              sourceIp: '@ip',
              sourceFp:
                '@pick(["abcdefghijklmnopqrstuvwxyzsasasasase312321ewqdwqdwqwepca", "abcdefghijklmnopqrstxxasdsdwqdwqdwdfwfcwuvwxyz"])',
              datetime: '@datetime("yyyy-MM-dd HH:mm:ss")',
            },
          ],
        }).list,
        total: Mock.Random.integer(100, 400),
      });
    });
  },
});
