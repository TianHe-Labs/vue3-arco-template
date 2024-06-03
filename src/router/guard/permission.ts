import type { Router, RouteRecordNormalized } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import usePermission from '@/hooks/permission';
import { useUserStore, useAppStore } from '@/store';
import { appRoutes } from '../routes';
import { WHITE_LIST, NOT_FOUND } from '../constants';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const { accessRoute, findFirstAccessibleRoute } = usePermission();
    const isAccessibleRoute = accessRoute(to);
    if (appStore.menuFromServer) {
      // 针对来自服务端的菜单配置进行处理
      // 根据需要自行完善来源于服务端的菜单配置的permission逻辑
      if (
        !appStore.appServerMenus.length &&
        !WHITE_LIST.find((el) => el.name === to.name)
      ) {
        await appStore.queryAppServerMenus();
      }
      const appMenus = [...appStore.appServerMenus, ...WHITE_LIST];

      // 判断当前待跳转的路由是否存在（由后端完全控制的路由）
      let exist = false;
      while (appMenus.length && !exist) {
        const element = appMenus.shift();
        if (element?.name === to.name) exist = true;

        if (element?.children) {
          appMenus.push(
            ...(element.children as unknown as RouteRecordNormalized[])
          );
        }
      }
      if (exist && isAccessibleRoute) {
        next();
      } else {
        next(NOT_FOUND);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (isAccessibleRoute) {
        next();
      } else {
        const destination =
          findFirstAccessibleRoute(appRoutes, userStore.role) || NOT_FOUND;
        next(destination);
      }
    }
    NProgress.done();
  });
}
