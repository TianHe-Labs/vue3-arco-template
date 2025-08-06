import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetWebFonts,
  presetIcons,
} from 'unocss';

export default defineConfig({
  presets: [
    /*
      unocss dark mode 与arcodesign协同注入，
      unocss 默认使用class="dark"，因此可以利用arcodesign的接口动态改变class，
      也可以在unocss.config.ts中改变默认配置，使用arcodesign的选择器，
      这里的修改就是选择前一种方式
    */
    presetUno({
      dark: {
        // light: 'body[arco-theme=light]',
        dark: 'body[arco-theme=dark]',
      },
    }),
    presetAttributify(),
    presetWebFonts({
      provider: 'none',
      fonts: {
        number: ['impact'],
      },
    }),
    presetIcons(), // iconify 图标集成 https://unocss.dev/presets/icons#options
  ],
  blocklist: ['container'],
  shortcuts: {
    'float-button': 'bg-bg-5 border border-solid border-border-2 shadow-md',
  },
  safelist: [
    'bg-success-1',
    'bg-success-2',
    'bg-success-3',
    'bg-success-4',
    'bg-warning-1',
    'bg-warning-2',
    'bg-warning-3',
    'bg-warning-4',
  ],
  theme: {
    // 同步 ArcoDesign 的 box-shadow 变量 https://arco.design/vue/docs/token
    // 使用 unocss class 或 attribute 的时候，可以与 arcodesign 保持一致
    // ArcoDesign 默认主题具体色颜色值可参见 src/assets/style/token.less
    // 如果需要修改颜色值，参照 src/assets/style/token.less
    // 在 src/assets/styles/variables.less 中统一修改，此文件不需要改动
    boxShadow: {
      // 'special': '0 0 1px rgba(0, 0, 0, 0.3)',
      // '1-center': '0 -2px 5px rgba(0, 0, 0, 0.1)',
      // '2-center': '0 0 10px rgba(0, 0, 0, 0.1)',
      // '3-center': '0 0 20px rgba(0, 0, 0, 0.1)',
    },
    colors: {
      // ArcoDesign 主色
      primary: {
        DEFAULT: 'rgba(var(--primary-6))',
        10: 'rgba(var(--primary-10))',
        9: 'rgba(var(--primary-9))',
        8: 'rgba(var(--primary-8))',
        7: 'rgba(var(--primary-7))',
        6: 'rgba(var(--primary-6))',
        5: 'rgba(var(--primary-5))',
        4: 'rgba(var(--primary-4))',
        3: 'rgba(var(--primary-3))',
        2: 'rgba(var(--primary-2))',
        1: 'rgba(var(--primary-1))',
      },
      // ArcoDesign 成功色
      success: {
        DEFAULT: 'rgba(var(--success-6))',
        10: 'rgba(var(--success-10))',
        9: 'rgba(var(--success-9))',
        8: 'rgba(var(--success-8))',
        7: 'rgba(var(--success-7))',
        6: 'rgba(var(--success-6))',
        5: 'rgba(var(--success-5))',
        4: 'rgba(var(--success-4))',
        3: 'rgba(var(--success-3))',
        2: 'rgba(var(--success-2))',
        1: 'rgba(var(--success-1))',
      },
      // ArcoDesign 警告色
      warning: {
        DEFAULT: 'rgba(var(--warning-6))',
        10: 'rgba(var(--warning-10))',
        9: 'rgba(var(--warning-9))',
        8: 'rgba(var(--warning-8))',
        7: 'rgba(var(--warning-7))',
        6: 'rgba(var(--warning-6))',
        5: 'rgba(var(--warning-5))',
        4: 'rgba(var(--warning-4))',
        3: 'rgba(var(--warning-3))',
        2: 'rgba(var(--warning-2))',
        1: 'rgba(var(--warning-1))',
      },
      // ArcoDesign 危险色
      danger: {
        DEFAULT: 'rgba(var(--danger-6))',
        10: 'rgba(var(--danger-10))',
        9: 'rgba(var(--danger-9))',
        8: 'rgba(var(--danger-8))',
        7: 'rgba(var(--danger-7))',
        6: 'rgba(var(--danger-6))',
        5: 'rgba(var(--danger-5))',
        4: 'rgba(var(--danger-4))',
        3: 'rgba(var(--danger-3))',
        2: 'rgba(var(--danger-2))',
        1: 'rgba(var(--danger-1))',
      },

      // ArcoDesign 链接色 同 primary
      link: {
        7: 'rgba(var(--link-7))',
        6: 'rgba(var(--link-6))',
        5: 'rgba(var(--link-5))',
        4: 'rgba(var(--link-4))',
        3: 'rgba(var(--link-3))',
        2: 'rgba(var(--link-2))',
        1: 'rgba(var(--link-1))',
      },
      // ArcoDesign 文字色
      text: {
        4: 'var(--color-text-4)',
        3: 'var(--color-text-3)',
        2: 'var(--color-text-2)',
        1: 'var(--color-text-1)',
      },
      // ArcoDesign 填充色
      fill: {
        4: 'var(--color-fill-4)',
        3: 'var(--color-fill-3)',
        2: 'var(--color-fill-2)',
        1: 'var(--color-fill-1)',
      },
      // ArcoDesign 边框色
      border: {
        4: 'var(--color-border-4)',
        3: 'var(--color-border-3)',
        2: 'var(--color-border-2)',
        1: 'var(--color-border-1)',
      },
      // ArcoDesign 背景色
      bg: {
        white: 'var(--color-bg-white)',
        5: 'var(--color-bg-5)',
        4: 'var(--color-bg-4)',
        3: 'var(--color-bg-3)',
        2: 'var(--color-bg-2)',
        1: 'var(--color-bg-1)',
      },
    },
  },
});
