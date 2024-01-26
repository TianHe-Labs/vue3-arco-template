import { defineStore } from 'pinia';
import {
  login as userLogin,
  LoginData,
  refreshToken,
  getUserInfo,
} from '@/api/user';
import {
  setToken,
  clearToken,
  ACS_TOKEN_KEY,
  RSH_TOKEN_KEY,
} from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: undefined,
    username: undefined,
    nickname: undefined,
    role: undefined,

    email: undefined,
    phone: '17800000000',

    avatar:
      '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
    sector: '网络部',
    job: '网络管理员',
    location: 'A#302',
    certification: '张菲岩',
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    async getUserInfo() {
      const { data: respData } = await getUserInfo();
      this.setInfo(respData);
    },
    async login(loginData: LoginData) {
      try {
        const { data: respData } = await userLogin(loginData);
        setToken(respData.access_token, ACS_TOKEN_KEY);
        setToken(respData.refresh_token, RSH_TOKEN_KEY);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    async logout() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    async refreshToken() {
      try {
        const { data: respData } = await refreshToken();
        setToken(respData?.access_token, ACS_TOKEN_KEY);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
  },
});

export default useUserStore;
