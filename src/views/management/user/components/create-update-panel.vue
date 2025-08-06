<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { USERROLE } from '@/api/user';
  import { enum2Arr } from '@/utils/transform';
  import { isPhone } from '@/utils/is';
  import { useCreateUpdateUser } from '../composables/create-update';
  import { useSearchUser } from '../composables/search';
  import { SelectOption } from '@arco-design/web-vue';

  // 创建（单个）/更新时，前端更新数据，不再请求接口
  const { onUpdateRenderData } = useSearchUser();

  // 创建（单个）/更新，共用弹窗
  const {
    createUpdateUserPanelVisible,
    createUpdateUserFormRef,
    createUpdateUserModel,
    handleSubmitCreateUpdateUser,
  } = useCreateUpdateUser();

  // 非业务逻辑，仅页面显示
  const { t } = useI18n();

  const roleOptions: SelectOption[] = enum2Arr(USERROLE).map((value) => ({
    label: t(`user.role.text.${value}`),
    value,
  }));

  const orgOptions: SelectOption[] = [];
</script>

<template>
  <a-modal
    v-model:visible="createUpdateUserPanelVisible"
    title-align="start"
    :title="!!createUpdateUserModel.id ? '修改用户' : '新增用户'"
    @before-ok="handleSubmitCreateUpdateUser(onUpdateRenderData)"
  >
    <a-form
      ref="createUpdateUserFormRef"
      :model="createUpdateUserModel"
      auto-label-width
    >
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
          v-model="createUpdateUserModel.username"
          allow-clear
          placeholder="输入用户名"
        />
      </a-form-item>
      <a-form-item field="nickname" label="用户昵称">
        <a-input
          v-model="createUpdateUserModel.nickname"
          allow-clear
          placeholder="输入用户昵称"
        />
      </a-form-item>
      <a-form-item field="orgId" label="所属部门">
        <a-select
          v-model="createUpdateUserModel.orgId"
          :options="orgOptions"
          allow-clear
          placeholder="选择所属部门"
        />
      </a-form-item>
      <a-form-item field="role" label="角色权限">
        <a-select
          v-model="createUpdateUserModel.role"
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
          v-model="createUpdateUserModel.phone"
          allow-clear
          placeholder="输入手机号码"
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
          v-model="createUpdateUserModel.email"
          allow-clear
          placeholder="输入电子邮箱"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
