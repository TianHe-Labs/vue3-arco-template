<template>
  <a-form
    ref="passwordFormRef"
    :model="passwordFormData"
    class="form"
    auto-label-width
  >
    <!-- 当前密码 -->
    <a-form-item
      field="oldPassword"
      :label="$t('userPassword.form.oldPassword.label')"
      :rules="[
        {
          required: true,
          message: $t('userPassword.form.oldPassword.error.required'),
        },
        {
          minLength: 8,
          message: $t('userPassword.form.oldPassword.error.short'),
        },
      ]"
    >
      <a-input-password
        v-model="passwordFormData.oldPassword"
        allow-clear
        :placeholder="$t('userPassword.form.oldPassword.placeholder')"
      />
    </a-form-item>
    <!-- 新密码 -->
    <a-form-item
      field="newPassword"
      :label="$t('userPassword.form.newPassword.label')"
      :rules="[
        {
          required: true,
          message: $t('userPassword.form.newPassword.error.required'),
        },
        {
          minLength: 8,
          message: $t('userPassword.form.newPassword.error.short'),
        },
      ]"
    >
      <a-input-password
        v-model="passwordFormData.newPassword"
        allow-clear
        :placeholder="$t('userPassword.form.newPassword.placeholder')"
      />
    </a-form-item>
    <!-- 确认新密码 -->
    <a-form-item
      field="confirmPassword"
      :label="$t('userPassword.form.confirmPassword.label')"
      :rules="[
        {
          required: true,
          message: $t('userPassword.form.confirmPassword.error.required'),
        },
        {
          validator: (value, callback) => {
            if (value !== passwordFormData.newPassword) {
              callback($t('userPassword.form.confirmPassword.error.invalid'));
            }
          },
        },
      ]"
    >
      <a-input-password
        v-model="passwordFormData.confirmPassword"
        allow-clear
        :placeholder="$t('userPassword.form.confirmPassword.placeholder')"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate">
          {{ $t('userSettings.update') }}
        </a-button>
        <a-button type="secondary" @click="reset">
          {{ $t('userSettings.reset') }}
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
  import useUserLogout from '@/hooks/user-logout';

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
        if (data.id) {
          Message.info(t('userPassword.form.update'));
          setTimeout(() => {
            logout();
          }, 600);
        }
      } catch (err) {
        // you can report use errorHandler or other
        Message.info(t('userSettings.update.message.failure'));
      }
    }
  };
  const reset = async () => {
    await passwordFormRef.value?.resetFields();
  };
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
    padding-right: 50px;
  }
</style>
