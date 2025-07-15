import { ref, Ref, provide, inject } from 'vue';
import { Message } from '@arco-design/web-vue';
import { XxxxModel, UpdateXxxxReq, updateXxxx } from '@/api/xxxx';
import { pick } from 'lodash';

const updateXxxxSymbol = Symbol('UPDATE-XXXX');

interface UpdateXxxxState {
  updateXxxxPanelVisible: Ref<boolean>;
  updateXxxxModel: Ref<UpdateXxxxReq>;
  handleOpenUpdateXxxxPanel: (item: XxxxModel) => void;
  handleSubmitUpdateXxxx: (
    callback?: (...args: any) => void | Promise<void>,
  ) => Promise<boolean>;
}

export function provideUpdateXxxx(): UpdateXxxxState {
  const updateXxxxPanelVisible = ref<boolean>(false);

  const updateXxxxModel = ref<UpdateXxxxReq>({} as any);

  const handleOpenUpdateXxxxPanel = (item: XxxxModel) => {
    // 更新弹窗，只传入需要更新的字段
    // 避免导致其他只读数据被篡改（这里其实是后端接口的事）
    updateXxxxModel.value = pick(item, ['id', 'name', 'description', 'tags']);
    updateXxxxPanelVisible.value = true;
  };

  const handleSubmitUpdateXxxx = async (
    callback?: (...args: any) => void | Promise<void>,
  ) => {
    try {
      const { data } = await updateXxxx(updateXxxxModel.value);
      Message.success('已更新');
      callback?.({
        type: 'update',
        record: { ...updateXxxxModel.value, ...data },
      });
      return true;
    } catch (err: any) {
      Message.error(err?.message || '更新失败');
      return false;
    }
  };

  const returnState = {
    updateXxxxPanelVisible,
    updateXxxxModel,
    handleOpenUpdateXxxxPanel,
    handleSubmitUpdateXxxx,
  };

  provide(updateXxxxSymbol, returnState);

  return returnState;
}

export function useUpdateXxxx(): UpdateXxxxState {
  return inject(updateXxxxSymbol) as UpdateXxxxState;
}
