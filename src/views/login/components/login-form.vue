<template>
  <div class="login-form">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-subtitle">{{ appName }}</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      layout="vertical"
      :model="loginData"
      class="login-form"
      @submit="handleSubmit"
    >
      <a-form-item
        field="username"
        :rules="[{ required: true, message: $t('login.form.username.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="loginData.username"
          :placeholder="$t('login.form.username.placeholder')"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="loginData.password"
          :placeholder="$t('login.form.password.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword as any"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
          <a-link>{{ $t('login.form.forgetPassword') }}</a-link>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>
        <!-- <a-button type="text" long class="login-form-signup-btn">
          {{ $t('login.form.signup') }}
        </a-button> -->
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import type { LoginParams } from '@/api/user';
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { DEFAULT_ROUTE_NAME } from '@/router/constants';

  const { t } = useI18n();
  const router = useRouter();
  const { loading, setLoading } = useLoading();

  const userStore = useUserStore();

  const appName = import.meta.env.VITE_APP_NAME || t('');

  const loginConfig = useStorage('login-config', {
    username: '',
    password: '',
    rememberPassword: true,
  });

  const loginData = reactive({
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
          name: (redirect as string) || DEFAULT_ROUTE_NAME,
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
        const { rememberPassword } = loginConfig.value;
        const { username, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.username = rememberPassword ? username : '';
        loginConfig.value.password = rememberPassword ? password : '';
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };
</script>

<style lang="less" scoped>
  .login-form {
    width: 320px;

    &-title {
      color: var(--color-text-2);
      font-weight: 500;
      font-size: 22px;
      line-height: 32px;
    }

    &-subtitle {
      color: var(--color-text-3);
      font-size: 18px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-signup-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
