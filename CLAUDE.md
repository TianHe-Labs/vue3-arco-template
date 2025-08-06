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
│   ├── locale/               # 国际化
│   ├── mock/                 # 模拟数据
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

## 开发规范

### 1. 文件命名

- 组件文件: PascalCase (如 `UserProfile.vue`)
- 工具函数: camelCase (如 `formatDate.ts`)
- 常量: UPPER_SNAKE_CASE (如 `API_ENDPOINTS`)

### 2. 组件开发

```vue
<template>
  <!-- 使用 UnoCSS 原子类 -->
  <div class="flex items-center gap-2 p-4">
    <a-button type="primary">按钮</a-button>
  </div>
</template>

<script lang="ts" setup>
  // 使用组合式 API
  import { ref, computed } from 'vue';
  import { useUserStore } from '@/store';

  // 状态管理
  const userStore = useUserStore();

  // 响应式数据
  const count = ref(0);

  // 计算属性
  const doubleCount = computed(() => count.value * 2);
</script>
```

### 3. API 接口规范

```typescript
// 接口定义 (src/api/account.ts)
export interface LoginReq {
  username: string;
  password: string;
}

export function login(data: LoginReq) {
  return axios.post<LoginRes>('/api/user/login', data);
}
```

### 4. 状态管理规范

```typescript
// Store 定义
const useUserStore = defineStore('user', {
  state: () => ({
    // 状态定义
  }),

  getters: {
    // 计算属性
  },

  actions: {
    // 异步操作
  },

  persist: {
    // 持久化配置
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
  },
};
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

// CSS 变量
:root {
  --primary-6: #165DFF;
  --color-text-1: #1D2129;
}
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
3. 在 `src/locale/zh-CN.ts` 添加国际化文本
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

这个项目模板提供了完整的企业级前端开发解决方案，遵循最佳实践，支持快速开发和团队协作。
