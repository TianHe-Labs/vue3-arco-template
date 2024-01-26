// uno.config.ts
import { defineConfig, presetUno, presetAttributify } from 'unocss';
import presetWebFonts from '@unocss/preset-web-fonts';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify({
      /* preset options */
    }),
    presetWebFonts({
      provider: 'none',
      fonts: {
        number: ['impact'],
      },
    }),
    // ...
  ],
  // ...UnoCSS options
  blocklist: ['container'],
  theme: {
    colors: {
      primary: {
        DEFAULT: '#165DFF', // 600
        // 9: '#363885',
        // 8: '#4547a9',
        7: '#0E42D2', // 点击
        6: '#165DFF', // 常规
        5: '#4080FF', // 悬浮
        4: '#6AA1FF',
        3: '#94BFFF',
        2: '#BEDAFF',
        1: '#E8F3FF',
      },

      // link = primary
      // success
      // warning
      // danger/error
      // info = gray 中性色

      success: {
        DEFAULT: '#00B42A', // 600
        // 9: '#025227',
        // 8: '#15803d',
        7: '#009A29',
        6: '#00B42A',
        5: '#23C343',
        // 4: '#6dde8f',
        3: '#7BE188',
        2: '#AFF0B5',
        1: '#E8FFEA',
      },

      warning: {
        DEFAULT: '#F59E0B', // 600
        // 9: '#824500',
        // 8: '#b45309',
        7: '#D25F00',
        6: '#FF7D00',
        5: '#FF9A2E',
        // 4: '#FFCE5C',
        3: '#FFCF8B',
        2: '#FFE4BA',
        1: '#FFF7E8',
      },

      danger: {
        // error
        DEFAULT: '#F53F3F', // 600
        // 9: '#7D101B',
        // 8: '#B91C1C',
        7: '#CB2634',
        6: '#F53F3F',
        5: '#F76560',
        // 4: '#FFA099',
        3: '#FBACA3',
        2: '#FDCDC5',
        1: '#FFECE8',
      },

      cyan: {
        // error
        DEFAULT: '#0FC6C2', // 600
        7: '#0AA5A8',
        6: '#0FC6C2',
        5: '#33D1C9',
        3: '#86E8DD',
        2: '#B5F4EA',
        1: '#E8FFFB',
      },

      text: {
        5: '#FFFFFF',
        4: '#C9CDD4',
        3: '#86909C',
        2: '#4E5969',
        1: '#1D2129',
      },

      fill: {
        5: '#4E5969',
        4: '#C9CDD4',
        3: '#E5E6EB',
        2: '#F2F3F5',
        1: '#F7F8FA',
      },

      border: {
        4: '#86909C',
        3: '#C9CDD4',
        2: '#E5E6EB',
        1: '#F2F3F5',
      },
    },
  },
});
