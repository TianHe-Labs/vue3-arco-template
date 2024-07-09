# Vue3 Template on ArcoDesign & UnoCSS

## ArcoDesign

- **Doc**: [Arco Design Vue](https://arco.design/vue/docs)

## UnoCSS

- **presetUno**: [Uno](https://unocss.dev/presets/uno)

- **presetAttributify**: [Attributify](https://unocss.dev/presets/attributify)

- **presetWebFonts**: [Web Fonts](https://unocss.dev/presets/web-fonts)

- **presetIcons**: [Icons](https://unocss.dev/presets/icons), [Iconify](https://icon-sets.iconify.design/)
  ```html
  <!-- example -->

  <div class="i-solar:box-bold-duotone w-1em h-1em"></div>
  ```

## Features

- **User Authentication**: api/user, store/user

- **User Permission**: router/guard, hooks/permission

- **Rich icon library**: UnoCSS/Iconify
  ```html
  <!-- example -->

  <div class="i-solar:box-bold-duotone w-1em h-1em"></div>
  ```

- **Responsive**: CSS(UnoCSS Variants), JS(@vueuse/core useBreakpoints, provide in App.vue)
  ```js
  // App.vue
  const breakpoints = useBreakpoints(breakpointsTailwind);
  provide('breakpoints', breakpoints);

  // child component
  const breakpoints = inject('breakpoints') as any;
  ```

- **Theme Mode**: light mode & dark mode, combining Arco Design with UnoCSS ensures consistency
  ```html
  <!-- [light:]<class name> -->
  <div text-primary></div>
  <div light:text-primary></div>

  <!-- dark:<class name> -->
  <div dark:text-primary></div>
  ```

- **Instant On-demand Atomic CSS**: UnoCSS(Attributify supported)

- **Mock Data**: mockjs

- **Auto Lint**: hucky, lint-staged, *code lint*(eslint, prettier, stylelint), *commit lint*(commmitlint)

- **CI/CD**: Github Actions

## Folder Structure

- **.github/workflows**

- **.husky**: ``pre-comment(lint-staged)``, ``commit-msg``([Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/))

- **config**: [Vite Config](https://cn.vitejs.dev/config/) (Current: Vite@^^5.2.13 installed)

- **src**

  - **api**: queryX, createX, updateX, deleteX

    ```http
    // queryX
    GET/POST /api/X/list
    GET /api/X/detail/{id}
    ...

    createX
    POST /api/X/create, // body: {}
    ...

    // updateX
    PUT /api/X/update, // body: {}
    PUT /api/X/y/update // X.y body: {}
    ...

    // deleteX
    DELETE /api/X // body: { ids: [] }
    DELETE /api/X/{id}
    ...
    ```

  - **assets**: static files, eg: ``json``, ``css``, ``less``, ``image``, ``video``

  - **components**: common components, inclues some global components(index.ts)

  - **directives**: Vue3 directive, eg: ``v-permission``

  - **hooks**: common hooks, eg: ``chart-option``, ``loading``, ``logout``, ``permission``

  - **layouts**: common layout components

  - **locale**: ``i18n``

  - **mock**: mock data in development

  - **plugins**: eg: ``axios``, ``emitter``

  - **router**: ``routes``, ``global route guard``

  - **store**: global data store, eg: ``app``(theme, ...),  ``tab-bar``(multi page), ``user``(login, userinfo, ...), ``oss``(ali oss sts)

  - **types**: global type definition

  - **utils**: tool function, eg: ``formatX``(preset dayjs), ``hasX``, ``isY``, ``canZ``, ``transformA``, ``index``(Unclassifiable fragmentary functions & Unified entry for various types of functions)

  - **views**: Vue3 view

  - **App.vue**: Vue3 entry

  - **env.d.ts**: env type defintion, eg: ``VITE_APP_NAME``, ``VITE_DEV_PROXY``

  - **main.ts**: entry

  - **settings.json**: app settings (only accessible in development)

- **.env**: common environment, .env.development only in development(*gitignore*), .env.production only in production(*gitignore*)

- **.eslintignore**

- **.eslintrc**: eslint config

- **.gitignore**

- **.prettierignore**

- **.prettierrc.js**: prettier config

- **.stylelintrc.js**: stylelint config

- **babel.config.js**: babel config

- **commitlint.config.ts**: commitlint config (husky/commit-msg)

- **docker.nginx.template**

- **Dockerfile**

- **index.html**: entry

- **package.json**: package

- **package-lock.yaml**: pnpm

- **tsconfig.json**: Typescript

- **uno.config.ts**: UnoCSS

- **vercel.json**: Vercel config
