import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean; // 控制访问页面是否需要认证，不可缺省
    title?: string;
    icon?: string; // 页面路由图标
    roles?: string[]; // 控制页面访问权限
    hideInMenu?: boolean; // 是否在导航菜单中隐藏路由
    hideChildrenInMenu?: boolean; // 是否在导航菜单中隐藏子路由
    activeMenu?: string; // 页面活跃时高亮的路由，默认是页面自身的路由
    order?: number; // 在导航菜单中顺序
    noAffix?: boolean; // 页面标签前缀
    ignoreCache?: boolean; // 控制页面是否忽略缓存
  }
}
