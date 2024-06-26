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
        DEFAULT: 'var(--color-primary-6)',
        7: 'var(--color-primary-7)',
        6: 'var(--color-primary-6)', // DEFAULT
        5: 'var(--color-primary-5)',
        4: 'var(--color-primary-4)',
        3: 'var(--color-primary-3)',
        2: 'var(--color-primary-2)',
        1: 'var(--color-primary-1)',
      },

      success: {
        DEFAULT: 'var(--color-success-6)',
        7: 'var(--color-success-7)',
        6: 'var(--color-success-6)', // DEFAULT
        5: 'var(--color-success-5)',
        4: 'var(--color-success-4)',
        3: 'var(--color-success-3)',
        2: 'var(--color-success-2)',
        1: 'var(--color-success-1)',
      },

      warning: {
        DEFAULT: 'var(--color-warning-6)',
        7: 'var(--color-warning-7)',
        6: 'var(--color-warning-6)', // DEFAULT
        5: 'var(--color-warning-5)',
        4: 'var(--color-warning-4)',
        3: 'var(--color-warning-3)',
        2: 'var(--color-warning-2)',
        1: 'var(--color-warning-1)',
      },

      danger: {
        DEFAULT: 'var(--color-danger-6)',
        7: 'var(--color-danger-7)',
        6: 'var(--color-danger-6)', // DEFAULT
        5: 'var(--color-danger-5)',
        4: 'var(--color-danger-4)',
        3: 'var(--color-danger-3)',
        2: 'var(--color-danger-2)',
        1: 'var(--color-danger-1)',
      },
      // ArcoDesign 链接
      link: {
        7: 'var(--color-link-7)',
        6: 'var(--color-link-6)',
        5: 'var(--color-link-5)',
        4: 'var(--color-link-4)',
        3: 'var(--color-link-3)',
        2: 'var(--color-link-2)',
        1: 'var(--color-link-1)',
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
