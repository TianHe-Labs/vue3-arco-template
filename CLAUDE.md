# Vue3 ArcoDesign 模板项目 - AI 辅助编程上下文

## 项目概述

这是一个基于 Vue 3 + TypeScript + ArcoDesign + UnoCSS 的现代化前端模板项目，采用组合式 API 和 Pinia 状态管理，支持响应式设计和主题切换。

## 技术栈

### 核心框架

- **Vue 3.5.11**: 使用组合式 API (Composition API)
- **TypeScript 5.5.4**: 类型安全
- **Vite 5.2.13**: 构建工具
- **Vue Router 4.5.0**: 路由管理
- **Pinia 2.3.1**: 状态管理 (替代 Vuex)

### UI 框架

- **ArcoDesign Vue 2.57.0**: 企业级 UI 组件库
- **UnoCSS 0.58.9**: 原子化 CSS 框架
- **Iconify**: 图标库集成

### 开发工具

- **ESLint + Prettier**: 代码规范
- **Stylelint**: 样式规范
- **Husky + lint-staged**: Git 钩子
- **commitlint**: 提交信息规范

### 其他依赖

- **Axios 1.8.4**: HTTP 客户端
- **Day.js 1.11.13**: 日期处理
- **ECharts 5.6.0**: 图表库
- **VueUse 12.8.2**: Vue 组合式工具集
- **Mock.js**: 模拟数据

## 项目结构

```
vue3-arco-template/
├── config/                    # Vite 配置
│   ├── plugin/               # 自定义插件
│   ├── vite.config.base.mts  # 基础配置
│   ├── vite.config.dev.mts   # 开发环境配置
│   └── vite.config.prod.mts  # 生产环境配置
├── src/
│   ├── api/                  # API 接口
│   ├── assets/               # 静态资源
│   │   ├── style/           # 样式文件
│   │   └── images/          # 图片资源
│   ├── components/           # 公共组件
│   ├── composables/          # 组合式函数
│   ├── directives/           # 自定义指令
│   ├── layouts/              # 布局组件
│   ├── locale/               # 使用国际化来做字面量映射
│   ├── mock/                 # 模拟数据统一管理控制
│   ├── plugins/              # 插件
│   ├── router/               # 路由配置
│   ├── store/                # 状态管理
│   ├── utils/                # 工具函数
│   ├── views/                # 页面组件
│   ├── App.vue               # 根组件
│   ├── main.ts               # 入口文件
│   └── settings.json         # 应用配置
├── uno.config.ts             # UnoCSS 配置
└── package.json              # 项目配置
```

## 核心架构

### 1. 应用入口 (main.ts)

```typescript
// 主要初始化顺序
1. 创建 Vue 应用
2. 注册 ArcoDesign 组件库
3. 注册路由、状态管理、国际化
4. 注册全局组件和指令
5. 注册插件 (axios, browser-checker, fingerprint)
6. 挂载应用
```

### 2. 状态管理 (Pinia)

项目使用 Pinia 进行状态管理，主要包含以下 store：

#### App Store (`src/store/modules/app/index.ts`)

- 应用全局设置 (主题、菜单、导航栏等)
- 服务端菜单配置
- 主题切换逻辑

#### User Store (`src/store/modules/user/index.ts`)

- 用户信息管理
- 登录/登出逻辑
- Token 管理 (accessToken, refreshToken)
- 用户信息持久化

#### Tab Bar Store (`src/store/modules/tab-bar/index.ts`)

- 多标签页管理
- 页面缓存控制

### 3. 路由系统

#### 路由守卫 (`src/router/guard/`)

- **login-info.ts**: 登录状态检查
- **permission.ts**: 权限控制
- **index.ts**: 路由守卫统一管理

#### 权限控制逻辑

```typescript
// 权限检查流程
1. 检查路由是否需要认证 (requiresAuth)
2. 检查用户角色权限 (roles)
3. 支持服务端菜单配置 (menuFromServer)
4. 自动跳转到可访问的第一个路由
```

### 4. HTTP 请求 (Axios)

#### 请求拦截器

- 自动添加 Authorization 头
- 添加设备指纹 (session-fp)
- Token 刷新机制

#### 响应拦截器

- 统一错误处理
- Token 过期自动刷新
- 请求队列管理 (防止重复刷新)

### 5. 布局系统

#### 默认布局 (`src/layouts/default-layout.vue`)

- 响应式设计 (移动端适配)
- 可配置的导航栏、侧边栏、页脚
- 抽屉式移动端菜单
- 多标签页支持

## 开发规范与代码习惯

### 1. 命名规范

#### 文件命名规范

- **组件文件**: kebab-case (如 `create-update-panel.vue`, `user-profile.vue`)
- **页面文件**: kebab-case (如 `login-log.vue`, `basic-info.vue`)
- **工具函数**: camelCase (如 `formatDate.ts`, `useMenuTree.ts`)
- **API接口文件**: camelCase (如 `account.ts`, `user.ts`)
- **类型定义文件**: camelCase + `.d.ts` 后缀 (如 `types.d.ts`)
- **常量文件**: camelCase (如 `constants.ts`)
- **枚举文件**: camelCase (如 `enum.ts`)

#### 变量命名规范

- **变量/函数**: camelCase (如 `userStore`, `handleSubmit`, `fetchData`)
- **常量**: UPPER_SNAKE_CASE (如 `API_ENDPOINTS`, `USERROLE`)
- **接口/类型**: PascalCase + 描述性后缀 (如 `UserModel`, `LoginReq`, `QueryUserListRes`)
- **枚举**: UPPER_SNAKE_CASE (如 `USERROLE.ADMIN`, `LOGINRESULT.SUCCESS`)
- **组合式函数**: `use` + PascalCase (如 `useSearchXxxx`, `useCreateUpdateXxxx`)
- **提供函数**: `provide` + PascalCase (如 `provideSearchXxxx`)
- **Symbol**: 描述性名称 (如 `Symbol('SEARCH-XXXX')`)

#### 组件命名规范

- **组件名**: PascalCase (如 `UserProfile`, `CreateUpdatePanel`)
- **Props**: camelCase (如 `showOperations`, `queryModel`)
- **Events**: camelCase (如 `@update`, `@delete`)
- **Slots**: kebab-case (如 `#header`, `#footer`)

### 2. 代码组织结构

#### 组件代码结构

```vue
<template>
  <!-- 模板内容 -->
</template>

<script lang="ts" setup>
  // 1. 导入依赖
  import { ref, computed, watch } from 'vue';
  import { useUserStore } from '@/store';

  // 2. 类型定义
  interface Props {
    title?: string;
    showOperations?: boolean;
  }

  // 3. Props 和 Emits 定义
  const props = withDefaults(defineProps<Props>(), {
    showOperations: true,
  });

  // 4. 状态管理
  const userStore = useUserStore();

  // 5. 响应式数据
  import useLoading from '@/composables/loading'
  const { loading, setLoading } = useLoading(false);

  // 6. 计算属性
  const doubleCount = computed(() => count.value * 2);

  // 7. 事件处理函数
  const handleSubmit = () => {
    // 处理逻辑
  };
</script>
```

#### 组合式函数结构

```typescript
// 1. 导入依赖
import { ref, provide, inject, reactive } from 'vue';

// 2. 类型定义
interface SearchState {
  loading: Ref<boolean>;
  queryModel: Ref<QueryModel>;
  fetchData: () => Promise<void>;
}

// 3. 常量定义
const symbol = Symbol('SEARCH-XXXX');
const fuzzyKeys = ['name', 'description'];

// 4. 重置函数及初始化变量
const resetQueryModel = (): QueryModel => ({
  id: undefined,
  name: undefined,
});

// 5. 提供函数 vue3 provide/inject 依赖注入
export function provideSearchXxxx(): SearchState {
  // 实现逻辑
  provide(symbol, returnState);
  return returnState;
}

// 6. 使用函数
export function useSearchXxxx(): SearchState {
  return inject(symbol) as SearchState;
}
```

### 3. API 接口规范

#### 接口命名规范

```typescript
// 请求类型: [操作] + [实体] + Req
export type LoginReq = Pick<UserModel, 'username' | 'password'>;
export type QueryUserListReq = Partial<Pick<UserModel, 'id' | 'username'>>;
export type CreateUserReq = List<CreateUpdateUserModel>;
export type UpdateUserReq = CreateUpdateUserModel;
export type DeleteUserReq = { ids: UserModel['id'][] };

// 响应类型: [操作] + [实体] + Res
export type LoginRes = UserTokenModel;
export type QueryUserListRes = List<UserModel>;
export type CreateUserRes = List<Partial<UserModel>>;
export type UpdateUserRes = Partial<UserModel>;
export type DeleteUserRes = { ids: UserModel['id'][] };

// 函数命名: [操作] + [实体]
export function login(data: LoginReq) {
  /* ... */
}
export function queryUserList(params: QueryUserListReq & Pagination) {
  /* ... */
}
export function createUser(data: CreateUserReq) {
  /* ... */
}
export function updateUser(data: UpdateUserReq) {
  /* ... */
}
export function deleteUser(data: DeleteUserReq) {
  /* ... */
}
```

#### 接口设计模式

```typescript
// 1. 使用 TypeScript 工具类型
export type LoginReq = Pick<UserModel, 'username' | 'password'>;
export type QueryUserInfoRes = Omit<UserModel, 'password' | 'accessToken'>;

// 2. 分页参数处理
export function queryUserList(params: QueryUserListReq & Pagination) {
  const { current, pageSize, ...data } = params;
  return axios.post<QueryUserListRes>('/api/user/search', data, {
    params: { current, pageSize },
    paramsSerializer: (obj: Record<string, any>) => qs.stringify(obj),
  });
}

// 3. 文件上传处理
export function updateUserAvatar(data: FormData, config?: AxiosRequestConfig) {
  return axios.patch<UpdateUserAvatarRes>(
    '/api/user/avatar/update',
    data,
    config,
  );
}

// 4. 导出功能
export function exportUserList(data: ExportUserListReq) {
  return axios.post('/api/user/export', data, {
    responseType: 'blob',
  });
}
```

### 4. 状态管理规范

#### Store 结构规范

```typescript
const useUserStore = defineStore('user', {
  // 1. 状态定义
  state: (): UserState => ({
    id: '',
    username: '',
    // ... 其他状态
  }),

  // 2. 计算属性
  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  // 3. 异步操作
  actions: {
    // 更新状态
    setUserInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // 重置状态
    resetUserInfo() {
      this.$reset();
    },

    // 异步操作
    async login(loginData: LoginReq) {
      try {
        const { data } = await loginApi(loginData);
        this.setUserInfo({ username: loginData.username, ...data });
      } catch (error) {
        this.resetUserInfo();
        throw error;
      }
    },
  },

  // 4. 持久化配置
  persist: {
    key: '__th_ls_usr__',
    pick: ['accessToken', 'refreshToken'],
  },
});
```

### 5. 路由配置规范

```typescript
// 路由定义 (src/router/routes/modules/)
export default {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    locale: 'menu.dashboard',
    requiresAuth: true,
    roles: ['admin'],
    order: 1, // 菜单排序
    icon: 'icon-dashboard',
    hideInMenu: false,
    hideChildrenInMenu: false,
  },
};
```

### 6. 样式开发规范

#### UnoCSS 使用规范

```vue
<template>
  <!-- 使用 UnoCSS 原子类，遵循 ArcoDesign 设计规范 -->
  <div class="flex items-center gap-2 p-4 bg-bg-1 border border-border-2">
    <a-button type="primary" class="!px-3">按钮</a-button>
  </div>
</template>
```

#### 样式类命名规范

- **布局**: `flex`, `grid`, `block`, `inline`
- **间距**: `p-4`, `m-2`, `gap-2`
- **颜色**: `bg-primary-6`, `text-text-1`, `border-border-2`
- **尺寸**: `w-full`, `h-screen`, `max-w-md`
- **响应式**: `lg:grid-cols-2`, `md:hidden`
- **状态**: `hover:bg-primary-7`, `active:scale-95`

### 7. 错误处理规范

```typescript
// 1. 统一错误处理
try {
  const { data } = await apiCall();
  // 处理成功逻辑
} catch (err: any) {
  Message.error(err?.message || '操作失败');
  // 错误恢复逻辑
}

// 2. 表单验证
const errors = await formRef.value?.validate();
if (errors && Object.keys(errors).length > 0) {
  return false;
}

// 3. 加载状态管理
const { loading, setLoading } = useLoading();
setLoading(true);
try {
  // 异步操作
} finally {
  setLoading(false);
}
```

### 8. 性能优化规范

```typescript
// 1. 使用 shallowRef 管理组件实例
const formRef = shallowRef<FormInstance>();

// 2. 使用 computed 缓存计算结果
const filteredData = computed(() => {
  return data.value.filter((item) => item.status === 'active');
});

// 3. 使用 watch 监听变化
watch(
  [queryModel, () => fuzzyQueryModel.value.fuzzyKeys],
  () => {
    fetchData();
  },
  { deep: true },
);

// 4. 使用 provide/inject 避免 prop drilling
provide(symbol, state);
const state = inject(symbol) as State;
```

### 9. 代码注释规范

```typescript
/**
 * 用户登录接口
 * @param data 登录请求数据
 * @returns Promise<LoginRes> 登录响应数据
 */
export function login(data: LoginReq) {
  return axios.post<LoginRes>('/api/user/login', data);
}

// 有时候前端的有些字段和后端接口不一致
// 为了避免大面积修改变量，可以只在接口这里做一下映射处理
const cleanedData = { ...data, account: data.username };
```

### 10. 使用国际化做部分共用内容或字面量的映射，确保页面信息统一

```typescript
// 1. 使用 t() 函数进行文本国际化
const { t } = useI18n();
const title = t('menu.dashboard');

// 2. 在模板中使用
<template>
  <a-typography-text>{{ t('menu.dashboard') }}</a-typography-text>
</template>

// 3. 在路由 meta 中定义
meta: {
  locale: 'menu.dashboard',
}
```

## 样式系统

### 1. UnoCSS 配置

- 与 ArcoDesign 主题色同步
- 支持暗色模式
- 原子化 CSS 类名
- 图标系统集成

### 2. 主题系统

```typescript
// 主题切换
appStore.toggleTheme(dark: boolean)

// 使用 arcodesign 中 token 来调整相关变量
// 完整的 token 位于 src/assets/style/token.less，不要修改该文件，仅为罗列有哪些可供修改的 token
// 如果需要调整其中的变量，参考 token 在 src/assets/style/variables.less 中修改
@primary-6: xxx
```

### 3. 响应式设计

```typescript
// 断点配置
const breakpoints = useBreakpoints(breakpointsTailwind);

// 使用示例
const isMobile = breakpoints.smallerOrEqual('md');
```

## 开发工具链

### 1. 代码检查

- **ESLint**: JavaScript/TypeScript 代码规范
- **Prettier**: 代码格式化
- **Stylelint**: CSS/Less 样式规范

### 2. Git 工作流

- **Husky**: Git 钩子
- **lint-staged**: 暂存文件检查
- **commitlint**: 提交信息规范

### 3. 构建优化

- **Vite**: 快速构建
- **UnoCSS**: 按需生成 CSS
- **ArcoDesign**: 按需导入组件

## 常用开发模式

### 1. 创建新页面

1. 在 `src/views/` 创建页面组件
2. 在 `src/router/routes/modules/` 添加路由配置
3. 在 `src/locale/zh-CN.ts` 添加~~国际化~~映射文件
4. 在 `src/api/` 添加相关接口

### 2. 创建新组件

1. 在 `src/components/` 创建组件
2. 如需全局注册，在 `src/components/index.ts` 添加
3. 使用 UnoCSS 原子类进行样式开发

### 3. 添加新接口

1. 在 `src/api/` 创建接口文件
2. 定义 TypeScript 类型
3. 使用 axios 发起请求
4. 在组件中调用接口

### 4. 状态管理

1. 在 `src/store/modules/` 创建 store
2. 定义 state、getters、actions
3. 配置持久化 (如需要)
4. 在组件中使用 store

## 业务模块开发模式

### Data 模块编程模式

项目中的 `src/views/data` 模块展示了一种优秀的业务模块开发模式，可以作为其他模块的参考模板。详细文档请参考：[Data 模块 AI 辅助编程上下文](./src/views/data/CLAUDE.md)

#### 核心特点

1. **组合式函数复用**: 通过 `composables` 目录将业务逻辑抽离，实现跨页面复用
2. **组件复用**: 详情页面复用检索页面的组件和逻辑，减少重复代码
3. **API 接口复用**: 通过参数控制，一个接口支持多种场景（列表查询、详情查询）
4. **响应式数据流**: 使用 `provide/inject` 模式在页面级别提供状态
5. **类型安全**: 完整的 TypeScript 类型定义和接口类型与业务模型严格对应

#### 目录结构模式

```
src/views/[module]/
├── search/                    # 检索页面
│   ├── index.vue             # 主页面入口
│   ├── components/           # 页面组件
│   │   ├── filter.vue        # 过滤组件
│   │   ├── table.vue         # 表格组件
│   │   ├── create-update-panel.vue  # 创建/更新面板
│   │   └── batch-create-panel.vue   # 批量创建面板
│   └── composables/          # 组合式函数
│       ├── search.ts         # 搜索逻辑
│       ├── create-update.ts  # 创建/更新逻辑
│       ├── batch-create.ts   # 批量创建逻辑
│       └── batch-operate.ts  # 批量操作逻辑
└── detail/                   # 详情页面
    ├── index.vue             # 主页面入口
    └── components/           # 页面组件
        └── basic-info.vue    # 基本信息组件
```

#### 开发规范

1. **命名规范**:

   - 组件文件使用 kebab-case: `create-update-panel.vue`
   - 组合式函数使用 camelCase: `create-update.ts`
   - 提供函数: `provideXxxx`，使用函数: `useXxxx`

2. **代码组织**:

   - 组件结构: 导入依赖 → 获取状态 → 计算属性 → 事件处理
   - 组合式函数结构: 导入依赖 → 类型定义 → 常量定义 → 重置函数 → 提供函数 → 使用函数

3. **状态管理**:

   - 使用 `ref` 管理简单状态
   - 使用 `reactive` 管理复杂状态
   - 使用 `shallowRef` 管理组件实例
   - 通过 `provide/inject` 在页面级别共享状态

4. **类型安全**:
   - 完整的接口定义和全局类型管理
   - API 模型与业务模型严格对应
   - 支持泛型和联合类型

#### 适用场景

这种编程模式特别适用于：

- CRUD 功能开发
- 列表页面与详情页面的组合
- 需要批量操作的业务场景
- 需要复杂搜索和过滤功能
- 需要数据导出功能

#### 扩展指南

1. **新增业务模块**: 复制 Data 模块结构，修改命名和业务逻辑
2. **添加新功能**: 在 `composables` 中添加新的组合式函数
3. **自定义组件**: 遵循现有命名规范，使用 TypeScript 定义 props 和 emits

## 高级开发模式

### 1. 组合式函数设计模式

#### 状态管理组合式函数

```typescript
// 提供函数 - 在父组件中提供状态
export function provideSearchXxxx(
  queries: Ref<Partial<QueryXxxxListReq>>,
): SearchXxxxState {
  const state = {
    loading: ref(false),
    queryModel: ref<QueryXxxxListReq>({}),
    fetchData: async () => {
      /* ... */
    },
  };

  provide(symbol, state);
  return state;
}

// 使用函数 - 在子组件中获取状态
export function useSearchXxxx(): SearchXxxxState {
  return inject(symbol) as SearchXxxxState;
}
```

#### 业务逻辑组合式函数

```typescript
// 创建/更新逻辑
export function provideCreateUpdateXxxx(): CreateUpdateXxxxState {
  const panelVisible = ref(false);
  const formRef = shallowRef<FormInstance>();
  const formModel = ref<CreateUpdateXxxxModel>({});

  const handleOpen = ($event: Event, record?: Partial<XxxxModel>) => {
    formModel.value = { ...resetModel(), ...record };
    panelVisible.value = true;
  };

  const handleSubmit = async (callback?: Function) => {
    const errors = await formRef.value?.validate();
    if (errors) return false;

    try {
      const result = await apiCall(formModel.value);
      callback?.({ type: 'update', record: result });
      return true;
    } catch (err) {
      Message.error(err.message);
      return false;
    }
  };

  return {
    panelVisible,
    formRef,
    formModel,
    handleOpen,
    handleSubmit,
  };
}
```

### 2. 组件设计模式

#### 高阶组件模式

```vue
<!-- 表格组件 - 可复用的表格逻辑 -->
<template>
  <a-table
    v-model:selected-keys="selectionState.checked"
    :loading="loading"
    :data="renderData"
    :columns="renderColumns"
    @page-change="onPageChange"
  >
    <template #operations="{ record }">
      <slot name="operations" :record="record" />
    </template>
  </a-table>
</template>

<script lang="ts" setup>
  interface Props {
    showOperations?: boolean;
    title?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    showOperations: true,
  });

  // 使用组合式函数获取状态
  const { loading, renderData, onPageChange } = useSearchXxxx();
  const { selectionState } = useBatchOperateXxxx();
</script>
```

#### 插槽组件模式

```vue
<!-- 过滤组件 - 灵活的过滤逻辑 -->
<template>
  <a-card>
    <a-form ref="formRef" :model="queryModel">
      <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-x-4">
        <!-- 默认过滤字段 -->
        <a-form-item field="id" label="ID">
          <a-select v-model="queryModel.id" allow-clear />
        </a-form-item>

        <!-- 自定义过滤字段 -->
        <slot name="filters" :queryModel="queryModel" />
      </div>
    </a-form>

    <div class="flex gap-4 mt-4">
      <div class="flex-auto"></div>
      <a-button @click="handleReset">重置</a-button>
      <a-button type="primary" @click="fetchData">检索</a-button>
    </div>
  </a-card>
</template>
```

### 3. 数据流管理模式

#### 分页状态持久化

```typescript
// 将分页状态持久化到 URL，防止刷新丢失
const onPageChange = (current: number) => {
  pagination.current = current;
  fetchData();

  // 更新 URL 而不刷新页面
  const url = router.resolve({
    query: { ...route.query, current },
  }).href;
  window.history.pushState({}, '', url);
};
```

#### 响应式数据更新

```typescript
// 前端更新列表数据，减少不必要的请求
const onUpdateRenderData = (data: {
  type: 'update' | 'create' | 'delete';
  record?: XxxxModel;
  records?: XxxxModel[];
  ids?: XxxxModel['id'][];
}) => {
  switch (data.type) {
    case 'update':
      renderData.value = renderData.value.map((item) =>
        item.id === data.record?.id ? { ...item, ...data.record } : item,
      );
      break;
    case 'create':
      if (data.records) {
        renderData.value.unshift(...data.records);
      } else {
        renderData.value.unshift(data.record as XxxxModel);
      }
      break;
    case 'delete':
      renderData.value = renderData.value.filter(
        (item) => !data?.ids?.includes(item.id),
      );
      break;
  }
};
```

### 4. 性能优化模式

#### 懒加载和按需导入

```typescript
// 路由懒加载
export default {
  path: '/dashboard',
  component: () => import('@/views/dashboard/index.vue'),
};

// 组件懒加载
const AsyncComponent = defineAsyncComponent(
  () => import('@/components/HeavyComponent.vue'),
);
```

#### 虚拟滚动和分页

```typescript
// 大数据量表格优化
const tableProps = {
  virtualListProps: {
    height: 400,
    itemHeight: 50,
  },
  scroll: { y: 400 },
};
```

#### 防抖和节流

```typescript
// 搜索防抖
const debouncedSearch = debounce((query: string) => {
  fetchData({ query });
}, 300);

// 滚动节流
const throttledScroll = throttle((event: Event) => {
  // 处理滚动事件
}, 100);
```

### 5. 错误处理和用户体验

#### 统一错误处理

```typescript
// 全局错误处理
const handleError = (error: any, context?: string) => {
  console.error(`Error in ${context}:`, error);

  if (error.response?.status === 401) {
    // 未授权，跳转登录
    router.push('/login');
  } else if (error.response?.status >= 500) {
    // 服务器错误
    Message.error('服务器错误，请稍后重试');
  } else {
    // 其他错误
    Message.error(error.message || '操作失败');
  }
};
```

#### 加载状态管理

```typescript
// 多层级加载状态
const { loading: globalLoading, setLoading: setGlobalLoading } = useLoading();
const { loading: localLoading, setLoading: setLocalLoading } = useLoading();

// 不同场景使用不同的加载状态
const fetchData = async () => {
  setLocalLoading(true); // 局部加载
  try {
    await apiCall();
  } finally {
    setLocalLoading(false);
  }
};
```

### 6. 测试和调试模式

#### 开发环境调试

```typescript
// 开发环境日志
if (import.meta.env.DEV) {
  console.log('Debug info:', { queryModel, renderData });
}

// 条件调试
const debug = ref(import.meta.env.DEV);
watch(debug, (value) => {
  if (value) {
    // 开启调试模式
  }
});
```

#### 错误边界处理

```vue
<template>
  <div>
    <ErrorBoundary v-if="hasError" @retry="handleRetry" />
    <component v-else :is="currentComponent" />
  </div>
</template>

<script lang="ts" setup>
  const hasError = ref(false);

  const handleRetry = () => {
    hasError.value = false;
    // 重试逻辑
  };

  // 错误捕获
  onErrorCaptured((error) => {
    hasError.value = true;
    console.error('Component error:', error);
    return false;
  });
</script>
```

## 环境配置

### 开发环境代理配置

项目支持两种开发环境代理配置方式，用于解决跨域问题：

#### 方式一：使用 VITE_DEV_PROXY 环境变量

在 `.env.development` 文件中配置：

```bash
# 开发代理配置 - 方式一
# 使用 JSON 数组格式，每个子数组包含 [前缀, 目标地址]
VITE_DEV_PROXY=[["/api", "http://127.0.0.1:3000/api"],["/upload", "http://127.0.0.1:3000/upload"]]
```

配置说明：

- 使用 JSON 数组格式，必须使用双引号
- 每个子数组包含两个元素：`[前缀, 目标地址]`
- 系统会自动进行路径重写，移除前缀
- 支持多个代理配置

#### 方式二：使用 VITE_DEV_PROXY_XXX_TARGET 环境变量

在 `.env.development` 文件中配置：

```bash
# 开发代理配置 - 方式二
# 使用 VITE_DEV_PROXY_XXX_TARGET 格式
VITE_DEV_PROXY_API_TARGET=http://127.0.0.1:3000/api
VITE_DEV_PROXY_UPLOAD_TARGET=http://127.0.0.1:3000/upload

# 可选：指定自定义前缀
VITE_DEV_PROXY_API_PREFIX=/api
VITE_DEV_PROXY_UPLOAD_PREFIX=/upload
```

配置说明：

- `VITE_DEV_PROXY_XXX_TARGET` 指定目标地址
- `VITE_DEV_PROXY_XXX_PREFIX` 可选，指定代理前缀
- 如果没有指定前缀，则使用小写的代理名称作为前缀
- 例如：`VITE_DEV_PROXY_API_TARGET` 默认前缀为 `/api`

#### 代理配置示例

```bash
# .env.development 文件示例

# 方式一：JSON 数组格式
VITE_DEV_PROXY=[["/api", "http://127.0.0.1:3000/api"],["/media", "http://127.0.0.1:4000"]]

# 方式二：单独配置格式
VITE_DEV_PROXY_API_TARGET=http://127.0.0.1:3000/api
VITE_DEV_PROXY_MEDIA_TARGET=http://127.0.0.1:4000
VITE_DEV_PROXY_UPLOAD_TARGET=http://127.0.0.1:3000/upload

# 可选：自定义前缀
VITE_DEV_PROXY_API_PREFIX=/api
VITE_DEV_PROXY_MEDIA_PREFIX=/media
VITE_DEV_PROXY_UPLOAD_PREFIX=/upload
```

#### 代理配置原理

代理配置会自动转换为 Vite 的 proxy 配置：

```typescript
// 自动生成的代理配置
proxy: {
  '/api': {
    target: 'http://127.0.0.1:3000/api',
    changeOrigin: true,
    ws: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
  '/upload': {
    target: 'http://127.0.0.1:3000/upload',
    changeOrigin: true,
    ws: true,
    rewrite: (path) => path.replace(/^\/upload/, ''),
  }
}
```

### 开发环境命令

```bash
npm run dev          # 启动开发服务器
npm run type:check   # 类型检查
npm run lint-staged  # 代码检查
```

### 生产环境

```bash
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
npm run report       # 生成构建报告
```

## 注意事项

1. **TypeScript**: 严格类型检查，避免 any 类型
2. **响应式**: 优先使用组合式 API
3. **性能**: 合理使用 computed 和 watch
4. **安全**: 注意 XSS 和 CSRF 防护
5. **兼容性**: 支持现代浏览器，移动端适配

## 扩展指南

### 添加新功能

1. 分析需求，确定技术方案
2. 创建相关文件 (组件、接口、路由等)
3. 编写单元测试
4. 更新文档

### 自定义主题

1. 修改 `src/assets/style/token.less`
2. 更新 `uno.config.ts` 中的颜色配置
3. 测试主题切换功能

### 国际化扩展

1. 在 `src/locale/` 添加语言包
2. 更新 `src/locale/index.ts`
3. 在组件中使用 `t()` 函数

## AI 辅助开发指南

### 使用此文档进行 AI 辅助开发

当使用 AI 大模型辅助开发时，请遵循以下指导原则：

#### 1. 代码风格一致性

- **严格遵循命名规范**: 文件使用 kebab-case，变量使用 camelCase，类型使用 PascalCase
- **保持代码结构**: 按照既定的代码组织结构编写，确保可读性和维护性
- **使用项目约定**: 优先使用项目中已有的模式和约定，避免引入新的不一致性

#### 2. 组件开发模式

- **组合式函数优先**: 将业务逻辑抽离到 `composables` 中，实现逻辑复用
- **类型安全**: 为所有接口、组件 props、状态定义完整的 TypeScript 类型
- **响应式设计**: 使用 UnoCSS 原子类，确保移动端适配

#### 3. 业务模块开发

- **参考 Data 模块**: 新业务模块应参考 `src/views/data` 的目录结构和开发模式
- **API 接口规范**: 遵循既定的接口命名和设计模式
- **状态管理**: 使用 Pinia 进行状态管理，合理配置持久化

#### 4. 性能优化

- **懒加载**: 路由和组件使用懒加载，减少初始包大小
- **按需导入**: 组件库和工具库按需导入
- **缓存策略**: 合理使用 computed 和 watch，避免不必要的重复计算

#### 5. 错误处理

- **统一错误处理**: 使用项目统一的错误处理机制
- **用户友好**: 提供清晰的错误信息和恢复机制
- **开发调试**: 在开发环境提供详细的调试信息

### 快速开发检查清单

在开发新功能时，请确保：

- [ ] 文件命名符合项目规范
- [ ] 组件结构遵循既定模式
- [ ] TypeScript 类型定义完整
- [ ] 使用 UnoCSS 进行样式开发
- [ ] 错误处理机制完善
- [ ] 移动端适配考虑
- [ ] 性能优化措施到位
- [ ] 代码注释清晰

### 常见开发场景

#### 新增业务模块

1. 复制 `src/views/data` 目录结构
2. 修改文件命名和业务逻辑
3. 创建对应的 API 接口
4. 添加路由配置
5. 更新国际化文本

#### 新增组件

1. 在 `src/components` 创建组件文件
2. 使用 kebab-case 命名
3. 定义完整的 TypeScript 类型
4. 如需全局注册，在 `src/components/index.ts` 添加

#### 新增 API 接口

1. 在 `src/api` 创建接口文件
2. 定义请求和响应类型
3. 使用既定的命名规范
4. 添加错误处理逻辑

这个项目模板提供了完整的企业级前端开发解决方案，遵循最佳实践，支持快速开发和团队协作。通过遵循本文档中的规范和模式，可以确保代码质量和开发效率。
