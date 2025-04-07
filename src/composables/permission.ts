import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';
import { USERROLE } from '@/store/modules/user/types';

export default function usePermission() {
  const userStore = useUserStore();
  return {
    accessRoute(route: RouteLocationNormalized | RouteRecordRaw) {
      return (
        !route.meta?.requiresAuth ||
        !route.meta?.roles ||
        route.meta?.roles?.includes('*') ||
        route.meta?.roles?.includes(userStore.role as string)
      );
    },
    findFirstAccessibleRoute(_routers: any, role = USERROLE.ADMIN) {
      const clonedRouters = [..._routers];
      while (clonedRouters.length) {
        const firstElement = clonedRouters.shift();
        if (
          firstElement?.meta?.roles?.find((el: string[]) => {
            return el.includes('*') || el.includes(role);
          })
        )
          return { name: firstElement.name };
        if (firstElement?.children) {
          clonedRouters.push(...firstElement.children);
        }
      }
      return null;
    },
    // You can add any rules you want
  };
}
