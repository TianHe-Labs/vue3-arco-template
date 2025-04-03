import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base.mts';
import { createProxy } from './utils';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      fs: {
        strict: true,
      },
      proxy: createProxy(),
    },
  },
  baseConfig
);
