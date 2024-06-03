<template>
  <a-config-provider :locale="locale" global update-at-scroll>
    <router-view />
    <GlobalSetting />
    <MessageBox />
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
  import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
  import { useI18n } from 'vue-i18n';
  import { provideMessage } from '@/components/message-box/hooks';
  import GlobalSetting from '@/components/global-setting/index.vue';
  import MessageBox from '@/components/message-box/index.vue';

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

  provideMessage();
</script>
