<template>
  <div class="h-full flex flex-col justify-center items-center">
    <a-result status="404" :subtitle="t('notFound.title')"></a-result>
    <a-button key="back" type="primary" @click="back">
      {{ t('notFound.actions.back') }}
    </a-button>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { DEFAULT_ROUTE_NAME } from '@/router/constants';

  const { t } = useI18n();

  const router = useRouter();

  const back = () => {
    // warning： Go to the node that has the permission
    router.push({ name: DEFAULT_ROUTE_NAME });
  };
</script>
