<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, FormInstance } from '@arco-design/web-vue';
  import { /* isEmail, */ isPhone } from '@/utils/is';
  import { useUserStore } from '@/store';
  import { UpdateUserInfoReq, updateUserInfo } from '@/api/account';

  const { t } = useI18n();

  const userStore = useUserStore();

  // 绑定表单实例
  const basicInfoFormRef = ref<FormInstance>();

  // 表单数据
  const basicInfoModel = reactive<UpdateUserInfoReq>({
    username: userStore.username || '',
    nickname: userStore.nickname || '',
    phone: userStore.phone || '',
    email: userStore.email || '',
  });

  // 响应函数
  const handleSubmit = async () => {
    const errors = await basicInfoFormRef.value?.validate();
    if (errors && Object.keys(errors).length > 0) {
      return;
    }
    try {
      const { data } = await updateUserInfo(basicInfoModel);
      if (data.username) {
        Message.success('基本信息已修改');
      }
    } catch (err: any) {
      Message.error(t(err?.message));
    }
  };
  const handleReset = async () => {
    await basicInfoFormRef.value?.resetFields();
  };
</script>

<template>
  <a-form
    ref="basicInfoFormRef"
    :model="basicInfoModel"
    auto-label-width
    scroll-to-first-error
    class="w-full max-w-500px mx-auto pr-4"
  >
    <!-- 用户名 -->
    <a-form-item
      field="username"
      label="用户名"
      :rules="[
        {
          required: true,
          message: '用户名不可为空',
        },
        {
          minLength: 4,
          message: '用户名长度不可小于4',
        },
        {
          maxLength: 32,
          message: '用户名长度不可大于32',
        },
      ]"
    >
      <a-input
        v-model="basicInfoModel.username"
        allow-clear
        placeholder="输入用户名"
      />
    </a-form-item>
    <!-- 用户昵称 -->
    <a-form-item
      field="nickname"
      label="用户昵称"
      :rules="[
        {
          minLength: 3,
          message: '用户昵称长度不可小于3',
        },
        {
          maxLength: 24,
          message: '用户昵称长度不可大于23',
        },
      ]"
    >
      <a-input
        v-model="basicInfoModel.nickname"
        allow-clear
        placeholder="输入用户昵称"
      />
    </a-form-item>
    <!-- 手机 -->
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
        v-model="basicInfoModel.phone"
        allow-clear
        placeholder="输入手机号码，如178xxxxxxxx"
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
        v-model="basicInfoModel.email"
        allow-clear
        placeholder="输入电子邮箱，如xxx@example.com"
      />
    </a-form-item>
    <a-form-item row-class="mt-4" content-class="gap-4">
      <a-button type="primary" @click="handleSubmit"> 提交 </a-button>
      <a-button type="secondary" @click="handleReset"> 重置 </a-button>
    </a-form-item>
  </a-form>
</template>
