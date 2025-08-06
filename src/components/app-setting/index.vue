<template>
  <!-- 如果没有导航栏，在右边放一个固定按钮入口 -->
  <div
    v-if="!appStore.navbar"
    class="fixed right-0 top-1/2"
    @click="handleOpenAppSettingPanel"
  >
    <a-button type="primary">
      <template #icon>
        <icon-settings size="large" />
      </template>
    </a-button>
  </div>
  <a-drawer
    :visible="appSettingPanelVisible"
    :width="300"
    cancel-text="关闭"
    ok-text="复制配置"
    @ok="handleCopy"
    @cancel="handleCancel"
  >
    <template #title>页面配置</template>
    <Block :options="contentOptions" title="内容区域" />
    <Block :options="themeOptions" title="主题设置" />
    <Block :options="moduleOptions" title="功能设置" />
    <a-alert :show-icon="false">
      配置之后仅是临时生效，要想真正作用于项目，点击下方的 "复制配置"
      按钮，将配置替换到 settings.json 中即可。
    </a-alert>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useClipboard } from '@vueuse/core';
  import { useAppStore } from '@/store';
  import Block from './components/block.vue';

  const { copy } = useClipboard();

  const appStore = useAppStore();
  const appSettingPanelVisible = computed(() => appStore.appSettingEnabled);

  const handleOpenAppSettingPanel = () => {
    appStore.updateSettings({ appSettingEnabled: true });
  };

  const contentOptions = computed(() => [
    {
      name: 'navbar',
      label: '导航栏',
      defaultValue: appStore.navbar,
    },
    {
      name: 'menu',
      label: '菜单栏',
      defaultValue: appStore.menu,
    },
    {
      name: 'topMenu',
      label: '顶部菜单栏',
      defaultValue: appStore.topMenu,
    },
    {
      name: 'menuFromServer',
      label: '后台获取菜单',
      defaultValue: appStore.menuFromServer,
    },
    { name: 'tabBar', label: '多页签', defaultValue: appStore.tabBar },
    { name: 'footer', label: '底部栏', defaultValue: appStore.footer },
    {
      name: 'menuWidth',
      label: '菜单宽度 (px)',
      type: 'number',
      defaultValue: appStore.menuWidth,
    },
  ]);
  const themeOptions = computed(() => [
    {
      name: 'colorWeak',
      label: '色弱模式',
      defaultValue: appStore.colorWeak,
    },
    // {
    //   name: 'themeStyle',
    //   label: '主题风格',
    //   type: 'radio',
    //   options: [
    //     { label: '默认', value: '#165DFF' },
    //     { label: '灰色', value: '#86909C' },
    //     { label: '绿色', value: '#00B42A' },
    //   ],
    //   defaultValue: appStore.themeStyle,
    // },
  ]);
  const moduleOptions = computed(() => [
    {
      name: 'feedbackEnabled',
      label: '问题反馈',
      defaultValue: appStore.feedbackEnabled,
    },
    {
      name: 'messageEnabled',
      label: '消息通知',
      defaultValue: appStore.messageEnabled,
    },
  ]);

  const handleCancel = () => {
    appStore.updateSettings({ appSettingEnabled: false });
  };

  const handleCopy = async () => {
    const text = JSON.stringify(appStore.$state, null, 2);
    await copy(text);
    Message.success('复制成功，请粘贴到 src/settings.json 文件中');
  };
</script>
