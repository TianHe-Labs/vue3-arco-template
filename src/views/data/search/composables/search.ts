import { provide, inject, Ref, reactive, ref, watch, shallowRef, h } from 'vue';
import {
  FormInstance,
  Input,
  Message,
  Modal,
  PaginationProps,
} from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import { saveAs } from 'file-saver';
import { isEmpty, isObject, omitBy, pick } from 'lodash';
import { dayjs } from '@/utils/format';
import useLoading from '@/composables/loading';
// import useRequest from '@/composables/request';
import {
  queryXxxxList,
  XxxxModel,
  QueryXxxxListReq,
  exportXxxxList,
} from '@/api/xxxx';
import { FuzzyQueryModel } from '@/global';

interface SearchXxxxState {
  loading: Ref<boolean>;

  pagination: PaginationProps;

  // 检索表单
  queryFormRef: Ref<FormInstance>;
  queryModel: Ref<QueryXxxxListReq>;

  // 模糊检索条件（多属性匹配）
  fuzzyKeys: string[];
  fuzzyQueryModel: Ref<FuzzyQueryModel>;

  renderData: Ref<XxxxModel[]>;

  fetchData: (opts?: any) => Promise<void>;

  onPageChange: (current: number) => void;
  onPageSizeChange: (pageSize: number) => void;

  // 重置检索条件
  handleResetQueryModel: (keys?: string[]) => void;

  // 前端更新检索结果
  onUpdateRenderData: (data: {
    type: 'update' | 'create' | 'delete';
    record?: XxxxModel;
    records?: XxxxModel[];
    ids?: XxxxModel['id'][];
  }) => void;

  // 导出
  exportLoading: Ref<boolean>;
  handleExportData: () => void;
}

const symbol = Symbol('SEARCH-XXXX');

// 用于（指定属性的）全文关键词检索
const fuzzyKeys = ['name', 'description'];

const resetFuzzyQueryModel = (): FuzzyQueryModel => {
  return {
    fuzzyText: '', // 匹配的具体值
    fuzzyKeys, // 匹配哪些属性
  };
};

// 用于指定属性的精确筛选
const resetQueryModel = (keys?: string[]): QueryXxxxListReq => {
  const defaultModel = {
    id: undefined,
    name: undefined,
    tags: [],
    createdRange: [],
  };

  if (keys && keys.length) {
    return pick(defaultModel, keys);
  }
  return defaultModel;
};

// 提供搜索组件
// queries 接受外部传入的查询条件，
// 用于外部调用时，可以传入查询条件
// 例如在详情页复用时，传入 id 查询详情
// 此时，结果只返回一条，复用接口减少接口开发
export function provideSearchXxxx(
  queries: Ref<Partial<QueryXxxxListReq>>,
): SearchXxxxState {
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
  const queryModel = ref<QueryXxxxListReq>(resetQueryModel());
  // 全文检索条件
  const fuzzyQueryModel = ref<FuzzyQueryModel>(resetFuzzyQueryModel());

  // 检索结果
  const renderData = ref<XxxxModel[]>([]);

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
      const { data } = await queryXxxxList(cleanedParams);
      renderData.value = data.list;
      pagination.total = data.total || 0;
    } catch (err: any) {
      Message.error(err.message);
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
    // 如果一个页面中有多个分页，可以不需要在地址栏中持久化，避免相互干扰
    const url = router.resolve({ query: { ...route.query, current } }).href;
    window.history.pushState({}, '', url);
  };

  const onPageSizeChange = (pageSize: number) => {
    // 如果 v-model 双向绑定，则不需要手动绑定
    pagination.pageSize = pageSize;
    pagination.current = 1;
    fetchData();

    // 将分页持久化到地址栏中，防止刷新丢失分页，影响用户体验
    // 如果一个页面中有多个分页，可以不需要在地址栏中持久化，避免相互干扰
    // 不可以使用router.push({ query: { ...route.query, current: 1, pageSize } })
    // 因为会刷新整个页面，用户体验很糟糕
    const url = router.resolve({
      query: { ...route.query, current: 1, pageSize },
    }).href;
    window.history.pushState({}, '', url);
  };

  const onUpdateRenderData = (data: {
    type: 'update' | 'create' | 'delete';
    record?: XxxxModel;
    records?: XxxxModel[];
    ids?: XxxxModel['id'][];
  }) => {
    switch (data.type) {
      case 'update':
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
        // 如果传入的是数组，则批量添加
        if (data.records) {
          renderData.value.unshift(...data.records);
        } else {
          renderData.value.unshift(data.record as XxxxModel);
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

  // 外部参数变化时，更新查询条件
  // 例如在详情页复用时，传入 id 查询详情
  // 此时，结果只返回一条，复用接口减少接口开发
  watch(
    queries,
    () => {
      if (!isEmpty(queries.value)) {
        queryModel.value = { ...queryModel.value, ...queries.value };
      }
    },
    { immediate: true },
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

          const resp = await exportXxxxList(cleanedParams);

          // 创建下载链接
          const blob = new Blob([resp.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          saveAs(blob, `${dayjs().format('YYYYMMDDHHmmss')}.xlsx`);
        } catch (err: any) {
          Message.error(err?.message);
        } finally {
          setExportLoading(false);
        }
      },
    });
  };

  const returnState: SearchXxxxState = {
    loading,

    // 分页
    pagination,

    // 检索表单
    queryFormRef,
    queryModel,

    // 模糊检索条件（多属性匹配）
    fuzzyKeys,
    fuzzyQueryModel,
    renderData,

    // 检索
    fetchData,

    // 分页
    onPageChange,
    onPageSizeChange,

    // 重置检索条件
    handleResetQueryModel,

    // 更新检索结果
    onUpdateRenderData,

    // 导出
    exportLoading,
    handleExportData,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useSearchXxxx(): SearchXxxxState {
  return inject(symbol) as SearchXxxxState;
}
