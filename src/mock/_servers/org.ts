import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/plugins/setup-mock';
import { MockRequest } from '@/mock/types';
import { generateCsv } from '@/utils/transform';

setupMock({
  setup() {
    // 部门检索
    Mock.mock(new RegExp('/api/org/search'), (req: MockRequest) => {
      const { current, pageSize } = qs.parseUrl(req.url).query;
      const ps = Number(pageSize) || 20;
      return successResponseWrap({
        total: Mock.Random.integer(100, 500),
        list: new Array(ps).fill(0).map((_, index) =>
          Mock.mock({
            id: '@guid',
            orgName: '@cword(3, 6)',
            orgDescription: '@cword(10, 20)',
            parentOrgId: '@id',
            parentOrg: Mock.mock({
              id: '@guid',
              orgName: '@cword(3, 6)',
            }),
            createdAt: '@datetime',
            updatedAt: '@datetime',
          }),
        ),
      });
    });

    // 导出
    Mock.mock(new RegExp('/api/org/export'), () => {
      const list = new Array(28).fill(0).map((_item, index) => {
        return Mock.mock({
          id: index,
          orgName: '@cword(3, 6)',
          orgDescription: '@cword(10, 20)',
          parentOrgId: '@id',
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

    // 创建
    Mock.mock(new RegExp('/api/org/create'), (req: MockRequest) => {
      const reqBody = JSON.parse(req?.body as string);
      return successResponseWrap({
        // 创建成功的部门列表
        list: reqBody.list.map((item: any) => ({
          id: Mock.mock('@id'),
          ...item,
        })),
      });
    });

    // 更新
    Mock.mock(new RegExp('/api/org/update'), (req: MockRequest) => {
      const reqBody = JSON.parse(req?.body as string);
      return successResponseWrap({
        id: Mock.mock('@id'), // 创建时需要生成一个ID
        ...reqBody,
      });
    });

    // 删除
    Mock.mock(new RegExp('/api/org/delete'), (req: MockRequest) => {
      const { ids } = JSON.parse(req?.body as string);
      return successResponseWrap({
        ids, // 删除成功的IDs
      });
    });
  },
});
