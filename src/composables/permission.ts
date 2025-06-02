import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';
import { USERROLE } from '@/store/modules/user/types.d';

export default function usePermission() {
  const userStore = useUserStore();
  return {
    accessRoute(route: RouteLocationNormalized | RouteRecordRaw) {
      return (
        !route.meta?.requiresAuth ||
        !route.meta?.roles ||
        route.meta?.roles?.includes('*') ||
        route.meta?.roles?.includes(userStore.role as string)

        // 如果是roles
        // userStore?.roles?.some(
        //   (role: USERROLE) =>
        //     route.meta?.roles?.includes(role as string)
        // )
      );
    },
    findFirstAccessibleRoute(
      _routers: any,
      role = USERROLE.ADMIN,
      // roles: USERROLE[] = []
    ) {
      const clonedRouters = [..._routers];
      while (clonedRouters.length) {
        const firstElement = clonedRouters.shift();
        if (
          firstElement?.meta?.roles?.find((el: string[]) => {
            return el.includes('*') || el.includes(role);
          })
        )
          // 如果是 roles
          // roles.some((role) => el.includes(role)
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
