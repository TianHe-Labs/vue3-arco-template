import { provide, inject, Ref, ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import { difference, isEmpty } from 'lodash';
import useLoading from '@/composables/loading';
import {
  CreateOrUpdateUserReq,
  UserModel,
  createOrUpdateUser,
} from '@/api/user';
import { USERROLE } from '@/store/modules/user/types';

interface SearchUserState {
  editPanelVisible: Ref<boolean>;
  loading: Ref<boolean>;
  editUserModel: Ref<CreateOrUpdateUserReq>;

  handleOpenEditPanel: ($event: Event, record?: UserModel) => void;
  submitCreateOrUpdate: (opts?: any) => Promise<any>;
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

  const returnState: SearchUserState = {
    editPanelVisible,
    loading,
    editUserModel,
    handleOpenEditPanel,
    submitCreateOrUpdate,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useEditUser(): SearchUserState {
  return inject(symbol) as SearchUserState;
}
