<template>
  <a-form
    ref="infoFormRef"
    :model="infoFormData"
    auto-label-width
    class="w-full max-w-500px mx-auto pr-4"
  >
    <!-- 名称 -->
    <a-form-item
      field="username"
      :label="$t('information.form.username.label')"
      :rules="[
        {
          required: true,
          message: $t('information.form.username.error.required'),
        },
      ]"
    >
      <a-input
        v-model="infoFormData.username"
        :placeholder="$t('information.form.username.placeholder')"
      />
    </a-form-item>
    <!-- 邮箱 -->
    <a-form-item
      field="email"
      :label="$t('information.form.email.label')"
      :rules="[
        {
          required: true,
          message: $t('information.form.email.error.required'),
        },
      ]"
    >
      <a-input
        v-model="infoFormData.email"
        :placeholder="$t('information.form.email.placeholder')"
      />
    </a-form-item>
    <!-- 手机 -->
    <a-form-item
      field="phone"
      hide-asterisk
      :label="$t('information.form.phone.label')"
      :rules="[
        {
          required: false,
          message: $t('information.form.phone.error.required'),
        },
      ]"
    >
      <a-input
        v-model="infoFormData.phone"
        :placeholder="$t('information.form.phone.placeholder')"
      />
    </a-form-item>
    <!-- 部门 -->
    <a-form-item
      field="sector"
      hide-asterisk
      :label="$t('information.form.sector.label')"
      :rules="[
        {
          required: false,
          message: $t('information.form.sector.error.required'),
        },
      ]"
    >
      <a-input
        v-model="infoFormData.sector"
        :placeholder="$t('information.form.sector.placeholder')"
      />
    </a-form-item>
    <a-form-item>
      <div class="flex gap-4">
        <a-button type="primary" @click="validate">
          {{ $t('profile.actions.update') }}
        </a-button>
        <a-button type="secondary" @click="reset">
          {{ $t('profile.actions.reset') }}
        </a-button>
      </div>
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

  const infoFormRef = ref<FormInstance>();
  const infoFormData = reactive<UpdateUserInfoParams>({
    username: userStore.username,
    phone: userStore.phone,
    email: userStore.email,
    sector: userStore.sector,
  });
  const validate = async () => {
    const errors = await infoFormRef.value?.validate();
    if (!errors) {
      try {
        const { data } = await updateUserInfo(infoFormData);
        if (data.username) {
          Message.info(t('profile.actions.update.success.message'));
        }
      } catch (err) {
        // you can report use errorHandler or other
        Message.info(t('profile.actions.update.failure.message'));
      }
    }
  };
  const reset = async () => {
    await infoFormRef.value?.resetFields();
  };
</script>
