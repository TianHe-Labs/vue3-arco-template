<template>
  <div class="h-full flex justify-between px-4 navbar">
    <!-- 导航栏：左侧 -->
    <div class="flex gap-2 items-center left-side">
      <div class="flex gap-2 items-center">
        <!-- <img alt="logo" src="~@/assets/logo.svg?url" width="24" /> -->
        <a-typography-text
          bold
          :style="{
            fontSize: '28px',
            fontFamily: 'YouSheBiaoTiHei',
            color: 'rgba(var(--primary-7))',
          }"
        >
          {{ appName }}
        </a-typography-text>
      </div>
    </div>
    <!-- 导航栏：菜单 -->
    <div class="flex-1 center-side">
      <Menu
        v-if="topMenu && breakpoints.greater('md').value"
        mode="horizontal"
      />
    </div>
    <!-- 导航栏：右侧 -->
    <div class="flex items-center right-side">
      <Toolbar v-if="breakpoints.greater('md').value" />
      <a-button v-else shape="circle" class="nav-btn" @click="toggleTheme()">
        <template #icon>
          <icon-moon-fill v-if="theme === 'dark'" size="large" />
          <icon-sun-fill v-else size="large" />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, inject } from 'vue';
  import { useAppStore } from '@/store';
  import Menu from '@/components/menu/index.vue';
  import Toolbar from '@/components/toolbar/index.vue';

  const breakpoints = inject('breakpoints') as any;

  const appName = import.meta.env.VITE_APP_NAME || '';

  const appStore = useAppStore();

  // 主题
  const theme = computed(() => {
    return appStore.theme;
  });
  const isDark = useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
      appStore.toggleTheme(dark);
    },
  });
  const toggleTheme = useToggle(isDark);

  // 导航菜单
  const topMenu = computed(() => appStore.topMenu && appStore.menu);
</script>

<style lang="less" scoped>
  .navbar {
    // background-color: transparent;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
  }
</style>
