<template>
  <div v-if="mode === 'horizontal'" class="flex gap-5 items-center toolbar">
    <!-- 搜索 -->
    <!-- <a-tooltip mini content="搜索">
        <a-button class="nav-btn"  shape="circle">
          <template #icon>
            <icon-search />
          </template>
        </a-button>
      </a-tooltip> -->
    <!-- 主题 -->
    <a-tooltip mini :content="theme === 'light' ? '切换为暗色' : '切换为亮色'">
      <a-button class="nav-btn" shape="circle" @click="handleToggleTheme">
        <template #icon>
          <icon-moon-fill v-if="theme === 'dark'" />
          <icon-sun-fill v-else />
        </template>
      </a-button>
    </a-tooltip>
    <!-- 反馈 -->
    <!-- <a-tooltip mini content="问题反馈
      <a-button
        class="nav-btn"

        shape="circle"
        @click.stop="feedbackPanelVisible = !feedbackPanelVisible"
      >
        <icon-customer-service />
      </a-button>
    </a-tooltip> -->
    <!-- 消息 -->
    <a-tooltip mini content="消息通知">
      <a-badge :count="renderStats?.unread || 0" dot>
        <a-button
          class="nav-btn"
          shape="circle"
          @click="router.push({ name: 'Message' })"
        >
          <icon-notification />
        </a-button>
      </a-badge>
    </a-tooltip>
    <!-- 全屏 -->
    <a-tooltip mini :content="isFullscreen ? '退出全屏' : '切换全屏'">
      <a-button class="nav-btn" shape="circle" @click="toggleFullScreen">
        <template #icon>
          <icon-fullscreen-exit v-if="isFullscreen" />
          <icon-fullscreen v-else />
        </template>
      </a-button>
    </a-tooltip>
    <!-- 设置 -->
    <a-tooltip mini content="应用设置">
      <a-button
        v-if="isDevelopment"
        class="nav-btn"
        shape="circle"
        @click="setVisible"
      >
        <template #icon>
          <icon-settings />
        </template>
      </a-button>
    </a-tooltip>

    <!-- 用户 -->
    <a-dropdown trigger="click">
      <div
        class="flex gap-2 items-center pl-1.5 pr-3.5 py-1.5 rounded-3xl hover:bg-fill-1 transition transition-colors duration-150 ease-out cursor-pointer"
        flex="~ gap-2"
      >
        <a-avatar
          :size="32"
          :style="{
            border: '3px solid var(--color-border-2)',
            background:
              'linear-gradient(217deg, rgba(var(--primary-5)), rgba(255, 0, 0, 0) 72%), linear-gradient(127deg, rgba(var(--primary-4)), rgba(0, 255, 0, 0) 72%), linear-gradient(336deg, rgba(var(--primary-3)), rgba(0, 0, 255, 0) 72%)',
          }"
        >
          <img v-if="userStore?.avatar" alt="avatar" :src="userStore?.avatar" />
          <span v-else-if="userStore?.nickname" class="uppercase">{{
            userStore?.nickname?.substring(0, 1)
          }}</span>
          <icon-user v-else />
        </a-avatar>
        <div>
          <div
            :class="[
              '-mt-0.5 font-medium text-text-1',
              { 'text-lg': !userStore?.status },
            ]"
          >
            {{ userStore.nickname || userStore.username }}
          </div>
          <div v-if="userStore?.status" class="-ml-0.5 !text-10px text-text-2">
            <icon-bulb />
            {{ userStore.status }}
          </div>
        </div>
      </div>
      <template #content>
        <div class="flex flex-col px-3 pt-1 gap-y-2">
          <a-typography-text v-if="userStore?.role" class="!text-sm">
            <icon-idcard />
            {{ $t(`account.roles.${userStore.role}`) }}
          </a-typography-text>
        </div>
        <a-divider :margin="8" />
        <a-doption>
          <a-space @click="router.push({ name: 'Account' })">
            <icon-user />
            <span> 账号设置 </span>
          </a-space>
        </a-doption>
        <a-doption>
          <a-space @click="handleLogout">
            <icon-export />
            <span> 退出登录 </span>
          </a-space>
        </a-doption>
      </template>
    </a-dropdown>
  </div>
  <template v-else>
    <div class="flex flex-col gap-4 toolbar">
      <!-- 搜索 -->
      <a-input class="rounded-2xl" size="small" placeholder="搜索" />

      <!-- 主题 -->
      <a-button
        long
        size="small"
        shape="round"
        class="justify-start"
        @click="handleToggleTheme"
      >
        <template #icon>
          <icon-moon-fill v-if="theme === 'dark'" />
          <icon-sun-fill v-else />
        </template>
        {{ theme === 'light' ? '切换为暗色' : '切换为亮色' }}
      </a-button>

      <div class="grid grid-cols-2 gap-3">
        <!-- 账号设置 -->
        <a-button
          size="small"
          shape="round"
          class="justify-start"
          @click="
            () => {
              router.push({ name: 'Account' });
              toggleDrawerMenu();
            }
          "
        >
          <template #icon>
            <icon-user />
          </template>
          账号设置
        </a-button>
        <!-- 退出登录 -->
        <a-button size="small" shape="round" @click="handleLogout">
          <template #icon>
            <icon-export />
          </template>
          退出登录
        </a-button>
      </div>
    </div>

    <!-- 移动端fixed固定在屏幕右下角 -->
    <a-badge
      v-if="breakpoints.smallerOrEqual('md').value"
      :count="renderStats?.total || 0"
      dot
      class="fixed right-5 bottom-20"
    >
      <a-button
        class="fixed-btn"
        size="large"
        shape="circle"
        @click="router.push({ name: 'Message' })"
      >
        <icon-notification />
      </a-button>
    </a-badge>
  </template>
</template>

<script lang="ts" setup>
  import { computed, inject } from 'vue';
  import { useDark, useToggle, useFullscreen } from '@vueuse/core';
  import { useRouter } from 'vue-router';
  import useLogout from '@/composables/logout';
  import { useAppStore, useUserStore } from '@/store';
  import { isDevelopment } from '@/utils';
  import { useMessage } from '@/views/message/composables/message';

  withDefaults(
    defineProps<{
      mode?: 'horizontal' | 'vertical';
    }>(),
    {
      mode: 'horizontal',
    },
  );

  // 响应式
  const breakpoints = inject('breakpoints') as any;

  const userStore = useUserStore();

  const appStore = useAppStore();

  const router = useRouter();

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
  const handleToggleTheme = () => {
    toggleTheme();
  };

  // 反馈
  // const feedbackPanelVisible = inject('feedbackPanelVisible') as boolean;

  // 消息
  const { renderStats } = useMessage();

  // 全屏
  const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();

  // 设置
  const setVisible = () => {
    appStore.updateSettings({ appSettingEnabled: true });
  };

  // 用户
  // 退出登录
  const { logout } = useLogout();
  const handleLogout = () => {
    logout();
  };

  // 移动端抽屉菜单
  const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;
</script>

<style lang="less" scoped>
  .toolbar {
    .nav-btn {
      color: rgb(var(--gray-8));
      font-size: 16px;
      background-color: transparent;

      &:hover {
        background-color: rgb(var(--gray-2));
      }
    }
  }
</style>
