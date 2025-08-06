module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-less',
    'stylelint-config-standard-vue',
    'stylelint-config-rational-order',
  ],
  defaultSeverity: 'warning',
  plugins: ['stylelint-order', 'stylelint-config-rational-order/plugin'],
  // 针对不同文件类型使用不同的解析器
  overrides: [
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    // 禁止未知的 at 规则（如 @import, @media 等）
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['plugin'], // 忽略 plugin 规则
      },
    ],
    // 强制使用现代的颜色函数表示法（如 rgb(), hsl() 等）
    'color-function-notation': [
      'modern',
      {
        ignore: ['with-var-inside'], // 忽略包含变量的颜色函数
      },
    ],
    // 规则前必须有空行
    'rule-empty-line-before': [
      'always',
      {
        except: ['after-single-line-comment', 'first-nested'],
        // 单行注释后和第一个嵌套规则除外
      },
    ],
    // 禁止未知的伪类选择器
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: [
          'deep', // Vue 深度选择器
          'global', // 全局选择器
          'slotted', // 插槽选择器
          // 其他需要忽略的伪类
        ],
      },
    ],
    // 禁止未知的伪元素选择器
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['deep', 'global', 'slotted'],
        // 忽略 Vue 相关的伪元素
      },
    ],
    // 禁止未知的函数
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['deep', 'global', 'slotted'], // 忽略 Vue 相关的函数
      },
    ],
    // CSS 属性排序规则（使用插件配置）
    'order/properties-order': [],
    // 使用 rational-order 插件进行属性排序
    'plugin/rational-order': [
      true,
      {
        'border-in-box-model': false, // 不将 border 视为盒模型属性
        'empty-line-between-groups': false, // 属性组之间不添加空行
      },
    ],
  },
};
