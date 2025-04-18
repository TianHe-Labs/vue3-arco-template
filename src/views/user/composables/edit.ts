import { provide, inject, Ref, ref, shallowRef } from 'vue';
import { FormInstance, Message, Modal } from '@arco-design/web-vue';
import { isEmpty, omit } from 'lodash';
import { useClipboard } from '@vueuse/core';
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
  editUserFormRef: Ref<FormInstance>;
  editUserModel: Ref<CreateOrUpdateUserReq>;

  handleOpenEditPanel: ($event: Event, record?: UserModel) => void;
  handleSubmitEdit: (opts?: any) => Promise<any>;
}

const symbol = Symbol('EDIT');

export function provideEditUser(): SearchUserState {
  const { loading, setLoading } = useLoading();

  const editPanelVisible = ref<boolean>(false);

  // 表单实例
  const editUserFormRef = shallowRef<FormInstance>();

  const editUserModel = ref<CreateOrUpdateUserReq>({});

  // 用 event 占据第一个参数
  // 在template中使用时，如果不传参数（创建），可以不用加括号
  const handleOpenEditPanel = ($event: Event, record?: UserModel) => {
    // 创建时默认 普通用户
    editUserModel.value = { role: USERROLE.COMMON, ...record };
    editPanelVisible.value = true;
  };

  const handleSubmitEdit = async (callback?: any /* emits: any */) => {
    // 必要的表单校验
    const errors = await editUserFormRef.value?.validate();
    if (errors && Object.keys(errors).length > 0) {
      return false;
    }
    // 如果表单数据为空，则不进行提交
    if (!editUserModel.value || isEmpty(editUserModel.value)) {
      return false;
    }
    setLoading(true);
    try {
      const { data } = await createOrUpdateUser(editUserModel.value);
      // 根据 editUserModel.value?.id
      // 来判断是创建还是更新
      let updatedData: any = null;
      if (editUserModel.value?.id) {
        updatedData = {
          type: 'update',
          record: {
            ...editUserModel.value,
          },
        };
        // 更新
        // 通过事件等方式来通知其他组件更新列表
        // 而不是直接修改另一个组合式函数逻辑中的变量
        // 确保单一职责原则，降低耦合，明确状态和数据流向，提高代码的可维护性
        // renderData.value = renderData.value.map((item) => {
        //   if (item.id === editUserModel.value.id) {
        //     return {
        //       ...item,
        //       ...editUserModel.value,
        //     };
        //   }
        //   return item;
        // });
        Message.success(
          `已更新用户${
            editUserModel.value?.nickname || editUserModel.value.username
          }`,
        );
      } else {
        // 创建 会返回新用户密码
        updatedData = {
          type: 'create',
          record: {
            ...editUserModel.value,
            ...omit(data, 'password'),
          },
        };

        // renderData.value.unshift({
        //   ...editUserModel.value,
        //   ...omit(data, 'password'),
        // });

        Message.success(
          `已创建用户${
            editUserModel.value?.nickname || editUserModel.value.username
          }`,
        );
        // 弹窗显示新用户及其密码用于复制
        const content = `用户名：${data.username}  密码：${data.password}`;
        Modal.info({
          title: '提示',
          titleAlign: 'start',
          content,
          modalClass: '!p-5',
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
      }

      // 通知组件更新列表
      // emits('update:data', updatedData);

      // 使用 callback 来更新列表
      callback?.(updatedData);
      return true;
    } catch (err: any) {
      Message.error(err?.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const returnState: SearchUserState = {
    editPanelVisible,
    loading,
    editUserFormRef,
    editUserModel,
    handleOpenEditPanel,
    handleSubmitEdit,
  };

  provide(symbol, returnState);

  return returnState;
}

export function useEditUser(): SearchUserState {
  return inject(symbol) as SearchUserState;
}
