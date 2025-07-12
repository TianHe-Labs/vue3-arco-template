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

  theme: {
    // 同步 ArcoDesign 的 box-shadow 变量 https://arco.design/vue/docs/token
    boxShadow: {
      'special': '0 0 1px rgba(0, 0, 0, 0.3)',
      '1-center': '0 -2px 5px rgba(0, 0, 0, 0.1)',
      '2-center': '0 0 10px rgba(0, 0, 0, 0.1)',
      '3-center': '0 0 20px rgba(0, 0, 0, 0.1)',
    },
    colors: {
      // ArcoDesign 变量
      // https://arco.design/vue/docs/token
      primary: {
        DEFAULT: 'rgba(var(--primary-6))',
        9: 'rgba(var(--primary-9))',
        8: 'rgba(var(--primary-8))',
        7: 'rgba(var(--primary-7))',
        6: 'rgba(var(--primary-6))', // DEFAULT
        5: 'rgba(var(--primary-5))',
        4: 'rgba(var(--primary-4))',
        3: 'rgba(var(--primary-3))',
        2: 'rgba(var(--primary-2))',
        1: 'rgba(var(--primary-1))',
      },

      success: {
        DEFAULT: 'rgba(var(--success-6))',
        9: 'rgba(var(--success-9))',
        8: 'rgba(var(--success-8))',
        7: 'rgba(var(--success-7))',
        6: 'rgba(var(--success-6))', // DEFAULT
        5: 'rgba(var(--success-5))',
        4: 'rgba(var(--success-4))',
        3: 'rgba(var(--success-3))',
        2: 'rgba(var(--success-2))',
        1: 'rgba(var(--success-1))',
      },

      warning: {
        DEFAULT: 'rgba(var(--warning-6))',
        9: 'rgba(var(--warning-9))',
        8: 'rgba(var(--warning-8))',
        7: 'rgba(var(--warning-7))',
        6: 'rgba(var(--warning-6))', // DEFAULT
        5: 'rgba(var(--warning-5))',
        4: 'rgba(var(--warning-4))',
        3: 'rgba(var(--warning-3))',
        2: 'rgba(var(--warning-2))',
        1: 'rgba(var(--warning-1))',
      },

      danger: {
        DEFAULT: 'rgba(var(--danger-6))',
        9: 'rgba(var(--danger-9))',
        8: 'rgba(var(--danger-8))',
        7: 'rgba(var(--danger-7))',
        6: 'rgba(var(--danger-6))', // DEFAULT
        5: 'rgba(var(--danger-5))',
        4: 'rgba(var(--danger-4))',
        3: 'rgba(var(--danger-3))',
        2: 'rgba(var(--danger-2))',
        1: 'rgba(var(--danger-1))',
      },

      // ArcoDesign 链接
      link: {
        7: 'rgba(var(--link-7))',
        6: 'rgba(var(--link-6))',
        5: 'rgba(var(--link-5))',
        4: 'rgba(var(--link-4))',
        3: 'rgba(var(--link-3))',
        2: 'rgba(var(--link-2))',
        1: 'rgba(var(--link-1))',
      },
      // ArcoDesign 文字
      text: {
        4: 'var(--color-text-4)',
        3: 'var(--color-text-3)',
        2: 'var(--color-text-2)',
        1: 'var(--color-text-1)',
      },
      // ArcoDesign 填充
      fill: {
        4: 'var(--color-fill-4)',
        3: 'var(--color-fill-3)',
        2: 'var(--color-fill-2)',
        1: 'var(--color-fill-1)',
      },
      // ArcoDesign 边框
      border: {
        4: 'var(--color-border-4)',
        3: 'var(--color-border-3)',
        2: 'var(--color-border-2)',
        1: 'var(--color-border-1)',
      },
      // ArcoDesign 背景
      bg: {
        5: 'var(--color-bg-5)',
        4: 'var(--color-bg-4)',
        3: 'var(--color-bg-3)',
        2: 'var(--color-bg-2)',
        1: 'var(--color-bg-1)',
      },
    },
  },
});
