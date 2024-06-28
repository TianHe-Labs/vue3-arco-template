<template>
  <a-card :bordered="false" class="w-full rounded">
    <a-typography-text bold class="text-2xl">
      {{ userStore.username }}
    </a-typography-text>

    {{ breakpoints }}
  </a-card>
</template>

<script lang="ts" setup>
  import { inject } from 'vue';
  import { useUserStore } from '@/store';

  const breakpoints = inject('breakpoints');

  const userStore = useUserStore();
</script>
