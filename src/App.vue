<template>
  <a-config-provider :locale="locale" global update-at-scroll>
    <router-view />
    <GlobalSetting />
    <FeedbackPanel />
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { computed, ref, provide } from 'vue';
  import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
  import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
  import { useI18n } from 'vue-i18n';
  import GlobalSetting from '@/components/global-setting/index.vue';
  import FeedbackPanel from '@/components/feedback-panel/index.vue';

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

  // 反馈
  const feedbackPanelVisible = ref<boolean>(false);
  provide('feedbackPanelVisible', feedbackPanelVisible);
</script>

<style>
  #app {
    height: 100%;
  }
</style>
