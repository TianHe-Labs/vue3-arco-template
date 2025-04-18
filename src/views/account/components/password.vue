<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { Message, FormInstance } from '@arco-design/web-vue';
  import { UpdateUserPasswordReq, updateUserPassword } from '@/api/account';
  import useUserLogout from '@/composables/logout';

  const { logout } = useUserLogout();

  // 绑定表单实例
  const passwordFormRef = ref<FormInstance>();
  // 表单数据
  const passwordFormData = reactive<UpdateUserPasswordReq>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 事件响应
  const handleSumbit = async () => {
    const errors = await passwordFormRef.value?.validate();
    if (errors && Object.keys(errors).length > 0) {
      return;
    }
    try {
      const { data } = await updateUserPassword(passwordFormData);
      if (data.username) {
        Message.info('密码修改成功，请重新登录');
        setTimeout(() => {
          logout();
        }, 600);
      }
    } catch (err: any) {
      Message.error(err?.message);
    }
  };
  const handleReset = async () => {
    await passwordFormRef.value?.resetFields();
  };
</script>

<template>
  <a-form
    ref="passwordFormRef"
    :model="passwordFormData"
    auto-label-width
    scroll-to-first-error
    class="w-full max-w-500px mx-auto pr-4"
  >
    <!-- 当前密码 -->
    <a-form-item
      field="oldPassword"
      label="当前密码"
      :rules="[
        {
          required: true,
          message: '密码不可为空',
        },
        {
          minLength: 8,
          message: '密码长度不可小于8',
        },
      ]"
    >
      <a-input-password
        v-model="passwordFormData.oldPassword"
        allow-clear
        placeholder="输入当前密码"
      />
    </a-form-item>
    <!-- 新密码 -->
    <a-form-item
      field="newPassword"
      label="新密码"
      :rules="[
        {
          required: true,
          message: '密码不可为空',
        },
        {
          minLength: 8,
          message: '密码长度不可小于8',
        },
      ]"
    >
      <a-input-password
        v-model="passwordFormData.newPassword"
        allow-clear
        placeholder="输入新密码"
      />
    </a-form-item>
    <!-- 确认新密码 -->
    <a-form-item
      field="confirmPassword"
      label="确认新密码"
      :rules="[
        {
          required: true,
          message: '密码不可为空',
        },
        {
          validator: (confirmPassword: string, callback: any) => {
            if (confirmPassword !== passwordFormData.newPassword) {
              callback('与新密码不一致');
            }
          },
        },
      ]"
    >
      <a-input-password
        v-model="passwordFormData.confirmPassword"
        allow-clear
        placeholder="再次输入新密码"
      />
    </a-form-item>
    <a-form-item row-class="mt-4" content-class="gap-4">
      <a-button type="primary" @click="handleSumbit"> 提交修改 </a-button>
      <a-button type="secondary" @click="handleReset"> 重置 </a-button>
    </a-form-item>
  </a-form>
</template>
