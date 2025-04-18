<script lang="tsx">
  import { defineComponent, ref, h, compile, computed, inject } from 'vue';
  import {
    type RouteRecordRaw,
    type RouteMeta,
    useRoute,
    useRouter,
  } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { useAppStore } from '@/store';
  import { listenerRouteChange } from '@/plugins/route-listener';
  import { openWindow, regexUrl } from '@/utils';
  import useMenuTree from './use-menu-tree';

  export default defineComponent({
    props: {
      mode: {
        type: String,
        default: 'vertical',
      },
    },
    emit: ['collapse'],
    setup(props) {
      const router = useRouter();
      const route = useRoute();

      const { t } = useI18n();

      const appStore = useAppStore();
      const { menuTree } = useMenuTree();

      // 移动端抽屉菜单
      const toggleDrawerMenu = inject('toggleDrawerMenu') as (
        opts?: any,
      ) => void;

      const breakpoints = inject('breakpoints') as any;

      const collapsed = computed({
        get() {
          if (breakpoints.greater('md').value) return appStore.menuCollapse;
          return false;
        },
        set(value: boolean) {
          appStore.updateSettings({ menuCollapse: value });
        },
      });
      const setCollapse = (val: boolean) => {
        if (breakpoints.greater('md').value)
          appStore.updateSettings({ menuCollapse: val });
      };

      const openKeys = ref<string[]>([]);
      const selectedKey = ref<string[]>([]);

      const goto = (item: RouteRecordRaw) => {
        // Open external link
        if (regexUrl.test(item.path)) {
          openWindow(item.path);
          selectedKey.value = [item.name as string];
          return;
        }
        // Eliminate external link side effects
        const { hideInMenu, activeMenu } = item.meta as RouteMeta;
        if (route.name === item.name && !hideInMenu && !activeMenu) {
          selectedKey.value = [item.name as string];
          return;
        }
        // Trigger router change
        router.push({
          name: item.name,
        });
      };

      const findMenuOpenKeys = (target: string) => {
        const result: string[] = [];
        let isFind = false;
        const backtrack = (item: RouteRecordRaw, keys: string[]) => {
          if (item.name === target) {
            isFind = true;
            result.push(...keys);
            return;
          }
          if (item.children?.length) {
            item.children.forEach((el) => {
              backtrack(el, [...keys, el.name as string]);
            });
          }
        };
        menuTree.value.forEach((el: RouteRecordRaw) => {
          if (isFind) return; // Performance optimization
          backtrack(el, [el.name as string]);
        });
        return result;
      };

      listenerRouteChange((newRoute) => {
        const { requiresAuth, activeMenu, hideInMenu } = newRoute.meta;
        if (requiresAuth && (!hideInMenu || activeMenu)) {
          const menuOpenKeys = findMenuOpenKeys(
            (activeMenu || newRoute.name) as string,
          );

          const keySet = new Set([...menuOpenKeys, ...openKeys.value]);
          openKeys.value = [...keySet];

          selectedKey.value = [
            activeMenu || menuOpenKeys[menuOpenKeys.length - 1],
          ];
        }
      }, true);

      const renderSubMenu = () => {
        function travel(_route: RouteRecordRaw[], nodes = []) {
          if (_route) {
            _route.forEach((element) => {
              // This is demo, modify nodes as needed
              const icon = element?.meta?.icon
                ? () => h(compile(`<${element?.meta?.icon}/>`))
                : null;
              const node =
                element?.children && element?.children.length !== 0 ? (
                  <a-sub-menu
                    key={element?.name}
                    v-slots={{
                      icon,
                      title: () => h(compile(t(element.meta?.locale || ''))),
                    }}
                  >
                    {travel(element?.children)}
                  </a-sub-menu>
                ) : (
                  <a-menu-item
                    key={element?.name}
                    v-slots={{ icon }}
                    onClick={() => {
                      goto(element);
                      toggleDrawerMenu({ isMenuClick: true });
                    }}
                  >
                    {t(element?.meta?.locale || '')}
                  </a-menu-item>
                );
              nodes.push(node as never);
            });
          }
          return nodes;
        }
        return travel(menuTree.value);
      };

      return () => (
        <a-menu
          v-model:collapsed={collapsed.value}
          v-model:open-keys={openKeys.value}
          mode={props.mode}
          auto-scroll-into-view={true}
          show-collapse-button={breakpoints.greater('md').value}
          auto-open={false}
          selected-keys={selectedKey.value}
          auto-open-selected={true}
          level-indent={34}
          style="height:100%;width:100%;"
          onCollapse={setCollapse}
        >
          {renderSubMenu()}
        </a-menu>
      );
    },
  });
</script>
