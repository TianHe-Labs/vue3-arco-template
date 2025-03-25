<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, FormInstance } from '@arco-design/web-vue';
  import { /* isEmail, */ isPhone } from '@/utils/is';
  import { useUserStore } from '@/store';
  import { UpdateUserInfoParams, updateUserInfo } from '@/api/account';

  const { t } = useI18n();

  const userStore = useUserStore();

  const basicInfoFormRef = ref<FormInstance>();
  const basicInfoFormModel = reactive<UpdateUserInfoParams>({
    username: userStore.username,
    phone: userStore.phone,
    email: userStore.email,
    sector: userStore.sector,
    status: userStore.status,
  });

  // 响应函数
  const handleSubmit = async () => {
    const errors = await basicInfoFormRef.value?.validate();
    if (errors && Object.keys(errors).length > 0) {
      return;
    }
    try {
      const { data } = await updateUserInfo(basicInfoFormModel);
      if (data.username) {
        Message.info(t('profile.actions.update.success.message'));
      }
    } catch (err: any) {
      Message.error(
        t(err?.message || 'profile.actions.update.failure.message')
      );
    }
  };
  const handleReset = async () => {
    await basicInfoFormRef.value?.resetFields();
  };
</script>

<template>
  <a-card
    class="flex-auto rounded"
    title="基本信息"
    :bordered="false"
    :header-style="{ border: 'none' }"
    :body-style="{ height: '100%' }"
  >
    <a-form
      ref="basicInfoFormRef"
      :model="basicInfoFormModel"
      auto-label-width
      scroll-to-first-error
      class="w-full max-w-500px mx-auto pr-4"
    >
      <!-- 名称 -->
      <a-form-item
        field="username"
        label="用户名称"
        :rules="[
          {
            required: true,
            message: '用户名称不可为空',
          },
          {
            minLength: 4,
            message: '用户名称长度不可小于4',
          },
          {
            maxLength: 32,
            message: '用户名称长度不可大于32',
          },
        ]"
      >
        <a-input
          v-model="basicInfoFormModel.username"
          allow-clear
          placeholder="请输入用户名称"
        />
      </a-form-item>
      <!-- 邮箱 -->
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
          v-model="basicInfoFormModel.email"
          allow-clear
          placeholder="请输入电子邮箱，如xxx@example.com"
        />
      </a-form-item>
      <!-- 手机 -->
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
          v-model="basicInfoFormModel.phone"
          allow-clear
          placeholder="请输入手机号码，如178xxxxxxxx"
        />
      </a-form-item>
      <!-- 部门 -->
      <a-form-item field="sector" label="所属部门">
        <a-input
          v-model="basicInfoFormModel.sector"
          allow-clear
          placeholder="请输入所属部门"
        />
      </a-form-item>
      <!-- 状态 -->
      <a-form-item field="status" label="当前状态">
        <a-input
          v-model="basicInfoFormModel.status"
          allow-clear
          placeholder="请输入当前状态"
        />
      </a-form-item>
      <a-form-item content-class="gap-4">
        <a-button type="primary" @click="handleSubmit"> 提交修改 </a-button>
        <a-button type="secondary" @click="handleReset"> 重置 </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>
