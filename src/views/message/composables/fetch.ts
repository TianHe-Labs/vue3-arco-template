import { provide, inject, Ref, reactive, ref, watch, shallowRef } from 'vue';
import { FormInstance, Message, PaginationProps } from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import { isEmpty, isObject, omitBy, pick } from 'lodash';
import useLoading from '@/composables/loading';
import { dayjs } from '@/utils/format';
import {
  messageTypes,
  queryMessageList,
  MessageModel,
  QueryMessageListReq,
  QueryMessageStatRes,
  queryMessageStat,
  QueryMessageStatReq,
} from '@/api/message';

interface FuzzyQueryModel {
  fuzzyWord: string;
  fuzzyKeys: string[];
}

interface FetchMessageState {
  loading: Ref<boolean>;
  pagination: PaginationProps;
  queryPanelVisible: Ref<boolean>;
  toggleQueryPanel: () => void;
  queryFormRef: Ref<FormInstance | null>;
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

  onUpdateRenderData: (data: {
    type: 'update' | 'delete';
    data: MessageModel | MessageModel['id'][];
  }) => void;
}

const symbol = Symbol('FETCH-MESSAGE');

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
    types: messageTypes, // 消息类型，通知、告警，默认全部
    unread: true, // 是否只查询未读消息
    readRange: undefined, // 阅读时间范围
    createdRange: undefined, // 生成时间范围
  };

  if (keys && keys.length) {
    return pick(defaultModel, keys);
  }
  return defaultModel;
};

export function provideFetchMessage(): FetchMessageState {
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

  // 筛选条件面板
  const queryPanelVisible = ref<boolean>(false);

  // 切换筛选条件面板
  const toggleQueryPanel = () => {
    queryPanelVisible.value = !queryPanelVisible.value;
  };

  // 表单实例
  const queryFormRef = shallowRef<FormInstance | null>(null);

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

  // 获取列表数据 (如果在顶层provide，那么只在消息列表页再开始调用获取)
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
    // 如果一个页面中有多个分页，就不需要在地址栏中持久化，否则会相互干扰
    const url = router.resolve({ query: { ...route.query, current } }).href;
    window.history.pushState({}, '', url);
  };

  const onPageSizeChange = (pageSize: number) => {
    // 如果 v-model 双向绑定，则不需要手动绑定
    pagination.pageSize = pageSize;
    pagination.current = 1;
    fetchData();

    // 将分页持久化到地址栏中，防止刷新丢失分页，影响用户体验
    // 如果一个页面中有多个分页，就不需要在地址栏中持久化，否则会相互干扰
    const url = router.resolve({
      query: { ...route.query, current: 1, pageSize },
    }).href;
    window.history.pushState({}, '', url);
  };

  // 响应更新列表
  // 更新渲染数据，删除、新增、更新时使用，惰性请求
  const onUpdateRenderData = (data: {
    type: 'read' | 'update' | 'delete';
    record?: MessageModel;
    ids?: MessageModel['id'][];
    readAt?: string | Date;
  }) => {
    switch (data.type) {
      case 'read':
        // 标记已读
        renderData.value = renderData.value.map((item) => {
          return {
            ...item,
            ...(data?.ids?.includes(item.id)
              ? { readAt: data?.readAt || dayjs().toDate() }
              : {}),
          };
        });
        break;
      case 'update':
        // 更新
        renderData.value = renderData.value.map((item) => {
          if (item.id === data.record?.id) {
            return {
              ...item,
              ...data.record,
            };
          }
          return item;
        });
        break;
      case 'delete':
        // 删除
        renderData.value = renderData.value.filter(
          (item) => !data?.ids?.includes(item.id),
        );

        // 如果整页被删除，则重置分页，并重新请求数据
        if (renderData.value.length === 0) {
          pagination.current = 1;
          fetchData();
        }
        break;
    }
    // 重新获取统计数据
    fetchStats();
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

  const returnState: FetchMessageState = {
    loading,
    pagination,
    queryPanelVisible,
    toggleQueryPanel,
    queryFormRef,
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

    onUpdateRenderData,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useFetchMessage(): FetchMessageState {
  return inject(symbol) as FetchMessageState;
}
