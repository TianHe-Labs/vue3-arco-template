import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // 持久化

export default pinia;

export { useAppStore, useUserStore, useTabBarStore };
