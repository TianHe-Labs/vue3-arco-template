import { type Ref, provide, inject, ref, computed, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { dayjs } from '@/utils/fotmat';
import useLoading from '@/hooks/loading';
import {
  queryMessageList,
  updateMessageStatus,
  MessageRecord,
  MessageType,
} from '@/api/message';

interface TabItem {
  key: string;
  title: string;
  avatar?: string;
}

interface MessageCtx {
  triggerRef: Ref<HTMLElement | undefined>;
  setPopoverVisible: (event: MouseEvent) => void;
  loading: Ref<boolean>;
  tabList: TabItem[];
  messageType: Ref<MessageType>;
  sourceData: Ref<MessageRecord[]>;
  renderData: Ref<MessageRecord[]>;
  renderStats: Ref<Record<string, number>>;
  handleMarkRead: (ids: MessageRecord['id'][]) => Promise<void>;
  handleMarkAllRead: (messageType?: MessageType) => void;
  handleClearData: () => void;
}

const key = Symbol('MESSAGE');

export function provideMessage(): MessageCtx {
  const triggerRef = shallowRef<HTMLElement | undefined>();
  const setPopoverVisible = (event: MouseEvent) => {
    const rect = (event.currentTarget as any).getBoundingClientRect();
    // 将触发器的位置和大小设置给隐藏的div
    Object.assign((triggerRef.value as HTMLElement).style, {
      position: 'absolute',
      top: `${rect.top + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
    const newEvent = new MouseEvent('click', {
      bubbles: true,
    });
    triggerRef.value?.dispatchEvent(newEvent);
  };

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  const sourceData = ref<MessageRecord[]>([]);

  const tabList: TabItem[] = [
    {
      key: 'notice',
      title: t('messageBox.tab.title.notice'),
    },
    {
      key: 'alert',
      title: t('messageBox.tab.title.alert'),
    },
  ];
  const messageType = ref<MessageType>('notice');
  // 当前TAB
  const renderData = computed(() =>
    (sourceData.value || [])?.filter((item) => item.type === messageType.value)
  );
  // 统计各TAB未读数量
  const renderStats = computed(() => {
    return (sourceData.value || []).reduce((result: any, current) => {
      // 全部
      if (!result?.total) {
        result.total = 0;
      }

      // 分类
      if (!result?.[current.type]) {
        result[current.type] = 0;
      }
      if (!current?.readAt) {
        result.total += 1;
        result[current.type] += 1;
      }
      return result;
    }, {});
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await queryMessageList();
      sourceData.value = data.list || [];
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  // 点击标记已读，单个或批量
  const handleMarkRead = async (ids: MessageRecord['id'][]) => {
    try {
      await updateMessageStatus({ ids });
      // 标记成功，不再刷新列表，否则已读的会清空
      // 直接在前端标记，但是已读的条目还在
      sourceData.value = sourceData.value.map((item) => {
        return {
          ...item,
          ...(ids?.includes(item.id) ? { readAt: dayjs().format() } : {}),
        };
      });
    } catch (err: any) {
      Message.error(err?.message);
    }
  };

  // 全部标记已读
  const handleMarkAllRead = async (type?: MessageType) => {
    // 筛选一下目前尚未已读的id
    let items = sourceData.value;
    if (type) {
      items = renderData.value;
    }
    const unreadItems: MessageRecord['id'][] = [];
    items.forEach((item) => {
      if (!item?.readAt) {
        unreadItems.push(item.id);
      }
    });
    if (unreadItems.length) {
      await handleMarkRead(unreadItems);
    }
  };

  // 清空列表
  const handleClearData = () => {
    if (!sourceData.value || !sourceData.value.length) {
      return;
    }
    // 全部标记为已读
    handleMarkAllRead();
    // 然后清空列表
    sourceData.value = [];
  };

  const returnState = {
    triggerRef,
    setPopoverVisible,
    loading,
    tabList,
    messageType,
    sourceData,
    renderData,
    renderStats,
    handleMarkRead,
    handleMarkAllRead,
    handleClearData,
  };

  provide(key, returnState);

  return returnState;
}

export function useMessage(): MessageCtx {
  return inject(key) as MessageCtx;
}
