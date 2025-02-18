<template>
  <a-config-provider :locale="zhCN" global update-at-scroll>
    <router-view />
    <GlobalSetting />
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { provide } from 'vue';
  import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
  import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
  import GlobalSetting from '@/components/global-setting/index.vue';

  const breakpoints = useBreakpoints(breakpointsTailwind);
  provide('breakpoints', breakpoints);
</script>

<style>
  #app {
    height: 100%;
  }
</style>
