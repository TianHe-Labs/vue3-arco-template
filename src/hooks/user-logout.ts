import router from '@/router';
import { useUserStore, useAppStore } from '@/store';
import { removeRouteListener } from '@/plugins/route-listener';

export default function useUserLogout() {
  const userStore = useUserStore();
  const appStore = useAppStore();

  const logout = (logoutTo?: string) => {
    userStore.logout();
    removeRouteListener();
    appStore.clearServerMenu();
    const currentRoute = router.currentRoute.value;
    router.push({
      name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'Login',
      query: {
        ...router.currentRoute.value.query,
        redirect: currentRoute.name as string,
      },
    });
  };

  return {
    logout,
  };
}
