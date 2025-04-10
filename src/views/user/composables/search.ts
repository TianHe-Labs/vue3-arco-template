import { provide, inject, Ref, reactive, ref, watch } from 'vue';
import { Message, Modal, PaginationProps } from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import { isEmpty, isObject, omitBy, pick } from 'lodash';
import useLoading from '@/composables/loading';
import {
  queryUserList,
  UserModel,
  QueryUserListReq,
  deleteUser,
} from '@/api/user';
import { SelectionState } from '@/global';

interface FuzzyQueryModel {
  fuzzyWord: string;
  fuzzyKeys: string[];
}

interface SearchUserState {
  loading: Ref<boolean>;
  pagination: PaginationProps;
  queryModel: Ref<QueryUserListReq>;
  fuzzyKeys: string[];
  fuzzyQueryModel: Ref<FuzzyQueryModel>;
  renderData: Ref<UserModel[]>;

  fetchData: (opts?: any) => Promise<void>;
  onPageChange: (current: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  handleResetQueryModel: (keys?: string[]) => void;

  selectionState: SelectionState;
  toggleSelection: () => void;
  confirmDeleteUser: (ids?: UserModel['id'][]) => Promise<void>;
  handleDeleteUser: () => Promise<void>;
}

const symbol = Symbol('USER');

// 用于（指定属性的）全文关键词检索
const fuzzyKeys = ['usernmae', 'nickname', 'email', 'phone'];
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
    sector: undefined,
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

  // 精确筛选条件
  const queryModel = ref<QueryUserListReq>(resetQueryModel());
  // 全文检索条件
  const fuzzyQueryModel = ref<FuzzyQueryModel>(resetFuzzyQueryModel());

  // 检索结果
  const renderData = ref<UserModel[]>([]);

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
      pagination.total = data.total;
    } catch (err: any) {
      Message.error(err?.Message);
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

  // 显示勾选
  const selectionState = reactive<SelectionState>({
    visible: false,
    checked: [],
  });

  const toggleSelection = () => {
    selectionState.checked = [];
    selectionState.visible = !selectionState.visible;
  };

  const confirmDeleteUser = async (ids?: UserModel['id'][]) => {
    if (!ids || ids.length === 0) {
      Message.warning('请选择要删除的用户');
      return;
    }
    // 弹窗确认
    Modal.confirm({
      title: '警告',
      titleAlign: 'start',
      content: '确认删除用户？',
      modalClass: '!p-5',
      onOk: async () => {
        try {
          const { data } = await deleteUser({ ids });
          if (data?.ids && data.ids?.length === ids?.length) {
            // 直接在前端逻辑中移除已经被删除的用户，不再请求接口
            renderData.value = renderData.value.filter(
              (item) => !data?.ids?.includes(item.id),
            );
            Message.success(
              `已删除${data?.ids?.length || ids?.length || 0}个用户`,
            );
          } else {
            Message.warning(
              `已删除${data.ids.length}个用户, ${
                ids.length - data?.ids?.length
              }个用户删除失败`,
            );
          }
          toggleSelection();
        } catch (err: any) {
          Message.error(err?.message);
        }
      },
    });
  };

  // 当调用不传入参数时，用 $event 来捕获事件，防止影响真正的参数
  const handleDeleteUser = async () => {
    if (selectionState.visible) {
      // 如果勾选框显示，则删除
      await confirmDeleteUser(selectionState.checked);
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

  const returnState: SearchUserState = {
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

    selectionState,
    toggleSelection,
    confirmDeleteUser,
    handleDeleteUser,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useSearchUser(): SearchUserState {
  return inject(symbol) as SearchUserState;
}
