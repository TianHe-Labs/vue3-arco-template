import { provide, inject, reactive } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { SelectionState } from '@/global';
import {
  deleteMessage,
  MessageModel,
  updateMessageReadAt,
} from '@/api/message';

interface OperationState {
  selectionState: SelectionState;
  toggleSelection: (visible?: boolean) => void;
  handleConfirmReadMessage: (
    ids?: MessageModel['id'][],
    callback?: any,
  ) => Promise<void>;
  handleConfirmDeleteMessage: (
    ids?: MessageModel['id'][],
    callback?: any,
  ) => Promise<void>;
  handleBatchReadMessage: (callback?: any) => Promise<void>;
  handleBatchDeleteMessage: (callback?: any) => Promise<void>;
}

const symbol = Symbol('OPERATION');

export function provideOperation() {
  // 选中消息
  // 显示表格勾选
  const selectionState = reactive<SelectionState>({
    visible: false,
    checked: [],
  });

  const toggleSelection = (visible?: boolean) => {
    selectionState.checked = [];
    selectionState.visible = visible ?? !selectionState.visible;
  };

  // 标记已读，不传参数则全部标记
  const handleConfirmReadMessage = async (
    ids?: MessageModel['id'][],
    callback?: any,
  ) => {
    if (!ids || ids.length === 0) {
      Message.warning('选择要标记已读的消息');
      return;
    }
    try {
      const { data } = await updateMessageReadAt({ ids });
      // 使用 callback 来更新列表
      callback?.({
        type: 'read',
        ids: data?.ids,
        readAt: data?.readAt,
      });

      Message.success(
        `已将${data?.ids?.length || ids?.length || 0}条消息标记为已读`,
      );
      toggleSelection(false);
    } catch (err: any) {
      Message.error(err.message);
    }
  };

  // 删除，不传参数则全部删除
  const handleConfirmDeleteMessage = async (
    ids?: MessageModel['id'][],
    callback?: any,
  ) => {
    if (!ids || ids.length === 0) {
      Message.warning('选择要删除的消息');
      return;
    }
    // 弹窗确认
    Modal.confirm({
      title: '警告',
      content: '确定要删除消息？',
      titleAlign: 'start',
      modalClass: '!p-5',
      onOk: async () => {
        try {
          const { data } = await deleteMessage({ ids });
          if (data?.ids && data.ids?.length === ids?.length) {
            // 直接在前端逻辑中移除已经被删除的用户，不再请求接口
            callback?.({
              type: 'delete',
              ids: data?.ids,
            });
            Message.success(
              `已删除${data?.ids?.length || ids?.length || 0}条消息`,
            );
          } else {
            Message.warning(
              `已删除${data?.ids?.length}条消息, ${
                ids.length - data?.ids?.length
              }条消息删除失败`,
            );
          }
          toggleSelection(false);
        } catch (err: any) {
          Message.error(err.message);
        }
      },
    });
  };

  const handleBatchReadMessage = async (callback?: any) => {
    if (selectionState.visible) {
      // 如果勾选框显示，则标记已读
      await handleConfirmReadMessage(selectionState.checked, callback);
    } else {
      // 如果勾选框隐藏，则显示
      toggleSelection(true);
    }
  };

  const handleBatchDeleteMessage = async (callback?: any) => {
    if (selectionState.visible) {
      // 如果勾选框显示，则删除
      await handleConfirmDeleteMessage(selectionState.checked, callback);
    } else {
      // 如果勾选框隐藏，则显示
      toggleSelection(true);
    }
  };

  const returnState: OperationState = {
    selectionState,
    toggleSelection,
    handleConfirmReadMessage,
    handleConfirmDeleteMessage,
    handleBatchReadMessage,
    handleBatchDeleteMessage,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useOperation(): OperationState {
  return inject<OperationState>(symbol) as OperationState;
}
