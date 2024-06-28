import type { RouteRecordNormalized } from 'vue-router';

export interface AppState {
  globalSettingEnabled: boolean;
  theme: string;
  colorWeak: boolean;
  themeColor: string;
  navbar: boolean;
  menu: boolean;
  topMenu: boolean;
  hideMenu: boolean;
  menuWidth: number;
  menuCollapse: boolean;
  tabBar: boolean;
  menuFromServer: boolean;
  serverMenus: RouteRecordNormalized[];
  footer: boolean;
  [key: string]: unknown;
}
