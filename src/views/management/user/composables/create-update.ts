import { provide, inject, Ref, ref, shallowRef } from 'vue';
import { FormInstance, Message, Modal } from '@arco-design/web-vue';
import { omit } from 'lodash';
import { useClipboard } from '@vueuse/core';
import useLoading from '@/composables/loading';
import {
  CreateUpdateUserModel,
  UserModel,
  createUser,
  updateUser,
} from '@/api/user';

interface CreateUpdateUserState {
  createUpdateUserPanelVisible: Ref<boolean>;
  loading: Ref<boolean>;
  createUpdateUserFormRef: Ref<FormInstance>;
  createUpdateUserModel: Ref<CreateUpdateUserModel>;

  handleCreateUpdateUser: ($event: Event, record?: UserModel) => void;
  handleSubmitCreateUpdateUser: (
    callback?: (...args: any) => void | Promise<void>,
  ) => Promise<boolean>;
}

const symbol = Symbol('CREATE-UPDATE-USER');

const resetCreateUpdateUserModel = (): CreateUpdateUserModel => {
  return {
    id: undefined,
    username: undefined,
    nickname: undefined,
    orgId: undefined, // 选择
    role: undefined, // 选择
    // roles: [USERROLE.ADMIN, USERROLE.COMMON],
    email: undefined, // 输入
    phone: undefined, // 输入
    status: undefined, // 选择
  };
};

/**
 * 创建（单个）/更新用户，共用弹窗
 */
export function provideCreateUpdateUser(): CreateUpdateUserState {
  // 弹窗 创建（单个）/更新 共用
  const createUpdateUserPanelVisible = ref<boolean>(false);

  // 表单实例
  const createUpdateUserFormRef = shallowRef<FormInstance>();

  // 表单数据
  const createUpdateUserModel = ref<CreateUpdateUserModel>(
    resetCreateUpdateUserModel(),
  );

  // 打开弹窗 创建/更新 共用弹窗
  // 用 event 占据第一个参数
  // 在template中使用时，如果不传参数（创建），可以不用加括号
  const handleCreateUpdateUser = (
    $event: Event,
    record?: Partial<UserModel>,
  ) => {
    // 重置表单校验状态
    createUpdateUserFormRef.value?.clearValidate();
    // 重置表单数据
    // 创建时默认 普通用户
    createUpdateUserModel.value = {
      ...resetCreateUpdateUserModel(),
      ...record,
    };
    // 打开弹窗
    createUpdateUserPanelVisible.value = true;
  };

  const { loading, setLoading } = useLoading();

  // 提交 创建（单个）/更新
  const handleSubmitCreateUpdateUser = async (
    callback?: (...args: any) => void | Promise<void>,
  ) => {
    // 必要的表单校验
    const errors = await createUpdateUserFormRef.value?.validate();
    if (errors && Object.keys(errors).length > 0) {
      return false;
    }

    setLoading(true);

    try {
      // 根据 createUpdateUserModel.value?.id
      // 来判断是创建还是更新
      if (createUpdateUserModel.value?.id) {
        const { data } = await updateUser(createUpdateUserModel.value);
        // 使用 callback 执行后续操作（更新列表 ）减少耦合
        callback?.({
          type: 'update',
          record: {
            ...createUpdateUserModel.value,
            ...omit(data, 'password'),
          },
        });

        Message.success('已更新');
        // 用于 modal 的 before-ok 事件
        // true 关闭 modal
        return true;
      } else {
        const { data } = await createUser({
          list: [createUpdateUserModel.value],
        });

        // 返回的是创建成功的用户列表
        if (!data || data.list.length === 0) {
          Message.error('新增失败');
          return false;
        }

        // 使用 callback 执行后续操作（更新列表 ）减少耦合
        callback?.({
          type: 'create',
          record: {
            ...createUpdateUserModel.value,
            // 返回的是创建成功的用户列表，创建单个时，就不重新刷新列表了
            ...data.list[0],
          },
        });

        // 弹窗显示新用户及其密码（规则）
        const content = `用户名：${createUpdateUserModel.value.username}  密码：123456`;
        Modal.info({
          title: '提示',
          titleAlign: 'start',
          content,
          okText: '复制',
          hideCancel: true,
          onBeforeOk: () => {
            const { isSupported, copy } = useClipboard();
            try {
              if (isSupported.value) {
                copy(content);
                Message.success('已复制到剪切板');
                return true;
              }
              Message.warning('浏览器不支持，须手动复制到剪切板');
              return false;
            } catch (err: any) {
              // 使用ID来避免出现多个消息提示
              Message.error({
                id: 'error-message',
                content: err?.message,
              });
              return false;
            }
          },
        });
        // 用于 modal 的 before-ok 事件
        // true 关闭 modal
        return true;
      }
    } catch (err: any) {
      Message.error(err?.message);
      // 用于 modal 的 before-ok 事件
      // true 关闭 modal
      return false;
    } finally {
      setLoading(false);
    }
  };

  const returnState: CreateUpdateUserState = {
    createUpdateUserPanelVisible,
    createUpdateUserFormRef,
    createUpdateUserModel,
    handleCreateUpdateUser,
    loading,
    handleSubmitCreateUpdateUser,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useCreateUpdateUser(): CreateUpdateUserState {
  return inject(symbol) as CreateUpdateUserState;
}
