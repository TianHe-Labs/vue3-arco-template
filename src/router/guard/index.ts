import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/plugins/route-listener';
import i18n from '@/locale';
import setupLoginInfoGuard from './login-info';
import setupPermissionGuard from './permission';

function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    // emit route change
    setRouteEmitter(to);
  });
  router.afterEach((to) => {
    // 设置网页tab标题
    // 登录系统前只显示“登录”，登录后根据实际显示
    if (to.name === 'Login') {
      document.title = '登录';
    } else {
      const { t } = i18n.global;
      if (to.meta.locale) {
        console.log(to.meta.locale);
        const pageName = t(to.meta.locale as string);
        const appName = import.meta.env.VITE_APP_NAME;
        document.title = `${pageName}丨${appName}`;
      } else {
        document.title = import.meta.env.VITE_APP_NAME;
      }
    }
  });
}

export default function createRouteGuard(router: Router) {
  setupPageGuard(router);
  setupLoginInfoGuard(router);
  setupPermissionGuard(router);
}
