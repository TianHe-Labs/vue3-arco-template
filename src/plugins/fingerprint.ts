import { App } from 'vue';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// 设备指纹
// 可以充当 sessionId，保存在用户信息中，可以实现单设备登录

export default {
  async install(app: App) {
    // 初始化 FingerprintJS
    const fp = await FingerprintJS.load();

    // 获取设备指纹
    const result = await fp.get();
    const sessionFp = result.visitorId;

    // 存储在 sessionStorage 中
    sessionStorage.setItem('__th_ss_fp__', sessionFp);

    // 可以将设备指纹暴露给 Vue 应用
    app.config.globalProperties.$getSessionFp = () => {
      return sessionStorage.getItem('__th_ss_fp__');
    };
  },
};
