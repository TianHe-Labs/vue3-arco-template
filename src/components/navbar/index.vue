<template>
  <div class="h-full flex justify-between px-4 navbar">
    <!-- 导航栏：左侧 -->
    <div class="flex gap-2 items-center left-side">
      <div class="flex gap-2 items-center">
        <!-- <img alt="logo" src="~@/assets/logo.svg?url" width="24" /> -->
        <a-typography-text
          bold
          type="primary"
          :style="{
            fontSize: '28px',
            fontFamily: 'YouSheBiaoTiHei',
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
    <div class="flex gap-4 items-center right-side">
      <Toolbar v-if="breakpoints.greater('md').value" />
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

  const breakpoints = inject('breakpoints') as any;

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
    // background-color: transparent;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
  }
</style>
