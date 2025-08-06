import { Ref, inject, provide, ref } from 'vue';
import useLoading from '@/composables/loading';
import { Message } from '@arco-design/web-vue';
import { CreateUpdateXxxxModel, createXxxx } from '@/api/xxxx';
import { uniqBy } from 'lodash';

const symbol = Symbol('BATCH-CREATE-XXXX');

interface BatchCreateXxxxState {
  batchCreateXxxxPanelVisible: Ref<boolean>;
  batchCreateXxxxModel: Ref<CreateUpdateXxxxModel[]>;
  handleBatchCreateXxxx: () => void;
  loading: Ref<boolean>;
  handleSubmitBatchCreateXxxx: (callback?: any) => Promise<boolean>;
}

/**
 * 批量创建
 */
export function provideBatchCreateXxxx(): BatchCreateXxxxState {
  const batchCreateXxxxPanelVisible = ref<boolean>(false);

  // 表单数据（批量）
  const batchCreateXxxxModel = ref<CreateUpdateXxxxModel[]>([
    {
      name: undefined,
      description: undefined,
      tags: undefined,
    },
  ]);

  // 触发 打开批量创建用户面板
  const handleBatchCreateXxxx = () => {
    batchCreateXxxxPanelVisible.value = true;
  };

  const { loading, setLoading } = useLoading();

  // 提交 批量创建用户
  const handleSubmitBatchCreateXxxx = async (callback?: any) => {
    const uniqueFiltered = uniqBy(
      batchCreateXxxxModel.value.filter((item) => item.name !== ''),
      (item) => item.name,
    );

    if (uniqueFiltered.length === 0) {
      Message.error('输入数据为空，填写数据再提交');
      return false;
    }
    setLoading(true);
    try {
      const { data } = await createXxxx({ list: uniqueFiltered });
      // callback 执行后续操作（fetchData 刷新数据）减少耦合
      callback?.();
      // data 返回的是创建成功的用户列表
      if (data && data.list.length === uniqueFiltered.length) {
        Message.success(`已新增${data.list.length}个XX`);
        batchCreateXxxxModel.value = [];
        return true;
      } else {
        Message.success(
          `已新增${data.list.length}个XX，${
            uniqueFiltered.length - data.list.length
          }个新增失败`,
        );
        // 如果有未成功的，将未成功的数据保留显示在表格中
        batchCreateXxxxModel.value = data.list.filter(
          (item: CreateUpdateXxxxModel) =>
            data.list.some(
              (it: CreateUpdateXxxxModel) => it.name === item.name,
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
    batchCreateXxxxModel,
    batchCreateXxxxPanelVisible,
    loading,
    handleBatchCreateXxxx,
    handleSubmitBatchCreateXxxx,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useBatchCreateXxxx(): BatchCreateXxxxState {
  return inject(symbol) as BatchCreateXxxxState;
}
