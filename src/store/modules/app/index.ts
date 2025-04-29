import { defineStore } from 'pinia';
import type { RouteRecordNormalized } from 'vue-router';
import { type NotificationReturn, Notification } from '@arco-design/web-vue';
import defaultSettings from '@/settings.json';
import { queryServerMenuList } from '@/api/account';
import { AppState } from './types.d';

const useAppStore = defineStore('app', {
  state: (): AppState => ({
    ...defaultSettings,
  }),

  getters: {
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
      } catch (err: any) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifyInstance = Notification.error({
          id: 'menuNotice',
          content: err?.message,
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
