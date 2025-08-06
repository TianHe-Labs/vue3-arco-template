import { loadEnv, ProxyOptions } from 'vite';

/**
 * Whether to generate package preview
 * 是否生成打包报告
 */
export function isReportMode(): boolean {
  return process.env.REPORT === 'true';
}

/**
 * 工具函数：创建代理配置
 */
function createProxyConfig(prefix: string, target: string): ProxyOptions {
  const httpsRe = /^https:\/\//;
  const isHttps = httpsRe.test(target);

  return {
    target,
    changeOrigin: true,
    ws: true,
    rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ''),
    ...(isHttps ? { secure: false } : {}),
  };
}

export function createProxy() {
  const env = loadEnv('development', process.cwd());
  // 只从 development 中读取
  const proxyObj: Record<string, object> = {};

  /**
   * 开发代理配置方式一：
   * VITE_DEV_PROXY=[
   *   ["/api", "http://127.0.0.1:3000/api"],
   *   ["/upload", "http://127.0.0.1:3000/upload"],
   *   ...
   * ]
   * 要使用 JSON.parse 解析，因此必须使用双引号
   */
  const proxyRaw = env.VITE_DEV_PROXY;
  if (proxyRaw) {
    try {
      const proxyArr = JSON.parse(proxyRaw || '[]');
      proxyArr.forEach((item: string[]) => {
        const [prefix, target] = item;
        // 创建代理配置
        if (prefix && target) {
          proxyObj[prefix] = createProxyConfig(prefix, target);
        }
      });
    } catch (error) {
      console.error('VITE_DEV_PROXY 格式错误', error);
    }
  }

  /**
   * 开发代理配置方式二：
   * VITE_DEV_PROXY_API_PREFIX=/api
   * VITE_DEV_PROXY_API_TARGET=http://127.0.0.1:3000/api
   * VITE_DEV_PROXY_UPLOAD_PREFIX=/upload
   * VITE_DEV_PROXY_UPLOAD_TARGET=http://127.0.0.1:3000/upload
   * VITE_DEV_PROXY_XXX_PREFIX 和 VITE_DEV_PROXY_XXX_TARGET 要一一对应，
   * 如果只有 VITE_DEV_PROXY_XXX_TARGET 没有对应的 VITE_DEV_PROXY_XXX_PREFIX，
   * 则使用小写的代理名称作为前缀，例如：VITE_DEV_PROXY_API_TARGET -> /api
   */
  Object.keys(env).forEach((key) => {
    // 处理以 VITE_DEV_PROXY_ 开头，以 _TARGET 结尾的配置
    if (key.startsWith('VITE_DEV_PROXY_') && key.endsWith('_TARGET')) {
      // 提取代理名称，例如：VITE_DEV_PROXY_API_TARGET -> API
      const proxyName = key
        .replace('VITE_DEV_PROXY_', '')
        .replace('_TARGET', '');
      const target = env[key];

      // 查找对应的前缀配置，默认使用小写的代理名称作为前缀
      const prefixKey = `VITE_PROXY_${proxyName}_PREFIX`;
      // 如果 VITE_DEV_PROXY_XXX_PREFIX 不存在，则使用小写的代理名称作为前缀
      const prefix = env[prefixKey] || `/${proxyName.toLowerCase()}`;

      if (prefix && target) {
        proxyObj[prefix] = createProxyConfig(prefix, target);
      }
    }
  });

  return proxyObj;
}
