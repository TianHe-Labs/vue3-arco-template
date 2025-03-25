<template>
  <div class="h-full flex flex-col justify-center items-center">
    <a-result status="404" subtitle="404 页面未找到"></a-result>
    <a-button key="back" type="primary" @click="handleBack"> 返回 </a-button>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { DEFAULT_ROUTE_NAME } from '@/router/constants';

  const router = useRouter();

  const handleBack = () => {
    router.push({ name: DEFAULT_ROUTE_NAME });
  };
</script>
