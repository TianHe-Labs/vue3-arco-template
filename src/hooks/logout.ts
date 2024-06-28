import router from '@/router';
import { useUserStore, useAppStore } from '@/store';
import { removeRouteListener } from '@/plugins/route-listener';

export default function useLogout() {
  const userStore = useUserStore();
  const appStore = useAppStore();

  return {
    logout(logoutTo?: string) {
      userStore.logout();
      removeRouteListener();
      appStore.clearAppServerMenus();
      const currentRoute = router.currentRoute.value;
      router.push({
        name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'Login',
        query: {
          redirect: currentRoute.path as string,
          // redirect: currentRoute.name as string,
          // ...currentRoute.params,
          ...currentRoute.query,
        },
      });
    },
  };
}
