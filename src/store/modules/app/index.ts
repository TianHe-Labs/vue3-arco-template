import { defineStore } from 'pinia';
import type { RouteRecordNormalized } from 'vue-router';
import { type NotificationReturn, Notification } from '@arco-design/web-vue';
import defaultSettings from '@/settings.json';
import { queryServerMenuList } from '@/api/user';
import { AppState } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => ({
    ...defaultSettings,
  }),

  getters: {
    appDevice(state: AppState) {
      return state.device;
    },
    appServerMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenus as unknown as RouteRecordNormalized[];
    },
  },

  actions: {
    // 更新
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // 重置
    resetSettings() {
      this.$reset();
    },

    // 主题
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },

    // 设备
    toggleDevice(device: string) {
      this.device = device;
    },

    // 菜单
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },

    // 服务端路由
    async queryAppServerMenus() {
      let notifyInstance: NotificationReturn | null = null;
      try {
        notifyInstance = Notification.info({
          id: 'menuNotice', // Keep the instance id the same
          content: 'loading',
          closable: true,
        });
        const { data } = await queryServerMenuList();
        this.serverMenus = data;
        notifyInstance = Notification.success({
          id: 'menuNotice',
          content: 'success',
          closable: true,
        });
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifyInstance = Notification.error({
          id: 'menuNotice',
          content: 'error',
          closable: true,
        });
      }
    },

    // 清空服务端路由
    clearAppServerMenus() {
      this.serverMenus = [];
    },
  },
});

export default useAppStore;
