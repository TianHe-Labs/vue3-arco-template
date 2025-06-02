import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import { useUserStore } from '@/store';
import { DEFAULT_ROUTE_NAME } from '@/router/constants';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (userStore.accessToken) {
      if (userStore.role) {
        // 如果是roles
        // userStore.roles && userStore.roles.length > 0
        if (to.name === 'Login') next({ name: DEFAULT_ROUTE_NAME });
        else next();
      } else {
        try {
          await userStore.queryUserInfo();
          next();
        } catch (error) {
          await userStore.logout();
          next({
            name: 'Login',
            query: {
              redirect: to.path,
              // redirect: to.name,
              // ...to.params,
              ...to.query,
            } as LocationQueryRaw,
          });
        }
      }
    } else {
      if (to.name === 'Login') {
        next();
      }
      next({
        name: 'Login',
        query: {
          redirect: to.path,
          // redirect: to.name,
          // ...to.params,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
