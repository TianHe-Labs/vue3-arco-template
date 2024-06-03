<template>
  <a-form ref="userFormRef" :model="userFormData" class="form" auto-label-width>
    <!-- 名称 -->
    <a-form-item
      field="username"
      :label="$t('userInformation.form.username.label')"
      :rules="[
        {
          required: true,
          message: $t('userInformation.form.username.error.required'),
        },
      ]"
    >
      <a-input
        v-model="userFormData.username"
        :placeholder="$t('userInformation.form.username.placeholder')"
      />
    </a-form-item>
    <!-- 邮箱 -->
    <a-form-item
      field="email"
      :label="$t('userInformation.form.email.label')"
      :rules="[
        {
          required: true,
          message: $t('userInformation.form.email.error.required'),
        },
      ]"
    >
      <a-input
        v-model="userFormData.email"
        :placeholder="$t('userInformation.form.email.placeholder')"
      />
    </a-form-item>
    <!-- 手机 -->
    <a-form-item
      field="phone"
      hide-asterisk
      :label="$t('userInformation.form.phone.label')"
      :rules="[
        {
          required: false,
          message: $t('userInformation.form.phone.error.required'),
        },
      ]"
    >
      <a-input
        v-model="userFormData.phone"
        :placeholder="$t('userInformation.form.phone.placeholder')"
      />
    </a-form-item>
    <!-- 部门 -->
    <a-form-item
      field="sector"
      hide-asterisk
      :label="$t('userInformation.form.sector.label')"
      :rules="[
        {
          required: false,
          message: $t('userInformation.form.sector.error.required'),
        },
      ]"
    >
      <a-input
        v-model="userFormData.sector"
        :placeholder="$t('userInformation.form.sector.placeholder')"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate">
          {{ $t('UserProfile.update') }}
        </a-button>
        <a-button type="secondary" @click="reset">
          {{ $t('UserProfile.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { UpdateUserInfoParams, updateUserInfo } from '@/api/user';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';

  const { t } = useI18n();

  const userStore = useUserStore();

  const userFormRef = ref<FormInstance>();
  const userFormData = reactive<UpdateUserInfoParams>({
    username: userStore.username,
    phone: userStore.phone,
    email: userStore.email,
    sector: userStore.sector,
  });
  const validate = async () => {
    const errors = await userFormRef.value?.validate();
    if (!errors) {
      try {
        const { data } = await updateUserInfo(userFormData);
        if (data.username) {
          Message.info(t('UserProfile.update.message.success'));
        }
      } catch (err) {
        // you can report use errorHandler or other
        Message.info(t('UserProfile.update.message.failure'));
      }
    }
  };
  const reset = async () => {
    await userFormRef.value?.resetFields();
  };
</script>

<style lang="less" scoped>
  .form {
    width: 540px;
    margin: 0 auto;
    padding-right: 50px;
  }
</style>
