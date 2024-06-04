<template>
  <!-- 如果没有导航栏，在右边放一个固定按钮入口 -->
  <div
    v-if="!appStore.navbar"
    class="fixed right-0 top-1/2"
    @click="setVisible"
  >
    <a-button type="primary">
      <template #icon>
        <icon-settings size="large" />
      </template>
    </a-button>
  </div>
  <a-drawer
    :visible="globalSettingPanelvisible"
    :width="300"
    :cancel-text="$t('settings.close')"
    :ok-text="$t('settings.copySettings')"
    @ok="copySettings"
    @cancel="cancel"
  >
    <template #title>{{ $t('settings.title') }}</template>
    <Block :options="contentOpts" :title="$t('settings.content')" />
    <Block :options="othersOpts" :title="$t('settings.other')" />
    <a-alert :show-icon="false">{{ $t('settings.alertContent') }}</a-alert>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { useClipboard } from '@vueuse/core';
  import { useAppStore } from '@/store';
  import Block from './block.vue';

  const { t } = useI18n();
  const { copy } = useClipboard();

  const appStore = useAppStore();
  const globalSettingPanelvisible = computed(
    () => appStore.globalSettingEnabled
  );

  const setVisible = () => {
    appStore.updateSettings({ globalSettingEnabled: true });
  };

  const contentOpts = computed(() => [
    {
      name: 'navbar',
      label: 'settings.navbar',
      defaultValue: appStore.navbar,
    },
    {
      name: 'menu',
      label: 'settings.menu',
      defaultValue: appStore.menu,
    },
    {
      name: 'topMenu',
      label: 'settings.topMenu',
      defaultValue: appStore.topMenu,
    },
    {
      name: 'menuFromServer',
      label: 'settings.menuFromServer',
      defaultValue: appStore.menuFromServer,
    },
    { name: 'tabBar', label: 'settings.tabBar', defaultValue: appStore.tabBar },
    { name: 'footer', label: 'settings.footer', defaultValue: appStore.footer },
    {
      name: 'menuWidth',
      label: 'settings.menuWidth',
      type: 'number',
      defaultValue: appStore.menuWidth,
    },
  ]);
  const othersOpts = computed(() => [
    {
      name: 'colorWeak',
      label: 'settings.colorWeak',
      defaultValue: appStore.colorWeak,
    },
  ]);

  const cancel = () => {
    appStore.updateSettings({ globalSettingEnabled: false });
  };

  const copySettings = async () => {
    const text = JSON.stringify(appStore.$state, null, 2);
    await copy(text);
    Message.success(t('settings.copySettings.message'));
  };
</script>
