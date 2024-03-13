import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';
import router from '@/router';

// api 返回结果不要进行多余的封装包裹
// 要么直接返回结果，要么返回错误信息
export interface Statement {
  code: number;
  message: string;
}

if (import.meta.env.VITE_API_BASE) {
  // 自定义环境变量，手动指定 API Base
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE;
} else {
  // vite 内置环境变量，子路径部署时用到
  axios.defaults.baseURL = import.meta.env.BASE_URL;
}

// add request interceptors(Authorization)
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);

// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<Statement>) => {
    const userStore = useUserStore();
    // 处理 token 过期以及 刷新 token 重发请求问题
    const status = error.response?.status;
    if (status === 401) {
      Message.error({
        content: error?.message || '身份验证不通过，请重新登录！',
        duration: 5 * 1000,
      });
      await userStore.logout();
      router.push({ name: 'Login' });
    } else if (status === 460) {
      // access token 过期
      // 保存本次未成功的请求，在拿到新的 access token 后重发
      const { url, method, data } = error.config as AxiosRequestConfig;
      // 获取新的 access token，重发请求
      await userStore.refreshToken();
      return axios.request({ url, method, data });
    } else if (status === 461) {
      Message.error({
        content: error?.message || '身份验证已过期，请重新登录！',
        duration: 5 * 1000,
      });
      await userStore.logout();
      router.push({ name: 'Login' });
    }
    /* else if (status === 404) {
      // 自动切换本地 mock
      error.config.url = error.config.url?.replace('api', 'mock');
      return axios.request(error.config);
    } */
    Message.error({
      content: error?.message || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
