import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

import App from './App.vue';
import globalComponents from './components';
import router from './router';
import store from './store';
import i18n from './locale';
import directives from './directives';

import 'virtual:uno.css';
// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import '@/assets/style/global.less';
import '@/plugins/axios';
import BrowserChecker from './plugins/browser-checker';
import Fingerprint from './plugins/fingerprint';
// import UpdateChecker from './plugins/update-checker';

import './mock';

// 添加无限debugger逻辑，防止代码被调试
// if (process.env.NODE_ENV !== 'development') {
//   (() => {
//     // 使用 Performance API 记录性能数据
//     const createdEntry = performance.getEntriesByType('navigation')[0];
//     const ceratedTiming = JSON.stringify(createdEntry);

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const start = performance.now();
//     for (let i = 0; i < 1000000; i += 1) {
//       // 简单的循环操作
//     }
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const end = performance.now();

//     // 再次获取性能数据
//     const updatedEntry = performance.getEntriesByType('navigation')[0];
//     const updatedTiming = JSON.stringify(updatedEntry);

//     if (
//       Math.abs(
//         JSON.parse(updatedTiming).startTime -
//           JSON.parse(ceratedTiming).startTime
//       ) > 100
//     ) {
//       // eslint-disable-next-line no-console
//       console.error('检测到代码攻击，页面已崩溃！请关闭后刷新重试！');
//     }
//     if (
//       window.outerHeight - window.innerHeight > 200 ||
//       window.outerWidth - window.innerWidth > 200
//     ) {
//       // 通过窗口判断
//       // 如果提前把开发者面板独立处理，判断就失效了
//       document.body.innerHTML =
//         '检测到代码攻击，页面已崩溃！请关闭后刷新重试！';
//     }
//     // 如果检测到开发者工具打开，进入无限debugger循环
//     // eslint-disable-next-line no-console
//     console.log('检测到代码攻击，页面已崩溃！请关闭后刷新重试！');

//     // 修改默认的console.log
//     // 保存原始的console.log方法
//     // eslint-disable-next-line no-console
//     const originalLog = console.log;
//     // 重新定义console.log方法
//     Object.defineProperty(console, 'log', {
//       value(...args: any[]) {
//         // 检查是否在开发者工具中调用
//         try {
//           const error = new Error();
//           if (error.stack && error.stack.includes('console.log')) {
//             // 可以在这里添加阻止操作或提示用户的代码
//             // eslint-disable-next-line no-console
//             console.error('检测到代码攻击，页面已崩溃！请关闭后刷新重试！');
//           } else {
//             // 如果不是在开发者工具中调用，执行原始的console.log
//             originalLog.apply(console, args);
//           }
//         } catch (err) {
//           // pass
//         }
//       },
//       configurable: true,
//       writable: true,
//     });

//     // 禁止调试
//     setInterval(() => {
//       (() => {
//         return false;
//       })
//         [
//           // eslint-disable-next-line dot-notation
//           'constructor'
//         ]('debugger')
//         [
//           // eslint-disable-next-line dot-notation
//           'call'
//         ]();
//       // 将 debugger 搞得复杂些
//     }, 50);
//   })();
// }

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directives);

// 浏览器检测
app.use(BrowserChecker);
// 设备指纹
app.use(Fingerprint);
// 更新检查
// app.use(UpdateChecker);

app.mount('#app');
