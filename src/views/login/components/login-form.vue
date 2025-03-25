<script lang="ts" setup>
  import type { LoginParams } from '@/api/account';
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message, ValidatedError } from '@arco-design/web-vue';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { DEFAULT_ROUTE /* , DEFAULT_ROUTE_NAME */ } from '@/router/constants';

  const router = useRouter();
  const { loading, setLoading } = useLoading();

  const userStore = useUserStore();

  const appName = import.meta.env.VITE_APP_NAME;

  const loginConfig = useStorage('__th_ls_login_config__', {
    username: '',
    password: '',
    rememberPassword: true,
  });

  const loginModel = reactive({
    username: loginConfig.value.username,
    password: loginConfig.value.password,
  });

  const errorMessage = ref('');

  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        await userStore.login(values as LoginParams);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          path: (redirect as string) || DEFAULT_ROUTE.fullPath,
          query: {
            ...othersQuery,
          },
        });
        Message.success('登录成功，欢迎使用');
        const { rememberPassword } = loginConfig.value;
        const { username, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.username = rememberPassword ? username : '';
        loginConfig.value.password = rememberPassword ? password : '';
      } catch (err: any) {
        errorMessage.value = err?.message;
      } finally {
        setLoading(false);
      }
    }
  };
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };
</script>

<template>
  <div class="w-340px mx-auto">
    <div class="text-2xl text-text-2 font-semibold">用户认证</div>
    <div class="text-xl text-text-3">
      {{ appName }}
    </div>
    <div class="h-36px leading-36px text-danger-6">
      {{ errorMessage }}
    </div>
    <a-form
      ref="loginForm"
      layout="vertical"
      :model="loginModel"
      @submit="handleSubmit"
    >
      <a-form-item
        field="username"
        hide-label
        :rules="[{ required: true, message: '用户名称不可为空' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input
          v-model="loginModel.username"
          allow-clear
          placeholder="请输入用户名称"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        hide-label
        :rules="[{ required: true, message: '登录密码不可为空' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input-password
          v-model="loginModel.password"
          allow-clear
          placeholder="请输入登录密码"
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item hide-label row-class="mb-4" content-class="justify-between">
        <a-checkbox
          checked="rememberPassword"
          :model-value="loginConfig.rememberPassword"
          @change="setRememberPassword as any"
        >
          记住密码
        </a-checkbox>
        <a-link>忘记密码</a-link>
      </a-form-item>
      <a-form-item hide-label>
        <a-button type="primary" long html-type="submit" :loading="loading">
          登录
        </a-button>
        <!-- <a-button type="text" long>
          注册账号
        </a-button> -->
      </a-form-item>
    </a-form>
  </div>
</template>
