import Mock from 'mockjs';
import { uniqBy } from 'lodash';
import setupMock, { successResponseWrap } from '@/plugins/setup-mock';

setupMock({
  setup: () => {
    // 趋势
    Mock.mock(new RegExp('/api/xxxx/trend'), () => {
      return successResponseWrap({
        list: new Array(10).fill(0).map((_item, index) => ({
          datetime: `00:${String(index).padStart(2, '0')}:00`,
          score: Mock.Random.natural(20, 100), // 评分
          image: Mock.Random.natural(20, 100), // 柱图
          text: Mock.Random.natural(20, 100),
          audio: Mock.Random.natural(20, 100),
          video: Mock.Random.natural(20, 100),
        })),
      });
    });

    // 地理分布
    Mock.mock(new RegExp('/api/xxxx/geo-dist'), () => {
      return successResponseWrap({
        list: uniqBy(
          // 去重
          new Array(Mock.Random.natural(50, 200))
            .fill(0)
            .map((_item, index) => ({
              name: Mock.Random.pick([
                'China',
                'United States',
                'India',
                'Brazil',
                'Russia',
                'Japan',
                'Germany',
                'France',
                'Italy',
                'Spain',
                'United Kingdom',
                'Canada',
                'Australia',
                'Mexico',
                'Argentina',
                'South Africa',
                'Indonesia',
                'Nigeria',
                'Bangladesh',
              ]),
              value: Mock.Random.natural(20, 100),
            })),
          'name',
        ),
      });
    });
  },
});
