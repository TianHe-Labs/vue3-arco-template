import { provide, inject, Ref, ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import { difference, isEmpty } from 'lodash';
import useLoading from '@/hooks/loading';
import {
  CreateOrUpdateUserReq,
  UserModel,
  createOrUpdateUser,
  deleteUser,
} from '@/api/user';
import { USERROLE } from '@/store/modules/user/types';

interface SelectionState {
  visible: boolean;
  checked: string[];
}

interface SearchUserState {
  editPanelVisible: Ref<boolean>;
  loading: Ref<boolean>;
  editUserModel: Ref<CreateOrUpdateUserReq>;

  handleOpenEditPanel: ($event: Event, record?: UserModel) => void;
  submitCreateOrUpdate: (opts?: any) => Promise<any>;

  selectionState: SelectionState;
  handleToggleSelection: () => void;
  submitDelete: (ids: UserModel['id'][]) => Promise<any>;
}

const symbol = Symbol('EDIT');

export function provideEditUser(): SearchUserState {
  const { loading, setLoading } = useLoading();

  const editPanelVisible = ref<boolean>(false);

  const editUserModel = ref<CreateOrUpdateUserReq>({});

  // 用 event 占据第一个参数
  // 在template中使用时，如果不传参数（创建），可以不用加括号
  const handleOpenEditPanel = ($event: Event, record?: UserModel) => {
    // 创建时默认 普通用户
    editUserModel.value = { role: USERROLE.COMMON, ...record };
    editPanelVisible.value = true;
  };

  const submitCreateOrUpdate = async () => {
    if (!editUserModel.value || isEmpty(editUserModel.value)) {
      return null;
    }
    setLoading(true);
    try {
      const { data } = await createOrUpdateUser(editUserModel.value);
      if (data?.id) {
        // 将id返回，用于在前端逻辑中修改 renderData 用户列表，避免不必要的请求
        return data;
      }
      return null;
    } catch (err: any) {
      Message.error(err?.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 显示表格勾选
  const selectionState = reactive<SelectionState>({
    visible: false,
    checked: [],
  });

  const handleToggleSelection = () => {
    selectionState.checked = [];
    selectionState.visible = !selectionState.visible;
  };

  const submitDelete = async (ids: UserModel['id'][]) => {
    setLoading(true);
    try {
      const { data } = await deleteUser({ ids });
      if (data?.ids && data.ids?.length === 0) {
        Message.success(`已删除${ids.length}个用户`);
      } else {
        Message.warning(
          `已删除${ids.length - data.ids.length}个用户, ${
            data?.ids?.length || 0
          }个用户删除失败`
        );
      }
      // 将成功的ids返回，用于在前端逻辑中修改 renderData 用户列表，避免不必要的请求
      return difference(ids, data.ids);
    } catch (err: any) {
      Message.error(err?.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const returnState: SearchUserState = {
    editPanelVisible,
    loading,
    editUserModel,
    handleOpenEditPanel,
    submitCreateOrUpdate,

    selectionState,
    handleToggleSelection,
    submitDelete,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useEditUser(): SearchUserState {
  return inject(symbol) as SearchUserState;
}
