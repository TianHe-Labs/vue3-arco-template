<template>
  <a-form
    ref="passwordFormRef"
    :model="passwordFormData"
    auto-label-width
    class="w-full max-w-500px mx-auto pr-4"
  >
    <!-- 当前密码 -->
    <a-form-item
      field="oldPassword"
      :label="t('password.form.oldPassword.label')"
      :rules="[
        {
          required: true,
          message: t('password.form.oldPassword.error.required'),
        },
        {
          minLength: 8,
          message: t('password.form.oldPassword.error.short'),
        },
      ]"
    >
      <a-input-password
        v-model="passwordFormData.oldPassword"
        allow-clear
        :placeholder="t('password.form.oldPassword.placeholder')"
      />
    </a-form-item>
    <!-- 新密码 -->
    <a-form-item
      field="newPassword"
      :label="t('password.form.newPassword.label')"
      :rules="[
        {
          required: true,
          message: t('password.form.newPassword.error.required'),
        },
        {
          minLength: 8,
          message: t('password.form.newPassword.error.short'),
        },
      ]"
    >
      <a-input-password
        v-model="passwordFormData.newPassword"
        allow-clear
        :placeholder="t('password.form.newPassword.placeholder')"
      />
    </a-form-item>
    <!-- 确认新密码 -->
    <a-form-item
      field="confirmPassword"
      :label="t('password.form.confirmPassword.label')"
      :rules="[
        {
          required: true,
          message: t('password.form.confirmPassword.error.required'),
        },
        {
          validator: (value: any, callback: any) => {
            if (value !== passwordFormData.newPassword) {
              callback(t('password.form.confirmPassword.error.invalid'));
            }
          },
        },
      ]"
    >
      <a-input-password
        v-model="passwordFormData.confirmPassword"
        allow-clear
        :placeholder="t('password.form.confirmPassword.placeholder')"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate">
          {{ t('profile.actions.update') }}
        </a-button>
        <a-button type="secondary" @click="reset">
          {{ t('profile.actions.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { UpdateUserPasswordParams, updateUserPassword } from '@/api/user';
  import { Message } from '@arco-design/web-vue';
  import useUserLogout from '@/hooks/logout';

  const { t } = useI18n();

  const { logout } = useUserLogout();

  const passwordFormRef = ref<FormInstance>();
  const passwordFormData = reactive<UpdateUserPasswordParams>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const validate = async () => {
    const errors = await passwordFormRef.value?.validate();
    if (!errors) {
      try {
        const { data } = await updateUserPassword(passwordFormData);
        if (data.username) {
          Message.info(t('password.form.actions.update.success.message'));
          setTimeout(() => {
            logout();
          }, 600);
        }
      } catch (err: any) {
        // you can report use errorHandler or other
        Message.error(
          err?.message || t('profile.actions.update.failure.message')
        );
      }
    }
  };
  const reset = async () => {
    await passwordFormRef.value?.resetFields();
  };
</script>
