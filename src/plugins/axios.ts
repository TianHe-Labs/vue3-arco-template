import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios';
import { Message } from '@arco-design/web-vue';
import i18n from '@/locale';
import { useUserStore } from '@/store';
import useLogout from '@/composables/logout';
import { isNumber } from 'lodash';

// 请求队列管理器
class RequestQueue {
  private queue: Array<{
    config: InternalAxiosRequestConfig;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];
  private isRefreshing = false;

  add(config: InternalAxiosRequestConfig) {
    return new Promise((resolve, reject) => {
      this.queue.push({ config, resolve, reject });
    });
  }

  clear() {
    this.queue = [];
  }

  getQueue() {
    return this.queue;
  }

  setRefreshing(status: boolean) {
    this.isRefreshing = status;
  }

  getIsRefreshing() {
    return this.isRefreshing;
  }
}

const requestQueue = new RequestQueue();

if (import.meta.env.VITE_API_BASE) {
  // 自定义环境变量，手动指定 API Base
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE;
} else {
  // vite 内置环境变量，子路径部署时用到
  axios.defaults.baseURL = import.meta.env.BASE_URL;
}

// add request interceptors(Authorization)
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 设置 session-fp
    config.headers['session-fp'] = sessionStorage.getItem('__th_ss_fp__') || '';

    // 如果发起请求时已经传入，则不再处理
    // 例如 updateUserToken with refreshToken
    if (config.headers?.Authorization) {
      return config;
    }

    const userStore = useUserStore();
    const token = userStore.accessToken;
    if (token) {
      // if (!config.headers) {
      //   config.headers = {};
      // }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  },
);

// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // api 返回结果不要进行多余的封装包裹
    // 要么直接返回结果，要么返回错误信息

    // 不额外使用业务状态码，如果实在需要直接拓展 HTTP 状态码
    return response;
  },
  async (error: AxiosError<Record<string, any>>) => {
    // api 返回结果不要进行多余的封装包裹
    // 要么直接返回结果，要么返回错误信息
    const { t } = i18n.global;
    const userStore = useUserStore();
    const { logout } = useLogout();

    // 处理 token 过期以及 刷新 token 重发请求问题
    const status = error.response?.status as number;
    const respData = error.response?.data;
    // 错误消息可以用 message 或者 msg 字段 { message: '' } { msg: '' }
    const message = respData?.message || respData?.msg;

    if (!isNumber(status)) {
      return Promise.reject(error);
    }

    if (status === 401) {
      Message.error({
        content: message || t('401'),
        duration: 5 * 1000,
      });
      logout();
    } else if (status === 460) {
      // Access Token 过期
      const failedConfig = error.config as InternalAxiosRequestConfig;

      // 如果正在刷新 token，将请求加入队列
      if (requestQueue.getIsRefreshing()) {
        return requestQueue.add(failedConfig);
      }

      // 设置刷新状态
      requestQueue.setRefreshing(true);

      try {
        // 获取新的 access token
        await userStore.updateUserToken();

        // 重发队列中的所有请求
        const queue = requestQueue.getQueue();
        await Promise.all(
          queue.map(async ({ config, resolve, reject }) => {
            try {
              const response = await axios.request(config);
              resolve(response);
              return response;
            } catch (err) {
              reject(err);
              throw err;
            }
          }),
        );

        // 清空队列
        requestQueue.clear();
      } catch (err) {
        // 如果刷新 token 失败，清空队列并登出
        const queue = requestQueue.getQueue();
        queue.forEach(({ reject }) => {
          reject(err);
        });
        requestQueue.clear();
        Message.error({
          content: message || t('460'),
          duration: 5 * 1000,
        });
        logout();
        return Promise.reject(err);
      } finally {
        requestQueue.setRefreshing(false);
      }
    } else if (status === 461) {
      // Refresh Token 过期
      Message.error({
        content: message || t('461'),
        duration: 5 * 1000,
      });
      logout();
    } else if (status === 404 && error.config?.url?.includes('/user/info')) {
      // 有时候业务简单，单用户系统没有身份值等用户信息，甚至没有相关接口
      // 为了保证业务可用，本地增加一个或者使用本地模拟接口
      // 或者在路由守卫中不判断身份
      return Promise.reject(error);
    }
    /* else if (status === 404) {
      // 自动切换本地 mock
      const errorConfig = error.config as InternalAxiosRequestConfig;
      errorConfig.url = errorConfig.url?.replace('api', 'mock');
      return axios.request(errorConfig);
    } */
    return Promise.reject(new Error(message || t(status) || error.message));
  },
);
