import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/plugins/setup-mock';
import { MockRequest } from '@/mock/types.d';
import { USERROLE, USERSTATUS } from '@/api/user';
import { enum2Arr, generateCsv } from '@/utils/transform';

setupMock({
  setup() {
    // 用户检索
    Mock.mock(new RegExp('/api/user/search'), (req: MockRequest) => {
      const { current, pageSize } = qs.parseUrl(req.url).query;
      const ps = Number(pageSize) || 20;
      return successResponseWrap({
        total: 21,
        list: new Array(ps).fill(0).map((_, index) =>
          Mock.mock({
            id: index,
            username: '@cword(3, 6)',
            nickname: '@name',
            role: Mock.Random.pick(enum2Arr(USERROLE)),
            email: '@email',
            phone:
              '@pick(["13012345678", "13112345678", "13212345678", "13312345678", "13412345678", "13512345678", "13612345678", "13712345678", "13812345678", "13912345678"])',
            orgId: '@id',
            org: Mock.mock({
              id: '@id',
              orgName: '@cword(3, 6)',
            }),
            status: () => Mock.Random.pick(enum2Arr(USERSTATUS)),
            avatar: '@image(100x100, #000, #fff, avatar)',
            createdAt: '@datetime',
            updatedAt: '@datetime',
          }),
        ),
      });
    });

    // 导出
    Mock.mock(new RegExp('/api/user/export'), () => {
      const list = new Array(28).fill(0).map((_item, index) => {
        return Mock.mock({
          id: index,
          username: '@cword(3, 6)',
          nickname: '@name',
          role: () => Mock.Random.pick(enum2Arr(USERROLE)),
          email: '@email',
          phone:
            '@pick(["13012345678", "13112345678", "13212345678", "13312345678", "13412345678", "13512345678", "13612345678", "13712345678", "13812345678", "13912345678"])',
          orgId: '@id',
          org: Mock.mock({
            id: '@id',
            orgName: '@cword(3, 6)',
          }),
          status: () => Mock.Random.pick(enum2Arr(USERSTATUS)),
          avatar: '@image(100x100, #000, #fff, avatar)',
          createdAt: '@datetime',
          updatedAt: '@datetime',
        });
      });

      const content = generateCsv(list);
      const contentType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const blob = new Blob([content], { type: contentType });
      return successResponseWrap(blob);
    });

    // 创建（批量）
    Mock.mock(new RegExp('/api/user/create'), (req: MockRequest) => {
      const reqBody = JSON.parse(req?.body as string);
      return successResponseWrap({
        // 创建成功的用户列表
        list: reqBody.list.map((item: any) => ({
          id: Mock.mock('@id'), // 创建时需要生成一个ID
          ...item,
        })),
      });
    });

    // 更新
    Mock.mock(new RegExp('/api/user/update'), (req: MockRequest) => {
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
        ids, // 删除成功的IDs
      });
    });
  },
});
