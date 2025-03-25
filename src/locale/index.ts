import { createI18n } from 'vue-i18n';
import cn from './zh-CN';

export const LOCALE_OPTIONS = [{ label: '中文', value: 'zh-CN' }];

const defaultLocale = localStorage.getItem('arco-locale') || 'zh-CN';

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'en-US',
  legacy: false,
  allowComposition: true,
  messages: {
    'zh-CN': cn,
  },
});

export default i18n;

// 距今为止业务并没有国际化的需求，仅使用i18n做显示信息的映射或者可复用的公共显示信息
// 例如业务数据库中用户角色为英文（admin、common等）
// 显示的时候需要显示为（系统管理员、系统用户）
