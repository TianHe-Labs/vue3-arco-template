<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { USERROLE } from '@/store/modules/user/types.d';
  import { enum2Arr } from '@/utils/transform';
  import { isPhone } from '@/utils/is';
  import { useEditUser } from '../composables/edit';
  import { useSearchUser } from '../composables/search';
  const { onUpdateRenderData } = useSearchUser();

  const { editPanelVisible, editUserFormRef, editUserModel, handleSubmitEdit } =
    useEditUser();

  // 非业务逻辑，仅页面显示
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
    @before-ok="handleSubmitEdit(onUpdateRenderData)"
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
          placeholder="输入用户名"
        />
      </a-form-item>
      <a-form-item field="nickname" label="用户昵称">
        <a-input
          v-model="editUserModel.nickname"
          allow-clear
          placeholder="输入用户昵称"
        />
      </a-form-item>
      <a-form-item field="role" label="角色权限">
        <a-select
          v-model="editUserModel.role"
          :options="roleOptions"
          allow-clear
          placeholder="选择角色权限"
        />
      </a-form-item>
      <!-- 如果是roles -->
      <!-- <a-form-item field="roles" label="角色权限">
        <a-select
          v-model="editUserModel.roles"
          :options="roleOptions"
          multiple
          allow-clear
          placeholder="选择角色权限"
        />
      </a-form-item> -->
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
          placeholder="输入电子邮箱"
        />
      </a-form-item>
      <a-form-item
        field="phone"
        label="手机号码"
        :rules="[
          {
            validator: (phone: string, callback: any) => {
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
          placeholder="输入手机号码"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
