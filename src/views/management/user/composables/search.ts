import { provide, inject, Ref, reactive, ref, watch, shallowRef, h } from 'vue';
import {
  FormInstance,
  Input,
  Message,
  Modal,
  PaginationProps,
} from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import { isEmpty, isObject, omitBy, pick } from 'lodash';
import saveAs from 'file-saver';
import useLoading from '@/composables/loading';
import {
  queryUserList,
  UserModel,
  QueryUserListReq,
  exportUserList,
} from '@/api/user';
import { FuzzyQueryModel } from '@/global';
import { dayjs } from '@/utils/format';

interface SearchUserState {
  loading: Ref<boolean>;
  // 分页属性
  pagination: PaginationProps;

  // 检索表单
  queryFormRef: Ref<FormInstance>;
  queryModel: Ref<QueryUserListReq>;

  // 模糊检索条件（多属性匹配）
  fuzzyKeys: string[];
  fuzzyQueryModel: Ref<FuzzyQueryModel>;

  renderData: Ref<UserModel[]>;

  fetchData: (opts?: any) => Promise<void>;

  // 分页
  onPageChange: (current: number) => void;
  onPageSizeChange: (pageSize: number) => void;

  handleResetQueryModel: (keys?: string[]) => void;

  onUpdateRenderData: (data: {
    type: 'update' | 'create' | 'delete';
    record?: UserModel;
    records?: UserModel[];
    ids?: UserModel['id'][];
  }) => void;

  // 导出
  exportLoading: Ref<boolean>;
  handleExportData: () => void;
}

const symbol = Symbol('SEARCH-USER');

// 用于（指定属性的）全文关键词检索
const fuzzyKeys = ['username', 'nickname', 'email', 'phone'];

const resetFuzzyQueryModel = (): FuzzyQueryModel => {
  return {
    fuzzyText: '', // 匹配的具体值
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
    orgId: undefined,
    status: undefined,
  };

  if (keys && keys.length) {
    return pick(defaultModel, keys);
  }
  return defaultModel;
};

/**
 * 检索和导出，请求参数是一致的，可以共用请求参数，所以合并在一起
 */
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

  // 模糊检索条件（多属性匹配）
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
      ...(fuzzyQueryModel.value.fuzzyText
        ? fuzzyQueryModel.value.fuzzyKeys.reduce((obj: any, key) => {
            obj[key] = [fuzzyQueryModel.value.fuzzyText];
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

  // 重置
  const handleResetQueryModel = (keys?: string[]) => {
    queryModel.value = { ...queryModel.value, ...resetQueryModel(keys) };
    if (!keys || !keys?.length) {
      fuzzyQueryModel.value = resetFuzzyQueryModel();
    }
  };

  const router = useRouter();
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
    // 至于fuzzyText 由 input 事件手动触发（输入框回车、点击查询按钮）
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

  // 导出
  // 条件与检索相同
  const { loading: exportLoading, setLoading: setExportLoading } = useLoading();
  const handleExportData = () => {
    // 水印信息输入框的值
    let watermarkText = '';

    Modal.confirm({
      title: '导出',
      titleAlign: 'start',
      content: () =>
        h(Input, {
          placeholder: '添加水印信息，缺省默认不设置',
          onChange: (value: string) => {
            watermarkText = value;
          },
        }),
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          setExportLoading(true);

          const cleanedParams = {
            // 过滤掉空值参数，剔除0, '', null, undefined / '',[]
            ...omitBy(
              queryModel.value,
              (value) => !value || (isObject(value) && isEmpty(value)),
            ),
          };

          console.log(cleanedParams);

          const resp = await exportUserList(cleanedParams);

          console.log(resp);

          // 创建下载链接
          const blob = new Blob([resp.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          saveAs(blob, `用户数据导出_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`);
        } catch (err: any) {
          Message.error(err?.message);
        } finally {
          setExportLoading(false);
        }
      },
    });
  };

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

    // 导出
    exportLoading,
    handleExportData,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useSearchUser(): SearchUserState {
  return inject(symbol) as SearchUserState;
}
