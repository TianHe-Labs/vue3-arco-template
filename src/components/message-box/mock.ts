import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/plugins/setup-mock';
import { MockRequest } from '@/types/global';

const haveReadIds: number[] = [];
const genMessageList = () => {
  return [
    {
      id: 1,
      type: 'notice',
      title: '郑曦月',
      subTitle: '的私信',
      avatar:
        '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/8361eeb82904210b4f55fab888fe8416.png~tplv-uwbnlip3yd-webp.webp',
      content: '审批请求已发送，请查收',
      createdAt: '今天 12:30:01',
    },
    {
      id: 2,
      type: 'notice',
      title: '宁波',
      subTitle: '的回复',
      avatar:
        '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
      content: '此处 bug 已经修复',
      createdAt: '今天 12:30:01',
    },
    {
      id: 3,
      type: 'notice',
      title: '宁波',
      subTitle: '的回复',
      avatar:
        '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
      content: '此处 bug 已经修复',
      createdAt: '今天 12:20:01',
    },
    {
      id: 4,
      type: 'alert',
      title: '续费通知',
      subTitle: '',
      content: '您的产品使用期限即将截止，如需继续使用产品请前往购…',
      createdAt: '今天 12:20:01',
    },
    {
      id: 5,
      type: 'alert',
      title: '规则开通成功',
      subTitle: '',
      content: '内容屏蔽规则于 2021-12-01 开通成功并生效',
      createdAt: '今天 12:20:01',
    },
  ].map((item) => ({
    ...item,
    readAt: haveReadIds.indexOf(item.id) === -1 ? 0 : 1,
  }));
};

setupMock({
  setup: () => {
    Mock.mock(new RegExp('/api/message/list'), () => {
      return successResponseWrap({ list: genMessageList() });
    });

    Mock.mock(new RegExp('/api/message/read'), (params: MockRequest) => {
      const { ids } = JSON.parse(params?.body as string);
      haveReadIds.push(...(ids || []));
      return successResponseWrap(true);
    });
  },
});
