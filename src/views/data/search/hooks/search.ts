import { provide, inject, Ref, reactive, ref, shallowRef } from 'vue';
import { Message, PaginationProps } from '@arco-design/web-vue';
import { watchDebounced } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import { isEmpty, isObject, omitBy, pick } from 'lodash';
import useLoading from '@/hooks/loading';
import { queryXxxxList, XxxxModel, QueryXxxxListReq } from '@/api/xxxx';

interface FuzzyQueryModel {
  fuzzyWord: string;
  fuzzyKeys: string[];
}

interface SearchXXXState {
  loading: Ref<boolean>;
  pagination: PaginationProps;
  queryModel: Ref<QueryXxxxListReq>;
  fuzzyKeys: string[];
  fuzzyQueryModel: Ref<FuzzyQueryModel>;
  renderData: Ref<XxxxModel[]>;

  fetchData: (opts?: any) => Promise<void>;
  onPageChange: (current: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  handleResetQueryModel: (keys?: string[]) => void;
}

const symbol = Symbol('SEARCH');

// 用于（指定属性的）全文关键词检索
const fuzzyKeys = ['name', 'description'];
const resetFuzzyQueryModel = (): FuzzyQueryModel => {
  return {
    fuzzyWord: '', // 匹配的具体值
    fuzzyKeys, // 匹配哪些属性
  };
};

// 用于指定属性的精确筛选
const resetQueryModel = (keys?: string[]): QueryXxxxListReq => {
  const defaultModel = {
    id: undefined,
    name: undefined,
    tags: [],
  };

  if (keys && keys.length) {
    return pick(defaultModel, keys);
  }
  return defaultModel;
};

export function provideSearchXXX(): SearchXXXState {
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
  const queryModel = shallowRef<QueryXxxxListReq>(resetQueryModel());
  // 全文检索条件
  const fuzzyQueryModel = shallowRef<FuzzyQueryModel>(resetFuzzyQueryModel());

  // 检索结果
  const renderData = ref<XxxxModel[]>([]);

  const fetchData = async (opts?: any) => {
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
        (value) => !value || (isObject(value) && isEmpty(value))
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
      const { data } = await queryXxxxList(cleanedParams);
      renderData.value = data.list;
      pagination.total = data.total;
    } catch (err: any) {
      Message.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();

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

  // 条件改变
  // 注意实际开发中，对于需要手动输入的筛选值，最好是通过输入框的会车事件来触发检索
  // 否则在用户输入过程中（筛选参数的变量已随之变化）就触发检索请求，影响用户体验
  watchDebounced(
    // 对于fuzzyQueryModel只监听fuzzyKeys select
    // 至于fuzzyWord 由 input 事件手动触发（输入框回车、点击查询按钮）
    [queryModel, () => fuzzyQueryModel.value.fuzzyKeys],
    () => {
      // 重置分页
      pagination.current = 1;
      pagination.pageSize = 20;
      router.push({ query: undefined });
      fetchData();
    },
    { debounce: 600, deep: true }
  );

  const returnState: SearchXXXState = {
    loading,
    pagination,
    queryModel,
    fuzzyKeys,
    fuzzyQueryModel,
    renderData,

    fetchData,
    handleResetQueryModel,
    onPageChange,
    onPageSizeChange,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useSearchXXX(): SearchXXXState {
  return inject(symbol) as SearchXXXState;
}
