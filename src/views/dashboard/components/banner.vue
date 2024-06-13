<template>
  <a-card :bordered="false" class="w-full rounded">
    <a-typography-text bold class="text-2xl">
      {{ userStore.username }}
    </a-typography-text>
  </a-card>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store';

  const userStore = useUserStore();
</script>
