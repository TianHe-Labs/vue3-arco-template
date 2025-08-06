# Data 模块 AI 辅助编程上下文

## 概述

本文档专门分析 `src/views/data` 目录中检索、详情等页面的代码功能、组织逻辑、代码风格和命名规范，为 AI 在开发 data 模块相关功能时提供上下文指导。

## 目录结构

```
src/views/data/
├── search/                    # 检索页面
│   ├── index.vue             # 主页面入口
│   ├── components/           # 页面组件
│   │   ├── filter.vue        # 过滤组件
│   │   ├── table.vue         # 表格组件
│   │   ├── create-update-panel.vue  # 创建/更新面板
│   │   └── batch-create-panel.vue   # 批量创建面板
│   └── composables/          # 组合式函数
│       ├── search.ts         # 搜索逻辑
│       ├── create-update.ts  # 创建/更新逻辑
│       ├── batch-create.ts   # 批量创建逻辑
│       └── batch-operate.ts  # 批量操作逻辑
└── detail/                   # 详情页面
    ├── index.vue             # 主页面入口
    └── components/           # 页面组件
        └── basic-info.vue    # 基本信息组件
```

## 核心设计理念

### 1. 代码复用与逻辑分离

- **组合式函数复用**: 通过 `composables` 目录将业务逻辑抽离，实现跨页面复用
- **组件复用**: 详情页面复用检索页面的组件和逻辑，减少重复代码
- **API 接口复用**: 通过参数控制，一个接口支持多种场景（列表查询、详情查询）

### 2. 响应式数据流

- 使用 `provide/inject` 模式在页面级别提供状态
- 组件通过 `useXxxx` 函数获取状态，实现松耦合
- 支持外部传入查询条件，实现灵活的查询控制

### 3. 类型安全

- 完整的 TypeScript 类型定义
- 接口类型与业务模型严格对应
- 全局类型定义统一管理

## 功能模块分析

### 1. 检索页面 (`search/index.vue`)

**功能特点:**

- 面包屑导航
- 过滤条件组件
- 数据表格展示
- 创建/更新面板
- 批量创建面板

**代码组织:**

```typescript
// 通过 provide 提供状态，组件通过 useXxxx 获取
provideSearchXxxx(ref({}));
provideCreateUpdateXxxx();
provideBatchCreateXxxx();
provideBatchOperateXxxx();
```

### 2. 详情页面 (`detail/index.vue`)

**功能特点:**

- 复用检索逻辑，传入 ID 查询详情
- 展示基本信息
- 支持信息更新

**代码组织:**

```typescript
// 复用检索逻辑，传入 id 查询详情
provideSearchXxxx(computed(() => ({ id: props.id })));
// 复用创建/更新逻辑
provideCreateUpdateXxxx();
```

### 3. 搜索逻辑 (`search/composables/search.ts`)

**核心功能:**

- 分页查询
- 条件过滤
- 模糊搜索
- 数据导出
- 前端数据更新

**关键设计:**

```typescript
// 支持外部传入查询条件
export function provideSearchXxxx(
  queries: Ref<Partial<QueryXxxxListReq>>,
): SearchXxxxState

// 前端数据更新机制
onUpdateRenderData: (data: {
  type: 'update' | 'create' | 'delete';
  record?: XxxxModel;
  records?: XxxxModel[];
  ids?: XxxxModel['id'][];
}) => void;
```

### 4. 创建/更新逻辑 (`search/composables/create-update.ts`)

**核心功能:**

- 创建和更新共用弹窗
- 表单验证
- 提交处理
- 回调机制

**关键设计:**

```typescript
// 通过 ID 判断创建还是更新
if (createUpdateXxxxModel.value?.id) {
  // 更新逻辑
} else {
  // 创建逻辑
}

// 支持回调处理后续操作
handleSubmitCreateUpdateXxxx: (
  callback?: (...args: any) => void | Promise<void>,
) => Promise<boolean>;
```

### 5. 批量操作逻辑 (`search/composables/batch-operate.ts`)

**核心功能:**

- 批量选择
- 批量删除
- 选择状态管理

**关键设计:**

```typescript
// 选择状态管理
const selectionState = reactive<SelectionState>({
  visible: false,
  checked: [],
});

// 支持单个或批量删除
handleSubmitDeleteXxxx: (ids?: XxxxModel['id'][], callback?: any) =>
  Promise<void>;
```

## 代码风格规范

### 1. 命名规范

**文件命名:**

- 组件文件使用 kebab-case: `create-update-panel.vue`
- 组合式函数使用 camelCase: `create-update.ts`
- 页面入口使用 `index.vue`

**函数命名:**

- 提供函数: `provideXxxx`
- 使用函数: `useXxxx`
- 事件处理: `handleXxxx`
- 状态重置: `resetXxxx`

**变量命名:**

- 响应式数据: `xxxModel`
- 表单引用: `xxxFormRef`
- 面板可见性: `xxxPanelVisible`

### 2. 代码组织

**组件结构:**

```vue
<script lang="ts" setup>
  // 1. 导入依赖
  import { ref } from 'vue';
  import { useXxxx } from './composables/xxx';

  // 2. 获取状态
  const { state1, state2 } = useXxxx();

  // 3. 计算属性
  const computedValue = computed(() => {});

  // 4. 事件处理
  const handleEvent = () => {};
</script>

<template>
  <!-- 模板内容 -->
</template>
```

**组合式函数结构:**

```typescript
// 1. 导入依赖
import { provide, inject, Ref, reactive, ref } from 'vue';

// 2. 类型定义
interface XxxxState {
  // 状态定义
}

// 3. 常量定义
const symbol = Symbol('XXXX');

// 4. 重置函数
const resetXxxxModel = (): XxxxModel => {
  return {
    // 默认值
  };
};

// 5. 提供函数
export function provideXxxx(): XxxxState {
  // 实现逻辑
}

// 6. 使用函数
export function useXxxx(): XxxxState {
  return inject(symbol) as XxxxState;
}
```

### 3. 类型安全

**接口定义:**

```typescript
// API 模型
export interface XxxxModel {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

// 查询参数
export interface QueryXxxxListReq extends Partial<XxxxModel> {
  createdRange?: string[];
}

// 创建/更新模型
export type CreateUpdateXxxxModel = Partial<
  Pick<XxxxModel, 'id' | 'name' | 'description' | 'tags'>
>;
```

**全局类型:**

```typescript
// 分页
export interface Pagination {
  current: number;
  pageSize: number;
}

// 列表响应
export interface List<T> {
  total?: number;
  list: T[];
}

// 选择状态
export interface SelectionState {
  visible: boolean;
  checked: string[];
}
```

### 4. 响应式设计

**状态管理:**

```typescript
// 使用 ref 管理简单状态
const loading = ref<boolean>(false);

// 使用 reactive 管理复杂状态
const selectionState = reactive<SelectionState>({
  visible: false,
  checked: [],
});

// 使用 shallowRef 管理组件实例
const formRef = shallowRef<FormInstance>();
```

**数据流:**

```typescript
// 提供状态
provide(symbol, state);

// 注入状态
const state = inject(symbol) as StateType;

// 响应式查询条件
const queries = ref<Partial<QueryReq>>({});
provideSearchXxxx(queries);
```

## 最佳实践

### 1. 组件设计

- **单一职责**: 每个组件只负责一个功能模块
- **可复用性**: 通过 props 和插槽实现组件复用
- **松耦合**: 通过组合式函数解耦业务逻辑

### 2. 状态管理

- **本地状态**: 使用 `ref` 和 `reactive` 管理组件状态
- **共享状态**: 使用 `provide/inject` 在页面级别共享状态
- **响应式更新**: 通过回调机制实现数据同步

### 3. 错误处理

- **表单验证**: 使用 Arco Design 的表单验证机制
- **API 错误**: 统一的错误处理和用户提示
- **用户确认**: 重要操作使用确认弹窗

### 4. 性能优化

- **懒加载**: 组件按需加载
- **虚拟滚动**: 大数据量表格使用虚拟滚动
- **防抖节流**: 搜索输入使用防抖处理

## 扩展指南

### 1. 新增业务模块

1. 复制现有模块结构
2. 修改命名（将 Xxxx 替换为具体业务名称）
3. 调整 API 接口和类型定义
4. 根据业务需求调整组件功能

### 2. 添加新功能

1. 在 `composables` 中添加新的组合式函数
2. 在 `components` 中添加新的组件
3. 在主页面中集成新功能
4. 更新类型定义

### 3. 自定义组件

1. 遵循现有的命名规范
2. 使用 TypeScript 定义 props 和 emits
3. 提供合理的默认值和验证
4. 支持插槽和事件

## 注意事项

1. **命名一致性**: 保持函数、变量、文件的命名风格一致
2. **类型安全**: 所有函数和变量都要有明确的类型定义
3. **错误处理**: 重要操作要有适当的错误处理和用户反馈
4. **性能考虑**: 避免不必要的响应式更新和重复渲染
5. **代码复用**: 优先考虑复用现有逻辑，避免重复代码

## 总结

Data 模块采用了现代化的 Vue3 + TypeScript 技术栈，通过组合式函数实现了良好的代码复用和逻辑分离。代码结构清晰，类型安全，具有良好的可维护性和扩展性。这种设计模式可以作为其他业务模块的参考模板，特别是在开发类似的 CRUD 功能时。
