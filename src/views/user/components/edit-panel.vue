<script lang="ts" setup>
  import { shallowRef } from 'vue';
  import { FormInstance, Message, Modal } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { omit } from 'lodash';
  import { useClipboard } from '@vueuse/core';
  import { USERROLE } from '@/store/modules/user/types';
  import { enum2Arr } from '@/utils/transform';
  import { isPhone } from '@/utils/is';
  import { useEditUser } from '../hooks/edit';
  import { useSearchUser } from '../hooks/search';

  const { renderData } = useSearchUser();

  const { editPanelVisible, editUserModel, submitCreateOrUpdate } =
    useEditUser();

  const editUserFormRef = shallowRef<FormInstance>();

  const handleCreateOrUpdate = async () => {
    const errors = await editUserFormRef.value?.validate();
    if (errors && Object.keys(errors).length > 0) {
      return false;
    }
    const data = await submitCreateOrUpdate();
    if (!data || !data?.id) {
      return false;
    }
    if (editUserModel.value?.id) {
      // 更新
      renderData.value = renderData.value.map((item) => {
        if (item.id === editUserModel.value.id) {
          return {
            ...item,
            ...editUserModel.value,
          };
        }
        return item;
      });

      Message.success(
        `已更新用户${
          editUserModel.value?.nickname || editUserModel.value.username
        }`
      );
    } else {
      // 创建，会返回新用户密码
      renderData.value.unshift({
        ...editUserModel.value,
        ...omit(data, 'password'),
      });

      Message.success(
        `已创建用户${
          editUserModel.value?.nickname || editUserModel.value.username
        }`
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
            Message.warning('浏览器不支持，请手动复制到剪切板');
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
    return true;
  };

  const { t } = useI18n();
  const roleOptions = enum2Arr(USERROLE).map((value) => ({
    label: t(`account.roles.${value}`),
    value,
  }));
</script>

<template>
  <a-modal
    v-model:visible="editPanelVisible"
    title-align="start"
    :title="!!editUserModel.id ? '修改用户' : '创建用户'"
    @before-ok="handleCreateOrUpdate"
  >
    <a-form ref="editUserFormRef" :model="editUserModel" auto-label-width>
      <a-form-item
        field="username"
        label="用户名"
        required
        :rules="[
          {
            required: true,
            message: '用户名不可为空',
          },
        ]"
      >
        <a-input
          v-model="editUserModel.username"
          allow-clear
          placeholder="请输入用户名"
        />
      </a-form-item>
      <a-form-item field="nickname" label="用户昵称">
        <a-input
          v-model="editUserModel.nickname"
          allow-clear
          placeholder="请输入用户昵称"
        />
      </a-form-item>
      <a-form-item field="role" label="角色权限">
        <a-select
          v-model="editUserModel.role"
          :options="roleOptions"
          allow-clear
          placeholder="请选择角色权限"
        />
      </a-form-item>
      <a-form-item
        field="email"
        label="电子邮箱"
        :rules="[
          {
            type: 'email',
            message: '电子邮箱格式不正确',
          },
          // {
          //   validator: (email, callback) => {
          //     if (email && !isEmail(email)) {
          //       callback('电子邮箱格式不正确');
          //     }
          //   },
          // },
        ]"
      >
        <a-input
          v-model="editUserModel.email"
          allow-clear
          placeholder="请输入电子邮箱"
        />
      </a-form-item>
      <a-form-item
        field="phone"
        label="手机号码"
        :rules="[
          {
            validator: (phone, callback) => {
              if (phone && !isPhone(phone)) {
                callback('手机号码格式不正确');
              }
            },
          },
        ]"
      >
        <a-input
          v-model="editUserModel.phone"
          allow-clear
          placeholder="请输入手机号码"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
