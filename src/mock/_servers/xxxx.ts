import Mock, { Random } from 'mockjs';
import qs from 'query-string';
import { generateCsv } from '@/utils/transform';
import setupMock, { successResponseWrap } from '@/plugins/setup-mock';
import { MockRequest } from '@/mock/types.d';

const xxxxs = Mock.mock({
  'list|55': [
    {
      'id|8': /[A-Z][a-z][-][0-9]/,
      'name': Random.csentence(12, 20),
      'description': Random.cparagraph(),
      'tags|1-3': [Random.cword(4, 9)],
      'createdAt': Random.datetime(),
      'updatedAt': Random.datetime(),
    },
  ],
});

setupMock({
  setup: () => {
    // 列表
    Mock.mock(new RegExp('/api/xxxx/search'), (req: MockRequest) => {
      const { current = 1, pageSize = 10 } = qs.parseUrl(req.url).query;
      const p = current as number;
      const ps = pageSize as number;
      return successResponseWrap({
        list: xxxxs.list.slice((p - 1) * ps, p * ps),
        total: xxxxs.list.length,
      });
    });

    // 导出
    Mock.mock(new RegExp('/api/xxxx/export'), () => {
      const content = generateCsv(xxxxs.list);
      const contentType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const blob = new Blob([content], { type: contentType });
      return successResponseWrap(blob);
    });

    // 更新
    Mock.mock(new RegExp('/api/xxxx/update'), (req: MockRequest) => {
      const { id, name, description, tags } = JSON.parse(req.body as string);
      return successResponseWrap({
        id,
        name,
        description,
        tags,
      });
    });

    // 删除
    Mock.mock(new RegExp('/api/xxxx/delete'), (req: MockRequest) => {
      const { ids } = JSON.parse(req.body as string);
      return successResponseWrap({
        ids,
      });
    });
  },
});
