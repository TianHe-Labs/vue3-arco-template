# Vue3 模板 - 基于 ArcoDesign 和 UnoCSS

[English](README.md) | [中文](README.zh-CN.md)

## ArcoDesign

- **文档**: [Arco Design Vue](https://arco.design/vue/docs)

## UnoCSS

- **presetUno**: [Uno](https://unocss.dev/presets/uno)

- **presetAttributify**: [Attributify](https://unocss.dev/presets/attributify)

- **presetWebFonts**: [Web Fonts](https://unocss.dev/presets/web-fonts)

- **presetIcons**: [Icons](https://unocss.dev/presets/icons), [Iconify](https://icon-sets.iconify.design/)
  ```html
  <!-- 示例 -->
  <div class="i-solar:box-bold-duotone w-1em h-1em"></div>
  ```

## 特性

- **用户认证**: api/account, store/user

- **用户权限**: router/guard, composables/permission

- **丰富的图标库**: UnoCSS/Iconify

  ```html
  <!-- 示例 -->
  <div class="i-solar:box-bold-duotone w-1em h-1em"></div>
  ```

- **响应式设计**: CSS(UnoCSS Variants), JS(@vueuse/core useBreakpoints, provide in App.vue)

  ```js
  // App.vue
  const breakpoints = useBreakpoints(breakpointsTailwind);
  provide('breakpoints', breakpoints);

  // 子组件
  const breakpoints = inject('breakpoints') as any;
  ```

- **主题模式**: 亮色模式和暗色模式，结合 Arco Design 和 UnoCSS 确保一致性

  ```html
  <!-- [light:]<class name> -->
  <div text-primary></div>
  <div light:text-primary></div>

  <!-- dark:<class name> -->
  <div dark:text-primary></div>
  ```

- **即时按需原子化 CSS**: UnoCSS(支持 Attributify)

- **模拟数据**: mockjs

- **自动代码检查**: hucky, lint-staged, _代码检查_(eslint, prettier, stylelint), _提交信息检查_(commmitlint)

- **CI/CD**: Github Actions

## 目录结构

- **.github/workflows**: GitHub Actions 配置

- **.husky**: `pre-comment(lint-staged)`, `commit-msg`([Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/))

- **config**: [Vite 配置](https://cn.vitejs.dev/config/) (当前: Vite@^^5.2.13)

- **src**

  - **api**: 查询、创建、更新、删除接口

    ```http
    // 查询
    GET/POST /api/X/list
    GET /api/X/detail/{id}
    ...

    // 创建
    POST /api/X/create, // body: {}
    ...

    // 更新
    PUT /api/X/update, // body: {}
    PUT /api/X/y/update // X.y body: {}
    ...

    // 删除
    DELETE /api/X // body: { ids: [] }
    ...
    ```

  - **assets**: 静态文件，如 `json`, `css`, `less`, `image`, `video`

  - **components**: 公共组件，包含全局组件(index.ts)

  - **directives**: Vue3 指令，如 `v-permission`

  - **composables**: 公共组合式函数，如 `chart-option`, `loading`, `logout`, `permission`

  - **layouts**: 公共布局组件

  - **locale**: `i18n`仅用于显示内容与实际数据的映射，不做系统级国际化

  - **mock**: 开发环境模拟数据

  - **plugins**: 如 `axios`, `emitter`

  - **router**: `routes` 分页面路由配置, `guard` 全局路由守卫

  - **store**: 全局数据存储，如 `app`(主题等), `tab-bar`(多页面), `user`(登录、用户信息等), `oss`(阿里云 OSS STS)

  - **utils**: 工具函数，如 `formatX`、`dayjs`(统一拓展插件), `hasX`, `isY`, `canZ`, `transformA`, `index`(未分类的零散函数 & 各类函数的统一入口)

  - **views**: Vue3 视图组件

  - **App.vue**: Vue3 入口

  - **global.d.ts**: 全局类型定义

  - **env.d.ts**: 环境变量类型定义，如 `VITE_APP_NAME`, `VITE_DEV_PROXY` 开发环境代理配置

  - **main.ts**: 入口文件

  - **settings.json**: 应用设置（仅在开发环境可访问）

- **.env**: 通用环境变量，.env.development 仅在开发环境(_gitignore_), .env.production 仅在生产环境(_gitignore_)

- **eslint.config.js**: ESLint 配置

- **.gitignore**: Git 忽略配置

- **.prettierignore**: Prettier 忽略配置

- **.prettierrc.js**: Prettier 配置

- **.stylelintrc.js**: Stylelint 配置

- **babel.config.js**: Babel 配置

- **commitlint.config.ts**: commitlint 配置 (husky/commit-msg)

- **docker.nginx.template**: Nginx 配置模板

- **Dockerfile**: Docker 构建文件

- **index.html**: 入口 HTML

- **package.json**: 包管理配置

- **package-lock.yaml**: pnpm 锁定文件

- **tsconfig.json**: TypeScript 配置

- **uno.config.ts**: UnoCSS 配置

- **vercel.json**: Vercel 配置
