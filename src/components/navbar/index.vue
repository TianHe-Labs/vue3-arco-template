<template>
  <div class="navbar">
    <!-- 导航栏：左侧 -->
    <div class="left-side">
      <div class="title-bar">
        <img alt="logo" src="~@/assets/logo.svg?url" width="24" />
        <a-typography-title
          :style="{ margin: 0, fontSize: '18px' }"
          :heading="5"
        >
          {{ appName }}
        </a-typography-title>
      </div>
    </div>
    <!-- 导航栏：菜单 -->
    <div class="center-side">
      <Menu v-if="topMenu && appStore.device === 'desktop'" mode="horizontal" />
    </div>
    <!-- 导航栏：右侧 -->
    <div class="right-side">
      <Toolbar v-if="appStore.device === 'desktop'" />
      <a-button
        v-else
        type="text"
        size="small"
        style="color: var(--color-text-1)"
        @click="toggleDrawerMenu"
      >
        <template #icon>
          <icon-menu :size="22" />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, inject } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useAppStore } from '@/store';
  import Menu from '@/components/menu/index.vue';
  import Toolbar from '@/components/toolbar/index.vue';

  const { t } = useI18n();

  const appName = import.meta.env.VITE_APP_NAME || t('');

  const appStore = useAppStore();

  // 导航菜单
  const topMenu = computed(() => appStore.topMenu && appStore.menu);

  // 移动端抽屉菜单
  const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;
</script>

<style lang="less" scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    padding: 0 20px;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
  }

  .left-side,
  .title-bar {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .center-side {
    flex: 1;
  }

  .right-side {
    display: flex;
    gap: 20px;
    align-items: center;
  }
</style>
