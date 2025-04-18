import Mock, { Random } from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/plugins/setup-mock';
import { MockRequest } from '@/mock/types';

const messages = Mock.mock({
  'list|55': [
    {
      'id|8': /[A-Z][a-z][-][0-9]/,
      'title': Random.csentence(12, 20),
      'content': Random.cparagraph(),
      'type|1': ['notice', 'alert'],
      'readAt': undefined,
      'createdAt': Random.datetime(),
      'updatedAt': Random.datetime(),
    },
  ],
});

setupMock({
  setup: () => {
    // 列表
    Mock.mock(new RegExp('/api/message/list'), (params: MockRequest) => {
      const { current = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
      const p = current as number;
      const ps = pageSize as number;
      return successResponseWrap({
        list: messages.list.slice((p - 1) * ps, p * ps),
        total: messages.list.length,
      });
    });

    // 统计
    Mock.mock(new RegExp('/api/message/stat'), () => {
      const list = messages.list;
      return successResponseWrap({
        total: list.length,
        notice: list.filter((item: any) => item.type === 'notice').length,
        alert: list.filter((item: any) => item.type === 'alert').length,
      });
    });

    // 标记已读
    Mock.mock(
      new RegExp('/api/message/readAt/update'),
      (params: MockRequest) => {
        const { ids } = JSON.parse(params?.body as string);
        return successResponseWrap({ ids, readAt: new Date() });
      },
    );

    // 删除
    Mock.mock(new RegExp('/api/message/delete'), (params: MockRequest) => {
      const { ids } = JSON.parse(params?.body as string);
      return successResponseWrap({ ids });
    });
  },
});
