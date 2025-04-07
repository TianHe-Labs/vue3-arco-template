import { provide, inject, Ref, reactive, ref, watch } from 'vue';
import { Message, Modal, PaginationProps } from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import { isEmpty, isObject, omitBy, pick } from 'lodash';
import useLoading from '@/composables/loading';
import {
  queryMessageList,
  MessageModel,
  QueryMessageListReq,
  updateMessageReadAt,
  deleteMessage,
  QueryMessageStatRes,
  queryMessageStat,
  QueryMessageStatReq,
} from '@/api/message';
import { SelectionState } from '@/global';

interface FuzzyQueryModel {
  fuzzyWord: string;
  fuzzyKeys: string[];
}

interface MessageState {
  loading: Ref<boolean>;
  pagination: PaginationProps;
  queryModel: Ref<QueryMessageListReq>;
  fuzzyKeys: string[];
  fuzzyQueryModel: Ref<FuzzyQueryModel>;
  renderStats: Ref<QueryMessageStatRes>;
  renderData: Ref<MessageModel[]>;

  fetchData: (opts?: any) => Promise<void>;
  fetchStats: (params?: QueryMessageStatReq) => Promise<void>;
  onPageChange: (current: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  handleResetQueryModel: (keys?: string[]) => void;

  selectionState: SelectionState;
  toggleSelection: () => void;

  handleMarkRead: () => Promise<void>;
  handleDelete: () => Promise<void>;
}

const symbol = Symbol('MESSAGE');

// 用于（指定属性的）全文关键词检索
const fuzzyKeys = ['title', 'content'];
const resetFuzzyQueryModel = (): FuzzyQueryModel => {
  return {
    fuzzyWord: '', // 匹配的具体值
    fuzzyKeys, // 匹配哪些属性
  };
};

// 用于指定属性的精确筛选
const resetQueryModel = (keys?: string[]): QueryMessageListReq => {
  const defaultModel = {
    type: undefined,
    unread: undefined,
  };

  if (keys && keys.length) {
    return pick(defaultModel, keys);
  }
  return defaultModel;
};

export function provideMessage(): MessageState {
  const { loading, setLoading } = useLoading();

  // 响应式
  const breakpoints = inject('breakpoints') as any;
  // 分页条件

  const route = useRoute();
  const pagination = reactive({
    // 将分页持久化到地址栏中，防止刷新丢失分页，影响用户体验
    current: Number(route.query?.current || 1),
    pageSize: Number(route.query?.pageSize || 20),
    total: 0,
    size: 'small' as any,
    simple: breakpoints.smallerOrEqual('md').value,
    showPageSize: breakpoints.greater('md').value,
    showTotal: true,
    hideOnSinglePage: true,
    bufferSize: 1,
  });

  // 精确筛选条件
  const queryModel = ref<QueryMessageListReq>(resetQueryModel());
  // 全文检索条件
  const fuzzyQueryModel = ref<FuzzyQueryModel>(resetFuzzyQueryModel());

  // 统计
  const renderStats = ref<QueryMessageStatRes>({} as QueryMessageStatRes);

  // 检索结果
  const renderData = ref<MessageModel[]>([]);

  const fetchStats = async (params?: QueryMessageStatReq) => {
    try {
      const { data } = await queryMessageStat(params || {});
      renderStats.value = data;
    } catch (err: any) {
      Message.error(err.message);
    }
  };

  // 获取统计数据
  fetchStats();

  const fetchData = async (opts?: any) => {
    // 控制是否显示 loading
    if (!opts?.hideLoading) {
      setLoading(true);
    }

    // 参数处理
    const cleanedParams = {
      // 合并分页参数
      ...pick(pagination, ['current', 'pageSize']),
      // 过滤掉空值参数，剔除0, '', null, undefined / '',[]
      ...omitBy(
        queryModel.value,
        (value, key) => !value || (isObject(value) && isEmpty(value)),
      ),
      // 处理合并全文检索参数
      ...(fuzzyQueryModel.value.fuzzyWord
        ? fuzzyQueryModel.value.fuzzyKeys.reduce((obj: any, key) => {
            obj[key] = [fuzzyQueryModel.value.fuzzyWord];
            return obj;
          }, {})
        : {}),
    };

    try {
      const { data } = await queryMessageList(cleanedParams);
      renderData.value = data.list;
      pagination.total = data.total;
    } catch (err: any) {
      Message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();
  // 重置
  const handleResetQueryModel = (keys?: string[]) => {
    router.push({ query: {} });
    queryModel.value = { ...queryModel.value, ...resetQueryModel(keys) };
    if (!keys || !keys?.length) {
      fuzzyQueryModel.value = resetFuzzyQueryModel();
    }
  };

  // 分页
  const onPageChange = (current: number) => {
    // 如果 v-model 双向绑定，则不需要手动绑定
    pagination.current = current;
    fetchData();

    // 将分页持久化到地址栏中，防止刷新丢失分页，影响用户体验
    const url = router.resolve({ query: { ...route.query, current } }).href;
    window.history.pushState({}, '', url);
  };

  const onPageSizeChange = async (pageSize: number) => {
    // 如果 v-model 双向绑定，则不需要手动绑定
    pagination.pageSize = pageSize;
    pagination.current = 1;
    fetchData();

    // 将分页持久化到地址栏中，防止刷新丢失分页，影响用户体验
    const url = router.resolve({
      query: { ...route.query, current: 1, pageSize },
    }).href;
    window.history.pushState({}, '', url);
  };

  // 选中消息
  // 显示表格勾选
  const selectionState = reactive<SelectionState>({
    visible: false,
    checked: [],
  });
  const toggleSelection = () => {
    selectionState.checked = [];
    selectionState.visible = !selectionState.visible;
  };

  // 标记已读，不传参数则全部标记
  const markMessageRead = async (ids?: MessageModel['id'][]) => {
    if (!ids || ids.length === 0) {
      Message.warning('请选择要标记已读的消息');
      return;
    }
    try {
      const { data } = await updateMessageReadAt({ ids });
      renderData.value = renderData.value.map((item) => {
        return {
          ...item,
          ...(data?.ids?.includes(item.id) ? { readAt: data.readAt } : {}),
        };
      });
      Message.success(
        `已将${data?.ids?.length || ids?.length || 0}条消息标记为已读`,
      );
      toggleSelection();
    } catch (err: any) {
      Message.error(err.message);
    }
  };

  // 删除，不传参数则全部删除
  const confirmDeleteMessage = async (ids?: MessageModel['id'][]) => {
    if (!ids || ids.length === 0) {
      Message.warning('请选择要删除的消息');
      return;
    }
    // 弹窗确认
    Modal.confirm({
      title: '警告',
      content: '确定要删除消息？',
      titleAlign: 'start',
      modalClass: '!p-5',
      onOk: async () => {
        try {
          const { data } = await deleteMessage({ ids });
          if (data?.ids && data.ids?.length === ids?.length) {
            // 直接在前端逻辑中移除已经被删除的用户，不再请求接口
            renderData.value = renderData.value.filter(
              (item) => !data?.ids?.includes(item.id),
            );
            Message.success(
              `已删除${data?.ids?.length || ids?.length || 0}条消息`,
            );
          } else {
            Message.warning(
              `已删除${data?.ids?.length}条消息, ${
                ids.length - data?.ids?.length
              }条消息删除失败`,
            );
          }
          toggleSelection();
        } catch (err: any) {
          Message.error(err.message);
        }
      },
    });
  };

  const handleMarkRead = async () => {
    if (selectionState.visible) {
      // 如果勾选框显示，则标记已读
      await markMessageRead(selectionState.checked);
    } else {
      // 如果勾选框隐藏，则显示
      toggleSelection();
    }
  };

  const handleDelete = async () => {
    if (selectionState.visible) {
      // 如果勾选框显示，则删除
      await confirmDeleteMessage(selectionState.checked);
    } else {
      // 如果勾选框隐藏，则显示
      toggleSelection();
    }
  };

  // 条件改变
  // 注意实际开发中，对于需要手动输入的筛选值，最好是通过输入框的会车事件来触发检索
  // 否则在用户输入过程中（筛选参数的变量已随之变化）就触发检索请求，影响用户体验
  watch(
    // 对于fuzzyQueryModel只监听fuzzyKeys select
    // 至于fuzzyWord 由 input 事件手动触发（输入框回车、点击查询按钮）
    [queryModel, () => fuzzyQueryModel.value.fuzzyKeys],
    () => {
      // 重置分页
      pagination.current = 1;
      pagination.pageSize = 20;
      fetchData();

      // 将分页持久化到地址栏中，防止刷新丢失分页，影响用户体验
      const url = router.resolve({
        query: { ...route.query, current: 1, pageSize: 20 },
      }).href;
      window.history.pushState({}, '', url);
    },
    { deep: true },
  );

  const returnState: MessageState = {
    loading,
    pagination,
    queryModel,
    fuzzyKeys,
    fuzzyQueryModel,
    renderStats,
    renderData,

    fetchData,
    fetchStats,
    handleResetQueryModel,
    onPageChange,
    onPageSizeChange,

    selectionState,
    toggleSelection,

    handleMarkRead,
    handleDelete,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useMessage(): MessageState {
  return inject(symbol) as MessageState;
}
