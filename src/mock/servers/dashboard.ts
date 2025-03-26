import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/plugins/setup-mock';

setupMock({
  setup: () => {
    Mock.mock(new RegExp('/api/xxxx/dist'), () => {
      return successResponseWrap(
        new Array(28).fill(0).map((_item, index) => ({
          datetime: `00:${String(index * 2).padStart(2, '0')}:00`,
          image: Mock.Random.natural(20, 100),
          text: Mock.Random.natural(20, 100),
          audio: Mock.Random.natural(20, 100),
          video: Mock.Random.natural(20, 100),
        }))
      );
    });
  },
});
