import Mock from 'mockjs';

// 自动导入所有 mock server 文件
import.meta.glob('./_servers/*.ts', { eager: true });

Mock.setup({
  timeout: '600-1000',
});
