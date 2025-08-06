import { provide, inject, reactive } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { SelectionState } from '@/global';
import {
  deleteMessage,
  MessageModel,
  updateMessageReadAt,
} from '@/api/message';

interface BatchOperateMessageState {
  selectionState: SelectionState;
  toggleSelection: (visible?: boolean) => void;
  handleSubmitReadMessage: (
    ids?: MessageModel['id'][],
    callback?: any,
  ) => Promise<void>;
  handleBatchReadMessage: (callback?: any) => Promise<void>;
  handleSubmitDeleteMessage: (
    ids?: MessageModel['id'][],
    callback?: any,
  ) => Promise<void>;
  handleBatchDeleteMessage: (callback?: any) => Promise<void>;
}

const symbol = Symbol('BATCH-OPERATE-MESSAGE');

export function provideBatchOperateMessage() {
  // 显示勾选（列表中 序号列 # / 勾选框 切换）
  const selectionState = reactive<SelectionState>({
    visible: false,
    checked: [],
  });

  const toggleSelection = (visible?: boolean) => {
    selectionState.checked = [];
    selectionState.visible = visible ?? !selectionState.visible;
  };

  // 标记已读，单个 或 批量，不传参数则全部标记
  const handleSubmitReadMessage = async (
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

      if (data && data.ids.length === ids.length) {
        Message.success(`已标记${ids.length}条消息`);
      } else {
        Message.success(
          `已标记${data?.ids?.length}条消息，${ids.length - (data?.ids?.length || 0)}条消息标记失败`,
        );
      }

      // 隐藏勾选框
      toggleSelection(false);
    } catch (err: any) {
      Message.error(err.message);
    }
  };

  // 当调用不传入参数时，用 $event 来捕获事件，防止影响真正的参数
  const handleBatchReadMessage = async (callback?: any) => {
    if (selectionState.visible) {
      // 如果勾选框显示，则标记已读
      await handleSubmitReadMessage(selectionState.checked, callback);
    } else {
      // 如果勾选框隐藏，则显示
      toggleSelection(true);
    }
  };

  // 删除，单个 或 批量，不传参数则全部删除
  const handleSubmitDeleteMessage = async (
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
      onOk: async () => {
        try {
          const { data } = await deleteMessage({ ids });
          // 直接在前端逻辑中移除已经被删除的用户，不再请求接口
          callback?.({
            type: 'delete',
            // data 返回是删除成功的ids
            ids: data?.ids,
          });

          if (data && data.ids.length === ids.length) {
            Message.success(`已删除${ids.length}条消息`);
          } else {
            Message.success(
              `已删除${data?.ids?.length}条消息，${ids.length - (data?.ids?.length || 0)}条删除失败`,
            );
          }

          // 隐藏勾选框
          toggleSelection(false);
        } catch (err: any) {
          Message.error(err.message);
        }
      },
    });
  };

  // 当调用不传入参数时，用 $event 来捕获事件，防止影响真正的参数
  const handleBatchDeleteMessage = async (callback?: any) => {
    if (selectionState.visible) {
      // 如果勾选框显示，则删除
      await handleSubmitDeleteMessage(selectionState.checked, callback);
    } else {
      // 如果勾选框隐藏，则显示
      toggleSelection(true);
    }
  };

  const returnState: BatchOperateMessageState = {
    selectionState,
    toggleSelection,
    handleSubmitReadMessage,
    handleSubmitDeleteMessage,
    handleBatchReadMessage,
    handleBatchDeleteMessage,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useBatchOperateMessage(): BatchOperateMessageState {
  return inject<BatchOperateMessageState>(symbol) as BatchOperateMessageState;
}
