# Vue3 ArcoDesign 模板项目

一个基于 Vue 3 + TypeScript + ArcoDesign + UnoCSS 的现代化前端模板项目，采用组合式 API 和 Pinia 状态管理，支持响应式设计和主题切换。

## ✨ 特性

- 🚀 **Vue 3 + TypeScript**: 使用最新的 Vue 3 组合式 API 和 TypeScript
- 🎨 **ArcoDesign**: 企业级 UI 组件库，提供丰富的组件和主题
- ⚡ **UnoCSS**: 原子化 CSS 框架，支持即时按需生成
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 🌙 **主题切换**: 支持亮色和暗色主题
- 🔐 **权限管理**: 完整的路由权限控制系统
- 📊 **图表集成**: 集成 ECharts 图表库
- 🎯 **开发体验**: ESLint + Prettier + Stylelint 代码规范
- 🔄 **状态管理**: Pinia 状态管理，支持持久化
- 🌍 **~~国际化~~ 字面量映射**: ~~支持多语言切换~~ 使用 i18n 做字面量映射
- 📦 **构建优化**: Vite 快速构建，支持按需加载

## 🛠 技术栈

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

## 📁 项目结构

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
│   ├── locale/               # 使用 i18n 做字面量映射
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

## 🚀 快速开始

### 环境要求

- Node.js >= 18.18.0
- pnpm >= 8.0.0 (推荐)

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发环境

```bash
# 启动开发服务器
pnpm dev

# 类型检查
pnpm type:check

# 代码检查
pnpm lint-staged
```

### 生产构建

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 生成构建报告
pnpm report
```

## 📖 使用指南

### 1. 创建新页面

1. 在 `src/views/` 创建页面组件
2. 在 `src/router/routes/modules/` 添加路由配置
3. 在 `src/locale/zh-CN.ts` 添加 ~~国际化~~ 使用 i18n 做字面量映射
4. 在 `src/api/` 添加相关接口

### 2. 创建新组件

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

### 3. 添加新接口

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

### 4. 状态管理

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

## 🎨 样式系统

### UnoCSS 原子类

```html
<!-- 基础样式 -->
<div class="flex items-center gap-2 p-4 bg-white rounded-lg shadow-md">
  <span class="text-primary text-lg font-bold">标题</span>
  <a-button type="primary">按钮</a-button>
</div>

<!-- 响应式设计 -->
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- 内容 -->
</div>

<!-- 暗色模式 -->
<div class="bg-white dark:bg-gray-800 text-black dark:text-white">
  <!-- 内容 -->
</div>
```

### 图标使用

```html
<!-- Iconify 图标 -->
<div class="i-solar:box-bold-duotone w-1em h-1em"></div>
<div class="i-mdi:home text-2xl text-primary"></div>
```

### 主题切换

```typescript
// 在组件中使用
import { useAppStore } from '@/store';

const appStore = useAppStore();

// 切换主题
appStore.toggleTheme(true); // 暗色模式
appStore.toggleTheme(false); // 亮色模式
```

## 🔐 权限系统

### 路由权限配置

```typescript
// 路由定义
export default {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    locale: 'menu.dashboard',
    requiresAuth: true, // 需要认证
    roles: ['admin'], // 允许的角色
  },
};
```

### 权限检查

```typescript
// 在组件中使用
import usePermission from '@/composables/permission';

const { accessRoute } = usePermission();

// 检查路由权限
const canAccess = accessRoute(route);
```

## 🌍 ~~国际化~~ 字面量映射

### 添加语言包

```typescript
// src/locale/zh-CN.ts
export default {
  'menu.dashboard': '仪表盘',
  'menu.user': '用户管理',
};
```

### 在组件中使用

```vue
<template>
  <div>
    <h1>{{ $t('menu.dashboard') }}</h1>
    <a-button>{{ $t('common.submit') }}</a-button>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
</script>
```

## 📊 图表集成

### ECharts 使用

```vue
<template>
  <Chart :option="chartOption" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const chartOption = ref({
    title: { text: '销售数据' },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150], type: 'bar' }],
  });
</script>
```

## 🔧 开发工具

### 代码规范

项目使用 ESLint + Prettier + Stylelint 进行代码规范检查：

```bash
# 代码检查
pnpm lint-staged

# 手动检查
npx eslint src/
npx prettier --write src/
npx stylelint src/**/*.{vue,less,css}
```

### Git 提交规范

项目使用 Conventional Commits 规范：

```bash
# 提交示例
git commit -m "feat: 添加用户管理功能"
git commit -m "fix: 修复登录页面样式问题"
git commit -m "docs: 更新 README 文档"
```

### 环境变量

```bash
# .env.development
VITE_APP_NAME=Vue3 ArcoDesign 模板
VITE_API_BASE=http://localhost:3000/api

# 开发代理配置 - 方式一：JSON 数组格式
VITE_DEV_PROXY=[["/api", "http://127.0.0.1:3000/api"],["/upload", "http://127.0.0.1:3000/upload"]]

# 开发代理配置 - 方式二：单独配置格式
VITE_DEV_PROXY_API_TARGET=http://127.0.0.1:3000/api
VITE_DEV_PROXY_UPLOAD_TARGET=http://127.0.0.1:3000/upload
VITE_DEV_PROXY_API_PREFIX=/api
VITE_DEV_PROXY_UPLOAD_PREFIX=/upload

# .env.production
VITE_APP_NAME=Vue3 ArcoDesign 模板
VITE_API_BASE=https://api.example.com
```

### 开发环境代理配置

项目支持两种开发环境代理配置方式，用于解决跨域问题：

- ✅ 自动路径重写
- ✅ 支持 HTTPS 代理
- ✅ 支持 WebSocket
- ✅ 自动处理跨域问题
- ✅ 配置验证和错误处理

#### 方式一：使用 VITE_DEV_PROXY 环境变量

```bash
# 在 .env.development 文件中配置
VITE_DEV_PROXY=[["/api", "http://127.0.0.1:3000/api"],["/upload", "http://127.0.0.1:3000/upload"]]
```

配置说明：

- 使用 JSON 数组格式，必须使用双引号
- 每个子数组包含两个元素：`[前缀, 目标地址]`
- 系统会自动进行路径重写，移除前缀
- 支持多个代理配置

#### 方式二：使用 VITE_DEV_PROXY_XXX_TARGET 环境变量

```bash
# 在 .env.development 文件中配置
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
# .env.development 文件完整示例

# 基础配置
VITE_APP_NAME=Vue3 ArcoDesign 模板
VITE_API_BASE=http://localhost:3000/api

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

## 🚀 部署

### Docker 部署

```bash
# 构建镜像
docker build -t vue3-arco-template .

# 运行容器
docker run -p 80:80 vue3-arco-template
```

### Vercel 部署

项目已配置 `vercel.json`，可直接部署到 Vercel：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 📝 开发规范

### 文件命名

- 组件文件: PascalCase (如 `UserProfile.vue`)
- 工具函数: camelCase (如 `formatDate.ts`)
- 常量: UPPER_SNAKE_CASE (如 `API_ENDPOINTS`)

### 组件开发

- 优先使用组合式 API
- 合理使用 TypeScript 类型
- 使用 UnoCSS 原子类进行样式开发
- 组件 props 使用 TypeScript 接口定义

### 状态管理

- 使用 Pinia 进行状态管理
- 合理使用持久化配置
- 避免在组件中直接修改 store 状态

### API 接口

- 统一使用 axios 发起请求
- 定义完整的 TypeScript 类型
- 使用统一的错误处理机制

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [ArcoDesign](https://arco.design/) - 企业级 UI 设计语言
- [UnoCSS](https://unocss.dev/) - 原子化 CSS 引擎
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

---

如果这个项目对你有帮助，请给个 ⭐️ 支持一下！
