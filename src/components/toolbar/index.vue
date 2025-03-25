<template>
  <div v-if="mode === 'horizontal'" class="flex gap-5 items-center toolbar">
    <!-- 搜索 -->
    <!-- <a-tooltip mini :content="t('toolbar.search')">
        <a-button class="nav-btn"  shape="circle">
          <template #icon>
            <icon-search />
          </template>
        </a-button>
      </a-tooltip> -->
    <!-- 语言 -->
    <!-- <a-dropdown trigger="click" @select="toggleLocale as any">
      <a-tooltip mini :content="t('toolbar.language.toggle')">
        <a-button class="nav-btn"  shape="circle">
          <template #icon>
            <icon-language />
          </template>
        </a-button>
      </a-tooltip>
      <template #content>
        <a-doption
          v-for="item in locales"
          :key="item.value"
          :value="item.value"
        >
          <template #icon>
            <icon-check v-show="item.value === locale" />
          </template>
          {{ item.label }}
        </a-doption>
      </template>
    </a-dropdown> -->
    <!-- 主题 -->
    <a-tooltip
      mini
      :content="
        theme === 'light'
          ? t('toolbar.theme.toDark.tooltip')
          : t('toolbar.theme.toLight.message')
      "
    >
      <a-button class="nav-btn" shape="circle" @click="handleToggleTheme">
        <template #icon>
          <icon-moon-fill v-if="theme === 'dark'" />
          <icon-sun-fill v-else />
        </template>
      </a-button>
    </a-tooltip>
    <!-- 反馈 -->
    <!-- <a-tooltip mini :content="t('toolbar.feedback')">
      <a-button
        class="nav-btn"

        shape="circle"
        @click.stop="feedbackPanelVisible = !feedbackPanelVisible"
      >
        <icon-customer-service />
      </a-button>
    </a-tooltip> -->
    <!-- 消息 -->
    <!-- <a-tooltip mini :content="t('toolbar.message')">
      <a-badge :count="renderStats?.total || 0" dot>
        <a-button
          class="nav-btn"

          shape="circle"
          @click.stop="setPopoverVisible"
        >
          <icon-notification />
        </a-button>
      </a-badge>
    </a-tooltip> -->
    <!-- 全屏 -->
    <a-tooltip
      mini
      :content="
        isFullscreen ? t('toolbar.screen.toExit') : t('toolbar.screen.toFull')
      "
    >
      <a-button class="nav-btn" shape="circle" @click="toggleFullScreen">
        <template #icon>
          <icon-fullscreen-exit v-if="isFullscreen" />
          <icon-fullscreen v-else />
        </template>
      </a-button>
    </a-tooltip>
    <!-- 设置 -->
    <a-tooltip mini :content="t('settings.title')">
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

    <!-- <a-divider direction="vertical" :margin="4" /> -->
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
            background: 'rgba(var(--primary-5))',
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
              '-mt-1 font-medium text-text-1',
              { 'text-xl': !userStore?.status },
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
            {{ $t(`profile.role.${userStore.role}`) }}
          </a-typography-text>
        </div>
        <a-divider :margin="8" />
        <a-doption>
          <a-space @click="router.push({ name: 'User' })">
            <icon-user />
            <span>
              {{ t('menu.user') }}
            </span>
          </a-space>
        </a-doption>
        <a-doption>
          <a-space @click="handleLogout">
            <icon-export />
            <span>
              {{ t('toolbar.logout') }}
            </span>
          </a-space>
        </a-doption>
      </template>
    </a-dropdown>
  </div>
  <template v-else>
    <div class="flex flex-col gap-4 toolbar">
      <!-- 搜索 -->
      <a-input
        class="rounded-2xl"
        size="small"
        :placeholder="t('toolbar.search')"
      />
      <!-- 用户中心 -->
      <a-button
        long
        size="small"
        shape="round"
        class="justify-start"
        @click="
          () => {
            router.push({ name: 'User' });
            toggleDrawerMenu();
          }
        "
      >
        <template #icon>
          <icon-user />
        </template>
        {{ t('menu.user') }}
      </a-button>
      <!-- 语言 -->
      <!-- <a-button
        long
        size="small"
        shape="round"
        class="justify-start"
        @click="toggleLocale()"
      >
        <template #icon>
          <icon-language />
        </template>
        {{ t('toolbar.language.toggle') }}
      </a-button> -->
      <div class="grid grid-cols-2 gap-3">
        <!-- 主题 -->
        <a-button
          size="small"
          shape="round"
          class="justify-start"
          @click="handleToggleTheme"
        >
          <template #icon>
            <icon-moon-fill v-if="theme === 'dark'" />
            <icon-sun-fill v-else />
          </template>
          {{
            theme === 'light'
              ? t('toolbar.theme.toDark')
              : t('toolbar.theme.toLight')
          }}
        </a-button>
        <!-- 退出登录 -->
        <a-button size="small" shape="round" @click="handleLogout">
          <template #icon>
            <icon-export />
          </template>
          {{ t('toolbar.logout') }}
        </a-button>
      </div>
      <!-- 用户 -->
      <div class="flex">
        <div> </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
  import { computed, inject } from 'vue';
  // import { Message } from '@arco-design/web-vue';
  import { useDark, useToggle, useFullscreen } from '@vueuse/core';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  // import { LOCALE_OPTIONS } from '@/locale';
  import useLogout from '@/hooks/logout';
  import { useAppStore, useUserStore } from '@/store';
  import { isDevelopment } from '@/utils';
  // import { useMessage } from '../message-box/hooks';

  withDefaults(
    defineProps<{
      mode?: 'horizontal' | 'vertical';
    }>(),
    {
      mode: 'horizontal',
    }
  );

  const userStore = useUserStore();

  const appStore = useAppStore();

  const router = useRouter();
  // 语言
  const { t /* , locale */ } = useI18n();
  // const locales = [...LOCALE_OPTIONS];
  // const toggleLocale = (value?: string) => {
  //   const target =
  //     value ||
  //     locales[
  //       (locales.findIndex((item) => item.value === locale.value) + 1) %
  //         locales.length
  //     ].value;
  //   if (locale.value === target) {
  //     return;
  //   }
  //   locale.value = target;
  //   localStorage.setItem('arco-locale', target);
  //   Message.success(t('toolbar.language.toggle.message'));
  // };

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
  // const { setPopoverVisible, renderStats } = useMessage();

  // 全屏
  const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();

  // 设置
  const setVisible = () => {
    appStore.updateSettings({ globalSettingEnabled: true });
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
