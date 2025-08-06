import { provide, inject, reactive, Ref, ref, shallowRef } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { SelectionState } from '@/global';
import { deleteOrg, OrgModel } from '@/api/org';

interface BatchOperateOrgState {
  selectionState: SelectionState;
  toggleSelection: (visible?: boolean) => void;
  handleSubmitDeleteOrg: (
    ids?: OrgModel['id'][],
    callback?: any,
  ) => Promise<void>;
  handleBatchDeleteOrg: (callback?: any) => Promise<void>;
}

const symbol = Symbol('BATCH-OPERATE-ORG');

/**
 * 需要勾选来批量操作的，如删除等
 */
export function provideBatchOperateOrg() {
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
  const handleSubmitDeleteOrg = async (
    ids?: OrgModel['id'][],
    callback?: any,
  ) => {
    if (!ids || ids.length === 0) {
      Message.warning('选择要删除的部门');
      return;
    }
    // 弹窗确认
    Modal.confirm({
      title: '警告',
      titleAlign: 'start',
      content: '确认删除部门？',
      onOk: async () => {
        try {
          const { data } = await deleteOrg({ ids });
          // 直接在前端逻辑中移除已经被删除的部门，不再请求接口
          callback?.({
            type: 'delete',
            // data 返回是删除成功的ids
            ids: data?.ids,
          });
          if (data && data.ids.length === ids.length) {
            Message.success(`已删除${ids.length}个部门`);
          } else {
            Message.success(
              `已删除${data?.ids?.length}个部门，${
                ids.length - data?.ids?.length
              }个删除失败`,
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
  const handleBatchDeleteOrg = async (callback?: any) => {
    if (selectionState.visible) {
      // 如果勾选框显示，则删除
      await handleSubmitDeleteOrg(selectionState.checked, callback);
    } else {
      // 如果勾选框隐藏，则显示
      toggleSelection(true);
    }
  };

  const returnState: BatchOperateOrgState = {
    selectionState,
    toggleSelection,
    handleSubmitDeleteOrg,
    handleBatchDeleteOrg,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useBatchOperateOrg() {
  return inject(symbol) as BatchOperateOrgState;
}
