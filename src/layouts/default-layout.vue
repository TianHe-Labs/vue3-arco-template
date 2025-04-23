<template>
  <a-scrollbar>
    <a-layout class="w-full h-full">
      <!-- 顶部 -->
      <a-layout-header v-if="navbar" class="layout-navbar">
        <NavBar />
      </a-layout-header>
      <!-- 主体 -->
      <a-layout class="!flex-row">
        <!-- 左侧：侧边导航 -->
        <a-layout-sider
          v-if="renderMenu"
          v-show="!hideMenu"
          class="layout-sider"
          breakpoint="xl"
          :collapsed="collapsed"
          :collapsible="true"
          :width="menuWidth"
          :style="{ paddingTop: navbar ? 'var(--nav-height)' : '' }"
          :hide-trigger="true"
          @collapse="setCollapsed"
        >
          <div class="h-full overflow-x-hidden overflow-y-auto">
            <Menu />
          </div>
        </a-layout-sider>
        <!-- 移动端渲染抽屉式菜单 -->
        <a-drawer
          v-if="hideMenu"
          :visible="drawerVisible"
          :closable="false"
          :header="false"
          :footer="false"
          height="60vh"
          placement="bottom"
          mask-closable
          @cancel="drawerCancel"
        >
          <Menu
            style="padding-bottom: calc(var(--toolbar-vertical-height) + 20px)"
          />
          <Toolbar
            mode="vertical"
            style="
              position: relative;
              margin-top: calc(-1 * var(--toolbar-vertical-height));
            "
          />
        </a-drawer>
        <!-- 右侧：内容 -->
        <a-layout class="layout-content" :style="paddingStyle">
          <TabBar v-if="appStore.tabBar" />
          <a-layout-content>
            <PageLayout />
          </a-layout-content>
          <Footer v-if="footer" />
        </a-layout>
      </a-layout>
    </a-layout>
  </a-scrollbar>

  <MobileEntry
    v-if="!appStore.navbar || breakpoints.smallerOrEqual('md').value"
  />

  <FeedbackPanel v-if="appStore.feedbackEnabled" />
</template>

<script lang="ts" setup>
  import { ref, computed, provide, onMounted, inject } from 'vue';
  import { useAppStore } from '@/store';
  import NavBar from '@/components/navbar/index.vue';
  import Menu from '@/components/menu/index.vue';
  import Toolbar from '@/components/toolbar/index.vue';
  import Footer from '@/components/footer/index.vue';
  import TabBar from '@/components/tab-bar/index.vue';
  import { provideFeedback } from '@/components/feedback-panel/composables/feedback';
  import { provideMessage } from '@/views/message/composables/message';
  import PageLayout from './page-layout.vue';
  import MobileEntry from '@/components/mobile-entry/index.vue';
  import FeedbackPanel from '@/components/feedback-panel/index.vue';
  // 消息
  provideMessage();

  // 反馈
  provideFeedback();

  // 响应式
  const breakpoints = inject('breakpoints') as any;

  const isInit = ref(false);
  const appStore = useAppStore();

  const navbar = computed(() => appStore.navbar);

  const renderMenu = computed(() => appStore.menu && !appStore.topMenu);
  const hideMenu = computed(
    () => appStore.hideMenu || breakpoints.smallerOrEqual('md').value,
  );
  const footer = computed(() => appStore.footer);
  const menuWidth = computed(() => {
    return appStore.menuCollapse ? 48 : appStore.menuWidth;
  });
  const collapsed = computed(() => {
    return appStore.menuCollapse;
  });
  const paddingStyle = computed(() => {
    const paddingLeft =
      renderMenu.value && !hideMenu.value
        ? { paddingLeft: `${menuWidth.value}px` }
        : {};
    const paddingTop = navbar.value ? { paddingTop: 'var(--nav-height)' } : {};
    return { ...paddingLeft, ...paddingTop };
  });
  const setCollapsed = (val: boolean) => {
    if (!isInit.value) return; // for page initialization menu state problem
    appStore.updateSettings({ menuCollapse: val });
  };

  const drawerVisible = ref(false);
  const drawerCancel = () => {
    drawerVisible.value = false;
  };
  provide('toggleDrawerMenu', (opts?: any) => {
    if (opts?.isMenuClick) {
      // 如果是抽屉侧边菜单点击，需要关闭
      drawerVisible.value = false;
    } else {
      drawerVisible.value = !drawerVisible.value;
    }
  });
  onMounted(() => {
    isInit.value = true;
  });
</script>

<style>
  :root {
    --nav-height: 64px;
    --toolbar-vertical-height: 84px;
  }
</style>

<style lang="less" scoped>
  .layout-navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: var(--nav-height);
  }

  .layout-sider {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    height: 100%;
    transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    // background-color: transparent !important;
    &::after {
      position: absolute;
      top: 0;
      right: -1px;
      display: block;
      width: 1px;
      height: 100%;
      background-color: var(--color-border);
      content: '';
    }

    & > .arco-layout-sider-children {
      overflow-y: hidden;
    }
  }

  :deep(.arco-menu) {
    ::-webkit-scrollbar {
      width: 12px;
      height: 4px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: var(--color-text-4);
      background-clip: padding-box;
      border: 4px solid transparent;
      border-radius: 7px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: var(--color-text-3);
    }
  }

  .layout-content {
    min-height: 100vh;
    overflow-y: hidden;
    background-color: var(--color-fill-2);
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  }
</style>
