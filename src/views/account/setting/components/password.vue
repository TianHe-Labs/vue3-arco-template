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
    current: '',
    new: '',
    confirm: '',
  });

  // 事件响应
  // 提交
  const handleSubmit = async () => {
    const errors = await passwordFormRef.value?.validate();
    if (errors && Object.keys(errors).length > 0) {
      return;
    }
    try {
      await updateUserPassword(passwordFormData);
      Message.info('密码修改成功，请重新登录');
      setTimeout(() => {
        logout();
      }, 600);
    } catch (err: any) {
      Message.error(err?.message);
    }
  };
  // 重置
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
      field="current"
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
        v-model="passwordFormData.current"
        allow-clear
        placeholder="输入当前密码"
      />
    </a-form-item>
    <!-- 新密码 -->
    <a-form-item
      field="new"
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
        v-model="passwordFormData.new"
        allow-clear
        placeholder="输入新密码"
      />
    </a-form-item>
    <!-- 确认新密码 -->
    <a-form-item
      field="confirm"
      label="确认新密码"
      :rules="[
        {
          required: true,
          message: '密码不可为空',
        },
        {
          validator: (confirm: string, callback: any) => {
            if (confirm !== passwordFormData.new) {
              callback('与新密码不一致');
            }
          },
        },
      ]"
    >
      <a-input-password
        v-model="passwordFormData.confirm"
        allow-clear
        placeholder="再次输入新密码"
      />
    </a-form-item>
    <a-form-item row-class="mt-4" content-class="gap-4">
      <a-button type="primary" @click="handleSubmit"> 提交 </a-button>
      <a-button type="secondary" @click="handleReset"> 重置 </a-button>
    </a-form-item>
  </a-form>
</template>
