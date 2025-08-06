import { provide, inject, Ref, ref, shallowRef } from 'vue';
import { FormInstance, Message } from '@arco-design/web-vue';
import useLoading from '@/composables/loading';
import {
  CreateUpdateOrgModel,
  OrgModel,
  createOrg,
  updateOrg,
} from '@/api/org';

interface CreateUpdateOrgState {
  createUpdateOrgPanelVisible: Ref<boolean>;
  createUpdateOrgFormRef: Ref<FormInstance>;
  createUpdateOrgModel: Ref<CreateUpdateOrgModel>;
  handleCreateUpdateOrg: ($event: Event, record?: OrgModel) => void;
  loading: Ref<boolean>;
  handleSubmitCreateUpdateOrg: (
    callback?: (...args: any) => void | Promise<void>,
  ) => Promise<boolean>;
}

const symbol = Symbol('CREATE-UPDATE-ORG');

const resetCreateUpdateOrgModel = (): CreateUpdateOrgModel => {
  return {
    id: undefined,
    orgName: '',
    orgDescription: '',
    parentOrgId: undefined, // 选择
  };
};

/**
 * 创建（单个）/更新部门，共用弹窗
 */
export function provideCreateUpdateOrg(): CreateUpdateOrgState {
  // 弹窗
  const createUpdateOrgPanelVisible = ref<boolean>(false);

  // 表单实例
  const createUpdateOrgFormRef = shallowRef<FormInstance>();

  // 表单
  const createUpdateOrgModel = ref<CreateUpdateOrgModel>(
    resetCreateUpdateOrgModel(),
  );

  // 打开弹窗 创建/更新 共用弹窗
  // 用 event 占据第一个参数
  // 在template中使用时，如果不传参数（创建），可以不用加括号
  const handleCreateUpdateOrg = ($event: Event, record?: Partial<OrgModel>) => {
    // 重置表单校验状态
    createUpdateOrgFormRef.value?.clearValidate();
    // 重置表单数据
    createUpdateOrgModel.value = {
      ...resetCreateUpdateOrgModel(),
      ...record,
    };
    // 打开弹窗
    createUpdateOrgPanelVisible.value = true;
  };

  const { loading, setLoading } = useLoading();

  // 提交
  const handleSubmitCreateUpdateOrg = async (
    callback?: (...args: any) => void | Promise<void>,
  ) => {
    // 必要的表单校验
    const errors = await createUpdateOrgFormRef.value?.validate();
    if (errors && Object.keys(errors).length > 0) {
      return false;
    }

    setLoading(true);
    try {
      // 根据 createUpdateUserModel.value?.id
      // 来判断是创建还是更新
      if (createUpdateOrgModel.value?.id) {
        const { data } = await updateOrg(createUpdateOrgModel.value);
        // 使用 callback 执行后续操作（更新列表 ）减少耦合
        callback?.({
          type: 'update',
          record: {
            ...createUpdateOrgModel.value,
            ...data,
          },
        });

        Message.success('已更新');
        // 用于 modal 的 before-ok 事件
        // true 关闭 modal
        return true;
      } else {
        // 创建
        const { data } = await createOrg({
          list: [createUpdateOrgModel.value],
        });

        // 返回的是创建成功的部门列表
        if (!data || data.list.length === 0) {
          Message.error('新增失败');
          return false;
        }

        // 使用 callback 执行后续操作（更新列表 ）减少耦合
        callback?.({
          type: 'create',
          record: {
            ...createUpdateOrgModel.value,
            // 返回的是创建成功的部门列表，创建单个时，就不重新刷新列表了
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
      return false;
    } finally {
      setLoading(false);
    }
  };

  const returnState: CreateUpdateOrgState = {
    createUpdateOrgPanelVisible,
    loading,
    createUpdateOrgFormRef,
    createUpdateOrgModel,
    handleCreateUpdateOrg,
    handleSubmitCreateUpdateOrg,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useCreateUpdateOrg(): CreateUpdateOrgState {
  return inject(symbol) as CreateUpdateOrgState;
}
