import { Ref, inject, provide, ref } from 'vue';
import useLoading from '@/composables/loading';
import { Message } from '@arco-design/web-vue';
import { CreateUpdateOrgModel, createOrg } from '@/api/org';
import { uniqBy } from 'lodash';

const symbol = Symbol('BATCH-CREATE-ORG');

interface BatchCreateOrgState {
  batchCreateOrgPanelVisible: Ref<boolean>;
  batchCreateOrgModel: Ref<CreateUpdateOrgModel[]>;
  handleBatchCreateOrg: () => void;
  loading: Ref<boolean>;
  handleSubmitBatchCreateOrg: (callback?: any) => Promise<boolean>;
}

/**
 * 批量创建
 */
export function provideBatchCreateOrg(): BatchCreateOrgState {
  // 弹窗
  const batchCreateOrgPanelVisible = ref<boolean>(false);

  // 表单数据（批量）
  const batchCreateOrgModel = ref<CreateUpdateOrgModel[]>([
    {
      orgName: undefined,
      orgDescription: undefined,
      // parentOrgId: undefined, // 选择
      parentOrgName: undefined, // 批量时输入
    },
  ]);

  // 触发 打开批量创建部门面板
  const handleBatchCreateOrg = () => {
    batchCreateOrgPanelVisible.value = true;
  };

  const { loading, setLoading } = useLoading();

  // 提交 批量创建部门
  const handleSubmitBatchCreateOrg = async (callback?: any) => {
    const uniqueFiltered = uniqBy(
      batchCreateOrgModel.value.filter((item) => item.orgName !== ''),
      (item) => item.orgName,
    );

    if (uniqueFiltered.length === 0) {
      Message.error('输入数据为空，填写数据再提交');
      return false;
    }
    setLoading(true);
    try {
      const { data } = await createOrg({ list: uniqueFiltered });
      // callback 执行后续操作（fetchData 刷新数据）减少耦合
      callback?.();
      // data 返回的是创建成功的部门列表
      if (data && data.list.length === uniqueFiltered.length) {
        Message.success(`已新增${data.list.length}个部门`);
        batchCreateOrgModel.value = [];
        return true;
      } else {
        Message.success(
          `已新增${data.list.length}个部门，${
            uniqueFiltered.length - data.list.length
          }个新增失败`,
        );
        // 如果有未成功的，将未成功的数据保留显示在表格中
        batchCreateOrgModel.value = data.list.filter(
          (item: CreateUpdateOrgModel) =>
            data.list.some(
              (it: CreateUpdateOrgModel) => it.orgName === item.orgName,
            ),
        );
        return false;
      }
    } catch (err: any) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const returnState = {
    batchCreateOrgModel,
    batchCreateOrgPanelVisible,
    handleBatchCreateOrg,
    loading,
    handleSubmitBatchCreateOrg,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useBatchCreateOrg(): BatchCreateOrgState {
  return inject(symbol) as BatchCreateOrgState;
}
