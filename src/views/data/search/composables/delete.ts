import { provide, inject, reactive, Ref, ref, shallowRef } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { SelectionState } from '@/global';
import { deleteXxxx, XxxxModel } from '@/api/xxxx';

interface DeleteDataState {
  selectionState: SelectionState;
  toggleSelection: (visible?: boolean) => void;
  handleConfirmDeleteXxxx: (
    ids?: XxxxModel['id'][],
    callback?: any,
  ) => Promise<void>;
  handleBatchDeleteXxxx: (callback?: any) => Promise<void>;
}

const symbol = Symbol('DELETE');

export function provideDeleteXxxx() {
  // 显示勾选（列表中 序号列 # / 勾选框 切换）
  const selectionState = reactive<SelectionState>({
    visible: false,
    checked: [],
  });

  const toggleSelection = (visible?: boolean) => {
    selectionState.checked = [];
    selectionState.visible = visible ?? !selectionState.visible;
  };

  // 删除用户 单个 或 批量
  const handleConfirmDeleteXxxx = async (
    ids?: XxxxModel['id'][],
    callback?: any,
  ) => {
    if (!ids || ids.length === 0) {
      Message.warning('请选择要删除的XX');
      return;
    }
    // 弹窗确认
    Modal.confirm({
      title: '警告',
      titleAlign: 'start',
      content: '确认删除XX？',
      modalClass: '!p-5',
      onOk: async () => {
        try {
          const { data } = await deleteXxxx({ ids });
          if (data?.ids && data.ids?.length === ids?.length) {
            // 直接在前端逻辑中移除已经被删除的XX，不再请求接口
            callback?.({
              type: 'delete',
              data: data?.ids,
            });
            Message.success(
              `已删除${data?.ids?.length || ids?.length || 0}个XX`,
            );
          } else {
            Message.warning(
              `已删除${data.ids.length}个XX, ${
                ids.length - data?.ids?.length
              }个XX删除失败`,
            );
          }
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
      await handleConfirmDeleteXxxx(selectionState.checked, callback);
    } else {
      // 如果勾选框隐藏，则显示
      toggleSelection(true);
    }
  };

  const returnState: DeleteDataState = {
    selectionState,
    toggleSelection,
    handleConfirmDeleteXxxx,
    handleBatchDeleteXxxx,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useDeleteXxxx() {
  return inject(symbol) as DeleteDataState;
}
