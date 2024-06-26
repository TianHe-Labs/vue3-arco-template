import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetWebFonts,
} from 'unocss';

export default defineConfig({
  presets: [
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
  ],
  blocklist: ['container'],
  theme: {
    colors: {
      // ArcoDesign 变量
      // https://arco.design/vue/docs/token
      primary: {
        DEFAULT: 'rgba(var(--primary-6))',
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
