import { defineStore } from 'pinia';
import {
  LoginReq,
  login as loginApi,
  queryUserInfo as queryUserInfoApi,
  updateUserToken as updateUserTokenApi,
} from '@/api/account';
import { camelCase, mapKeys } from 'lodash';
import { USERROLE, UserState } from './types.d';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: '',
    username: '',
    nickname: '',

    role: undefined,

    email: 'admin@example.cn',
    phone: '17000000000',
    sector: '网络部',
    status: '',

    accessToken: '',
    refreshToken: '',
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    // 更新
    setUserInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // 重置
    resetUserInfo() {
      this.$reset();
    },

    // 登录
    async login(loginData: LoginReq) {
      try {
        const { data } = await loginApi(loginData);
        const formatedData = mapKeys(data, (_: any, key: string) =>
          camelCase(key),
        );
        if (!formatedData?.accessToken || !formatedData?.refreshToken) {
          throw new Error();
        }
        this.setUserInfo({ username: loginData.username, ...formatedData });
      } catch (error) {
        this.resetUserInfo();
        throw error;
      }
    },

    // 信息

    // 有时候业务简单，单用户系统没有身份值等用户信息，甚至没有相关接口
    // 为了保证业务可用，本地增加一个或者使用本地模拟接口
    // 或者在路由守卫中不判断身份
    async queryUserInfo() {
      try {
        const { data } = await queryUserInfoApi();
        // 有时候前端的有些字段和后端接口不一致
        // 为了避免大面积修改变量，可以只在接口这里做一下映射处理
        const cleanedData = {
          username: data?.account,
          nickname: data?.name,
          role: USERROLE.ADMIN,
          ...data,
        };
        this.setUserInfo(cleanedData);
      } catch (err: any) {
        if (err?.isAxiosError) {
          // axios 拦截统一处理了返回结果
          // 如果该接口 404，则认为是单用户系统，没有用户信息
          this.setUserInfo({ role: USERROLE.ADMIN });
        } else {
          this.resetUserInfo();
          throw err;
        }
      }
    },

    // 登出
    async logout() {
      this.resetUserInfo();
    },

    // 更新令牌
    async updateUserToken() {
      if (!this.$state?.refreshToken) {
        this.resetUserInfo();
        return;
      }
      const params = { refreshToken: this.$state?.refreshToken };
      try {
        const { data } = await updateUserTokenApi(params);
        const formatedData = mapKeys(data, (_: any, key: string) =>
          camelCase(key),
        );
        if (!formatedData?.accessToken) {
          throw new Error();
        }
        this.setUserInfo(formatedData);
      } catch (error) {
        this.resetUserInfo();
        throw error;
      }
    },
  },
  // 自动持久化
  persist: {
    key: '__th_ls_usr__',
    pick: ['accessToken', 'refreshToken'],
  },
});

export default useUserStore;
