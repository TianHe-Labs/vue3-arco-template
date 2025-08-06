import { ref, Ref, provide, inject, shallowRef } from 'vue';
import { FormInstance, Message } from '@arco-design/web-vue';
import {
  XxxxModel,
  CreateUpdateXxxxModel,
  updateXxxx,
  createXxxx,
} from '@/api/xxxx';
import useLoading from '@/composables/loading';

interface CreateUpdateXxxxState {
  // 面板
  createUpdateXxxxPanelVisible: Ref<boolean>;
  loading: Ref<boolean>;
  // 表单
  createUpdateXxxxFormRef: Ref<FormInstance>;
  createUpdateXxxxModel: Ref<CreateUpdateXxxxModel>;

  // 事件 打开弹窗
  handleCreateUpdateXxxx: ($event: Event, record?: Partial<XxxxModel>) => void;
  // 事件 提交
  handleSubmitCreateUpdateXxxx: (
    callback?: (...args: any) => void | Promise<void>,
  ) => Promise<boolean>;
}

const symbol = Symbol('CREATE-UPDATE-XXXX');

const resetCreateUpdateXxxxModel = (): CreateUpdateXxxxModel => {
  return {
    id: undefined,
    name: undefined,
    description: undefined,
    tags: [],
  };
};

/**
 * 创建（单个）/更新，共用弹窗
 */
export function provideCreateUpdateXxxx(): CreateUpdateXxxxState {
  const createUpdateXxxxPanelVisible = ref<boolean>(false);

  // 表单实例
  const createUpdateXxxxFormRef = shallowRef<FormInstance>();

  // 表单数据
  const createUpdateXxxxModel = ref<CreateUpdateXxxxModel>(
    resetCreateUpdateXxxxModel(),
  );

  // 打开弹窗 创建/更新 共用弹窗
  // 用 event 占据第一个参数
  // 在template中使用时，如果不传参数（创建），可以不用加括号
  const handleCreateUpdateXxxx = (
    $event: Event,
    record?: Partial<XxxxModel>,
  ) => {
    // 重置表单校验状态
    createUpdateXxxxFormRef.value?.clearValidate();
    // 重置表单数据
    createUpdateXxxxModel.value = {
      ...resetCreateUpdateXxxxModel(), // 创建时使用
      ...record, // 更新时使用，只传入需要更新的字段
    };
    // 打开弹窗
    createUpdateXxxxPanelVisible.value = true;
  };

  const { loading, setLoading } = useLoading();

  // 提交 创建（单个）/更新
  const handleSubmitCreateUpdateXxxx = async (
    callback?: (...args: any) => void | Promise<void>,
  ) => {
    // 必要的表单校验
    const errors = await createUpdateXxxxFormRef.value?.validate();
    if (errors && Object.keys(errors).length > 0) {
      return false;
    }

    setLoading(true);

    try {
      // 根据 createUpdateUserModel.value?.id
      // 来判断是创建还是更新
      if (createUpdateXxxxModel.value?.id) {
        const { data } = await updateXxxx(createUpdateXxxxModel.value);
        // 使用 callback 执行后续操作（更新列表 ）减少耦合
        callback?.({
          type: 'update',
          record: { ...createUpdateXxxxModel.value, ...data },
        });
        Message.success('已更新');
        // 用于 modal 的 before-ok 事件
        // true 关闭 modal
        return true;
      } else {
        // 创建
        const { data } = await createXxxx({
          list: [createUpdateXxxxModel.value],
        });

        // 返回的是创建成功的数据列表
        if (!data || data.list.length === 0) {
          Message.error('新增失败');
          return false;
        }
        callback?.({
          type: 'create',
          record: {
            ...createUpdateXxxxModel.value,
            // 返回的是创建成功的数据列表，创建单个时，就不重新刷新列表了
            ...data.list[0],
          },
        });

        Message.success('已新增');

        // 用于 modal 的 before-ok 事件
        // true 关闭 modal
        return true;
      }
    } catch (err: any) {
      Message.error(err?.message);
      // 用于 modal 的 before-ok 事件
      // true 关闭 modal
      return false;
    } finally {
      setLoading(false);
    }
  };

  const returnState = {
    createUpdateXxxxPanelVisible,
    loading,
    createUpdateXxxxFormRef,
    createUpdateXxxxModel,
    handleCreateUpdateXxxx,
    handleSubmitCreateUpdateXxxx,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useCreateUpdateXxxx(): CreateUpdateXxxxState {
  return inject(symbol) as CreateUpdateXxxxState;
}
