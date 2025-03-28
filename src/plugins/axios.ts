import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios';
import { Message } from '@arco-design/web-vue';
import i18n from '@/locale';
import { useUserStore } from '@/store';
import useLogout from '@/hooks/logout';

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
  }
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

    if (status === 401) {
      Message.error({
        content: message /* || error?.message */ || t('401'),
        duration: 5 * 1000,
      });
      logout();
    } else if (status === 460) {
      // Access Token 过期
      // 保存本次未成功的请求，在拿到新的 access token 后重发
      // 这里最好使用一个队列，保存为成功的请求
      const { url, method, data } = error.config as InternalAxiosRequestConfig;
      // 获取新的 access token，重发请求
      await userStore.updateUserToken();
      return axios.request({ url, method, data });
    } else if (status === 461) {
      // Refresh Token 过期
      Message.error({
        content: message /* || error?.message */ || t('461'),
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
      error.config.url = error.config.url?.replace('api', 'mock');
      return axios.request(error.config);
    } */
    return Promise.reject(new Error(message || t(status) || error.message));
  }
);
