<template>
  <a-config-provider :locale="locale" global update-at-scroll>
    <router-view />
    <GlobalSetting />
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { computed, provide } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
  import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
  import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
  import GlobalSetting from '@/components/global-setting/index.vue';

  const i18n = useI18n();

  const locale = computed(() => {
    switch (i18n.locale.value) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return enUS;
    }
  });

  const breakpoints = useBreakpoints(breakpointsTailwind);
  provide('breakpoints', breakpoints);
</script>

<style>
  #app {
    height: 100%;
  }
</style>
