import { provide, inject, Ref, reactive, ref, watch, shallowRef } from 'vue';
import {
  FormInstance,
  Message,
  Modal,
  PaginationProps,
} from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import { isEmpty, isObject, omitBy, pick } from 'lodash';
import useLoading from '@/composables/loading';
import { queryUserList, UserModel, QueryUserListReq } from '@/api/user';

interface FuzzyQueryModel {
  fuzzyWord: string;
  fuzzyKeys: string[];
}

interface SearchUserState {
  loading: Ref<boolean>;
  pagination: PaginationProps;
  queryFormRef: Ref<FormInstance>;
  queryModel: Ref<QueryUserListReq>;
  fuzzyKeys: string[];
  fuzzyQueryModel: Ref<FuzzyQueryModel>;
  renderData: Ref<UserModel[]>;

  fetchData: (opts?: any) => Promise<void>;
  onPageChange: (current: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  handleResetQueryModel: (keys?: string[]) => void;

  onUpdateRenderData: (data: {
    type: 'update' | 'create' | 'delete';
    record?: UserModel;
    records?: UserModel[];
    ids?: UserModel['id'][];
  }) => void;
}

const symbol = Symbol('SEARCH-USER');

// 用于（指定属性的）全文关键词检索
const fuzzyKeys = ['username', 'nickname', 'email', 'phone'];
const resetFuzzyQueryModel = (): FuzzyQueryModel => {
  return {
    fuzzyWord: '', // 匹配的具体值
    fuzzyKeys, // 匹配哪些属性
  };
};

// 用于指定属性的精确筛选
const resetQueryModel = (keys?: string[]): QueryUserListReq => {
  const defaultModel = {
    username: undefined,
    nickname: undefined,
    email: undefined,
    phone: undefined,
    role: undefined,
    // roles: undefined,
    org: undefined,
  };

  if (keys && keys.length) {
    return pick(defaultModel, keys);
  }
  return defaultModel;
};

export function provideSearchUser(): SearchUserState {
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

  // 绑定表单实例
  const queryFormRef = shallowRef<FormInstance>();

  // 精确筛选条件
  const queryModel = ref<QueryUserListReq>(resetQueryModel());
  // 全文检索条件
  const fuzzyQueryModel = ref<FuzzyQueryModel>(resetFuzzyQueryModel());

  // 检索结果
  const renderData = ref<UserModel[]>([]);

  const fetchData = async (opts?: any) => {
    // 必要的表单校验
    const errors = await queryFormRef.value?.validate();
    if (errors && Object.keys(errors).length > 0) {
      return;
    }

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
        (value) => !value || (isObject(value) && isEmpty(value)),
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
      const { data } = await queryUserList(cleanedParams);
      renderData.value = data.list;
      pagination.total = data.total || 0;
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
    // 不可以使用router.push({ query: { ...route.query, current: 1, pageSize } })
    // 因为会刷新整个页面，用户体验很糟糕
    const url = router.resolve({ query: { ...route.query, current } }).href;
    window.history.pushState({}, '', url);
  };

  const onPageSizeChange = (pageSize: number) => {
    // 如果 v-model 双向绑定，则不需要手动绑定
    pagination.pageSize = pageSize;
    pagination.current = 1;
    fetchData();

    // 将分页持久化到地址栏中，防止刷新丢失分页，影响用户体验
    // 不可以使用router.push({ query: { ...route.query, current: 1, pageSize } })
    // 因为会刷新整个页面，用户体验很糟糕
    const url = router.resolve({
      query: { ...route.query, current: 1, pageSize },
    }).href;
    window.history.pushState({}, '', url);
  };

  // 响应更新列表
  // 更新渲染数据，删除、新增、更新时使用，惰性请求
  const onUpdateRenderData = (data: {
    type: 'update' | 'create' | 'delete';
    record?: UserModel;
    records?: UserModel[];
    ids?: UserModel['id'][];
  }) => {
    switch (data.type) {
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
      case 'create':
        // 创建
        if (data.records) {
          // 如果传入的是数组，则批量添加
          renderData.value.unshift(...data.records);
        } else {
          renderData.value.unshift(data.record as UserModel);
        }
        break;
      case 'delete':
        renderData.value = renderData.value.filter(
          (item) => !data?.ids?.includes(item.id),
        );

        // 如果整页被删除，则重置分页，并重新请求数据
        if (renderData.value.length === 0) {
          pagination.current = 1;
          fetchData();
        }
        break;
      default:
        break;
    }
  };

  // 条件改变
  // 对于需要 <a-input /> 手动输入的筛选值，通过输入框的回车 press-enter 事件来触发检索
  // 否则在用户输入过程中（筛选参数的变量已随之变化）就触发检索请求，影响用户体验
  // 同时注意，使用也要开启 allow-clear 属性，绑定 <a-input /> 的 clear 事件
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
      // 不可以使用router.push({ query: { ...route.query, current: 1, pageSize } })
      // 因为会刷新整个页面，用户体验很糟糕
      const url = router.resolve({
        query: {
          ...route.query,
          current: pagination.current,
          pageSize: pagination.pageSize,
        },
      }).href;
      window.history.pushState({}, '', url);
    },
    { deep: true },
  );

  const returnState: SearchUserState = {
    loading,
    pagination,
    queryFormRef,
    queryModel,
    fuzzyKeys,
    fuzzyQueryModel,
    renderData,

    fetchData,
    handleResetQueryModel,
    onPageChange,
    onPageSizeChange,

    onUpdateRenderData,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useSearchUser(): SearchUserState {
  return inject(symbol) as SearchUserState;
}
