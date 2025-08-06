import { provide, inject, reactive, Ref, ref, shallowRef } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { SelectionState } from '@/global';
import { deleteXxxx, XxxxModel } from '@/api/xxxx';

interface BatchOperateXxxxState {
  selectionState: SelectionState;
  toggleSelection: (visible?: boolean) => void;
  handleSubmitDeleteXxxx: (
    ids?: XxxxModel['id'][],
    callback?: any,
  ) => Promise<void>;
  handleBatchDeleteXxxx: (callback?: any) => Promise<void>;
}

const symbol = Symbol('BATCH-OPERATE-XXXX');

export function provideBatchOperateXxxx() {
  // 显示勾选（列表中 序号列 # / 勾选框 切换）
  const selectionState = reactive<SelectionState>({
    visible: false,
    checked: [],
  });

  const toggleSelection = (visible?: boolean) => {
    selectionState.checked = [];
    selectionState.visible = visible ?? !selectionState.visible;
  };

  // 删除 单个 或 批量，其他批量操作的，可以参考这个接口
  const handleSubmitDeleteXxxx = async (
    ids?: XxxxModel['id'][],
    callback?: any,
  ) => {
    if (!ids || ids.length === 0) {
      Message.warning('选择要删除的XX');
      return;
    }
    // 弹窗确认
    Modal.confirm({
      title: '警告',
      titleAlign: 'start',
      content: '确认删除XX？',
      onOk: async () => {
        try {
          const { data } = await deleteXxxx({ ids });
          // 直接在前端逻辑中移除已经被删除的XX，不再请求接口
          callback?.({
            type: 'delete',
            // data 返回是删除成功的ids
            ids: data?.ids,
          });

          if (data && data.ids.length === ids.length) {
            Message.success(`已删除${ids.length}个XX`);
          } else {
            Message.success(
              `已删除${data?.ids?.length}个XX，${ids.length - (data?.ids?.length || 0)}个XX删除失败`,
            );
          }

          // 隐藏勾选框
          toggleSelection(false);
        } catch (err: any) {
          Message.error(err?.message);
        }
      },
    });
  };

  // 当调用不传入参数时，用 $event 来捕获事件，防止影响真正的参数
  const handleBatchDeleteXxxx = async (callback?: any) => {
    if (selectionState.visible) {
      // 如果勾选框显示，则删除
      await handleSubmitDeleteXxxx(selectionState.checked, callback);
    } else {
      // 如果勾选框隐藏，则显示
      toggleSelection(true);
    }
  };

  const returnState: BatchOperateXxxxState = {
    selectionState,
    toggleSelection,
    handleSubmitDeleteXxxx,
    handleBatchDeleteXxxx,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useBatchOperateXxxx() {
  return inject(symbol) as BatchOperateXxxxState;
}
