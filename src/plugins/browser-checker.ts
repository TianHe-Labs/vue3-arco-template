import { App } from 'vue';

// 浏览器最低版本要求，基于 @vitejs/plugin-legacy 默认配置
const browserVersionRequirement: Record<string, number> = {
  Chrome: 61, // last 2 versions, global > 0.5%
  Firefox: 60, // Firefox ESR
  Edge: 79,
  Safari: 11,
  Opera: 75, // Opera 使用 Chrome 内核，也会与 Chrome 同步
  iOS_Safari: 12, // iOS Safari last 2 versions
};

// 获取浏览器名称和版本号
function getBrowserInfo() {
  const { userAgent } = navigator;
  let browserName = '';
  let fullVersion = '';

  if (/chrome|crios|crmo/i.test(userAgent)) {
    browserName = 'Chrome';
    fullVersion = userAgent.match(/(?:chrome|crios|crmo)\/(\d+)/i)?.[1] || '';
  } else if (/firefox|fxios/i.test(userAgent)) {
    browserName = 'Firefox';
    fullVersion = userAgent.match(/(?:firefox|fxios)\/(\d+)/i)?.[1] || '';
  } else if (/edg/i.test(userAgent)) {
    browserName = 'Edge';
    fullVersion = userAgent.match(/edg\/(\d+)/i)?.[1] || '';
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    browserName = 'Safari';
    fullVersion = userAgent.match(/version\/(\d+)/i)?.[1] || '';
  } else if (/opr\/|opera/i.test(userAgent)) {
    browserName = 'Opera';
    fullVersion = userAgent.match(/(?:opr|opera)\/(\d+)/i)?.[1] || '';
  } else if (/iphone|ipad/i.test(userAgent)) {
    browserName = 'iOS_Safari';
    fullVersion = userAgent.match(/(?:version)\/(\d+)/i)?.[1] || '';
  }

  const majorVersion = parseInt(fullVersion, 10);
  return { browserName, majorVersion };
}

// 检查是否为兼容浏览器及其版本
function isSupportedBrowser() {
  const { browserName, majorVersion } = getBrowserInfo();

  if (browserVersionRequirement[browserName]) {
    return majorVersion >= browserVersionRequirement[browserName];
  }

  // 如果浏览器不在我们的检测范围内，默认为不兼容
  return false;
}

export default {
  install(app: App, options: Record<string, any> = {}) {
    const isSupported = isSupportedBrowser();
    const { browserName, majorVersion } = getBrowserInfo();

    if (!isSupported) {
      // 创建提示信息容器
      const warningDiv = document.createElement('div');
      warningDiv.setAttribute(
        'style',
        options.style ||
          `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: rgba(var(--danger-6));
            color: var(--color-bg-1);
            text-align: center;
            font-size: 16px;
            z-index: 9999;
        `,
      );

      // 提示信息文本
      const message =
        options.message ||
        `
          您的浏览器 ${browserName} ${majorVersion} 版本过低，建议更新到 ${browserVersionRequirement[browserName]} 及以上版本以获得更好的体验！
        `;
      warningDiv.innerHTML = `
        <p>${message}</p>
      `;

      // 将提示信息插入到页面
      document.body.appendChild(warningDiv);
    }
  },
};
