<template>
  <a-card :bordered="false" class="w-full rounded">
    <a-typography-text bold class="text-2xl">
      {{ userStore.username }}
    </a-typography-text>

    <p>{{ breakpoints }}</p>

    unocss/iconify 图标的使用
    <div class="i-solar:box-bold-duotone w-5em h-5em"></div>
  </a-card>
</template>

<script lang="ts" setup>
  import { inject } from 'vue';
  import { useUserStore } from '@/store';

  const breakpoints = inject('breakpoints');

  const userStore = useUserStore();
</script>
