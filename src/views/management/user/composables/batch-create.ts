import { Ref, inject, provide, ref } from 'vue';
import useLoading from '@/composables/loading';
import { Message } from '@arco-design/web-vue';
import { CreateUpdateUserModel, createUser } from '@/api/user';
import { uniqBy } from 'lodash';

const symbol = Symbol('BATCH-CREATE-USER');

interface BatchCreateUserState {
  batchCreateUserPanelVisible: Ref<boolean>;
  batchCreateUserModel: Ref<CreateUpdateUserModel[]>;
  handleBatchCreateUser: () => void;
  loading: Ref<boolean>;
  handleSubmitBatchCreateUser: (callback?: any) => Promise<boolean>;
}

/**
 * 批量创建
 */
export function provideBatchCreateUser(): BatchCreateUserState {
  const batchCreateUserPanelVisible = ref<boolean>(false);

  // 表单数据（批量）
  const batchCreateUserModel = ref<CreateUpdateUserModel[]>([
    {
      username: undefined,
      nickname: undefined,
      // orgId: undefined, // 选择
      orgName: undefined, // 批量时输入
      role: undefined,
      email: undefined,
      phone: undefined,
    },
  ]);

  // 触发 打开批量创建用户面板
  const handleBatchCreateUser = () => {
    batchCreateUserPanelVisible.value = true;
  };

  const { loading, setLoading } = useLoading();

  // 提交 批量创建用户
  const handleSubmitBatchCreateUser = async (callback?: any) => {
    const uniqueFiltered = uniqBy(
      batchCreateUserModel.value.filter(
        (item) => item.username !== '' && item.phone !== '',
      ),
      (item) => item.phone,
    );

    if (uniqueFiltered.length === 0) {
      Message.error('输入数据为空，填写数据再提交');
      return false;
    }
    setLoading(true);
    try {
      const { data } = await createUser({ list: uniqueFiltered });
      // callback 执行后续操作（fetchData 刷新数据）减少耦合
      callback?.();
      // data 返回的是创建成功的用户列表
      if (data && data.list.length === uniqueFiltered.length) {
        Message.success(`已新增${data.list.length}个用户`);
        batchCreateUserModel.value = [];
        return true;
      } else {
        Message.success(
          `已新增${data.list.length}个用户，${
            uniqueFiltered.length - data.list.length
          }个新增失败`,
        );
        // 如果有未成功的，将未成功的数据保留显示在表格中
        batchCreateUserModel.value = data.list.filter(
          (item: CreateUpdateUserModel) =>
            data.list.some(
              (it: CreateUpdateUserModel) => it.username === item.username,
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
    batchCreateUserModel,
    batchCreateUserPanelVisible,
    loading,
    handleBatchCreateUser,
    handleSubmitBatchCreateUser,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useBatchCreateUser(): BatchCreateUserState {
  return inject(symbol) as BatchCreateUserState;
}
