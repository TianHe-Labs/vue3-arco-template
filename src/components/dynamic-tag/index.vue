<script lang="ts" setup generic="T extends string | Record<string, any>">
  import { nextTick, ref, PropType, VNode, watch, h } from 'vue';
  import { InputInstance } from '@arco-design/web-vue';

  // v-model 双向绑定 - 存储标签数组
  const model = defineModel<T[]>({ default: [] });

  // 组件属性定义
  const props = defineProps({
    // 大小
    size: {
      type: String as PropType<'small' | 'medium' | 'large' | undefined>,
      default: 'small',
    },
    // 是否启用唯一值模式 - 防止重复添加相同的标签
    uniqueValue: {
      type: Boolean,
      default: true,
    },
    // 是否禁用组件 - 禁用后无法添加/删除标签
    disabled: {
      type: Boolean,
      default: false,
    },
    // 标签图标格式化函数 - 用于自定义每个标签的图标显示
    formatIcon: {
      type: Function as PropType<(value: T) => VNode | undefined>,
      default: undefined,
    },
    // 标签显示值格式化函数 - 用于自定义标签内容的显示方式
    // 可以返回字符串或 VNode，支持复杂的自定义渲染
    formatTag: {
      type: Function as PropType<(value: T) => VNode | string>,
      default: (value: T) =>
        typeof value === 'string'
          ? h('span', {}, value)
          : h('span', {}, JSON.stringify(value)),
    },
    // 对象数组的唯一性标识属性名
    // 当 T 为对象类型时，用于确定对象是否重复
    valueKey: {
      type: String,
      default: '',
    },
    // 删除前的回调函数 - 返回 true 继续删除，返回 false 取消删除
    // 支持异步操作，可以用于删除前的确认或验证
    beforeRemove: {
      type: Function as PropType<(item: T) => boolean | Promise<boolean>>,
      default: undefined,
    },
    // 最大标签数量限制 - -1 表示无限制
    totalCount: {
      type: Number,
      default: -1,
    },
    // 最大显示数量 - 超过此数量会显示省略号
    // -1 表示不限制显示数量
    displayCount: {
      type: Number,
      default: -1,
    },
    // 显示单位 - 用于省略号显示时的单位文本
    displayUnit: {
      type: String,
      default: '个',
    },
    // 输入验证函数 - 用于验证新添加的标签是否有效
    validate: {
      type: Function as PropType<(item: T) => boolean>,
      default: (item: T) => !!item,
    },
    // 校验失败时的错误提示信息
    validateMessage: {
      type: String,
      default: '格式校验不通过',
    },
    // 输入框占位符文本
    placeholder: {
      type: String,
      default: '输入内容回车添加',
    },
    // 自定义模式开关
    // true: 点击新增按钮不显示输入框，而是触发 add-button-click 事件
    // false: 点击新增按钮显示输入框进行输入
    customMode: {
      type: Boolean,
      default: false,
    },
    // 新增按钮的显示文本
    addButtonText: {
      type: String,
      default: '新增',
    },
  });

  // 组件事件定义
  const emits = defineEmits<{
    (event: 'add-button-click'): void; // 点击新增按钮时（仅customMode为true时触发）
    (event: 'change', value: T[]): void; // v-model 绑定值的变化
    (event: 'add', item: T, newValue: T[]): void; // 添加标签时触发
    (event: 'remove', item: T, newValue: T[]): void; // 删除标签时触发
  }>();

  // 响应式数据
  const showInput = ref<boolean>(false); // 控制输入框显示/隐藏
  const inputRef = ref<InputInstance>(); // 输入框实例引用
  const inputVal = ref<T extends string ? string : T>(); // 输入框的值
  const validateStatus = ref<'success' | 'warning' | 'error' | 'validating'>(); // 验证状态

  /**
   * 比较两个值是否相等
   * 支持字符串和对象的比较
   * 对于对象类型，优先使用 valueKey 进行比较，否则使用 JSON.stringify 比较
   */
  const isEqual = (a: T, b: T): boolean => {
    if (typeof a === 'string' && typeof b === 'string') {
      return a === b;
    }
    if (typeof a === 'object' && typeof b === 'object' && a && b) {
      if (props.valueKey) {
        return a[props.valueKey] === b[props.valueKey];
      }
      console.log('a', a);
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return false;
  };

  /**
   * 点击新增按钮的处理函数
   * 根据 customMode 决定是显示输入框还是触发事件
   */
  const handleEdit = () => {
    if (props.customMode) {
      // 自定义模式下，触发 add-button-click 事件
      emits('add-button-click');
      return;
    }
    // 普通模式下，显示输入框并聚焦
    showInput.value = true;
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value?.focus();
      }
    });
  };

  /**
   * 输入框输入回车或失焦时添加标签
   * 包含数量限制、验证、去重等逻辑
   */
  const handleAdd = () => {
    // 检查是否超过最大数量限制
    if (props.totalCount !== -1 && model.value.length >= props.totalCount) {
      inputVal.value = undefined;
      return;
    }

    if (inputVal.value) {
      // 验证输入值
      if (!props.validate(inputVal.value as T)) {
        validateStatus.value = 'error';
        nextTick(() => {
          if (inputRef.value) {
            inputRef.value?.focus();
          }
        });
        return;
      }

      // 添加新标签
      model.value.push(inputVal.value as T);

      // 如果启用唯一值模式，进行去重处理
      if (props.uniqueValue) {
        model.value = model.value.filter(
          (item, index, self) =>
            index === self.findIndex((t) => isEqual(t, item)),
        );
      }

      // 触发相关事件
      emits('change', model.value);
      emits('add', inputVal.value as T, model.value);

      // 清空输入框并隐藏
      inputVal.value = undefined;
    }
    showInput.value = false;
  };

  /**
   * 执行删除操作的核心函数
   * 从数组中移除指定项并触发事件
   */
  const doRemove = (item: T) => {
    const newModel = model.value.filter((itx) => !isEqual(itx, item));
    if (props.uniqueValue) {
      model.value = newModel.filter(
        (item, index, self) =>
          index === self.findIndex((t) => isEqual(t, item)),
      );
    }
    emits('change', newModel);
    emits('remove', item, newModel);
  };

  /**
   * 点击标签删除按钮的处理函数
   * 支持 beforeRemove 回调进行删除前的确认
   */
  const handleRemove = async (item: T) => {
    // 如果有 beforeRemove 回调，则等待其执行完成
    if (props.beforeRemove) {
      try {
        const shouldRemove = await Promise.resolve(props.beforeRemove(item));
        if (!shouldRemove) {
          return;
        }
      } catch (error) {
        console.error('Error in beforeRemove callback:', error);
        return;
      }
    }

    doRemove(item);
  };

  /**
   * 监听 model.value 的变化
   * 当用户在外部直接修改绑定的 model 值时，进行去重处理并触发事件
   */
  watch(model.value, (newVal) => {
    // 如果启用唯一值模式，进行去重过滤
    if (props.uniqueValue) {
      model.value = newVal.filter(
        (item, index, self) =>
          index === self.findIndex((t) => isEqual(t, item)),
      );
    }
    // 触发 change 事件
    emits('change', newVal);
  });

  /**
   * 暴露给父组件的方法
   * 通过组件内的方法可以触发校验和操作
   */
  defineExpose({
    /**
     * 添加标签方法
     * @param value 要添加的标签值
     * @returns 是否添加成功
     */
    addTag: (value: T) => {
      // 检查数量限制
      if (props.totalCount !== -1 && model.value.length >= props.totalCount) {
        return false;
      }

      // 验证并添加标签
      if (value && props.validate(value)) {
        model.value.push(value);

        // 去重处理
        if (props.uniqueValue) {
          model.value = model.value.filter(
            (item, index, self) =>
              index === self.findIndex((t) => isEqual(t, item)),
          );
        }

        // 触发事件
        emits('change', model.value);
        emits('add', value, model.value);
        return true;
      }
      return false;
    },

    /**
     * 删除标签方法
     * @param value 要删除的标签值
     */
    removeTag: (value: T) => {
      model.value = model.value.filter((itx) => !isEqual(itx, value));

      // 去重处理
      if (props.uniqueValue) {
        model.value = model.value.filter(
          (item, index, self) =>
            index === self.findIndex((t) => isEqual(t, item)),
        );
      }

      // 触发事件
      emits('change', model.value);
      emits('remove', value, model.value);
    },
  });
</script>

<template>
  <div class="max-w-full gap-2">
    <!-- 标签列表 - 根据 displayCount 限制显示数量 -->
    <a-tag
      v-for="itx in model.slice(
        0,
        displayCount === -1 ? model.length : displayCount,
      )"
      :key="
        typeof itx === 'string'
          ? itx
          : itx?.[props.valueKey] || JSON.stringify(itx)
      "
      :style="{
        'min-height':
          size === 'small' ? '28px' : size === 'medium' ? '32px' : '36px',
      }"
    >
      <!-- 标签图标插槽 -->
      <template #icon>
        <!-- 具名插槽方式，支持自定义图标 -->
        <slot name="icon" :item="itx">
          <component :is="formatIcon?.(itx)" v-if="formatIcon" />
        </slot>
      </template>

      <!-- 标签内容插槽 -->
      <span class="flex-auto truncate">
        <slot name="default" :item="itx">
          <!-- 根据需要返回字符串或 VNode，组件会自动选择最合适的渲染方式 -->
          <template v-if="typeof formatTag(itx) === 'string'">
            {{ formatTag(itx) }}
          </template>
          <component v-else :is="formatTag(itx)" />
        </slot>
      </span>
      <!-- tag 的关闭按钮会直接关闭到tag，无法进行诸如回掉自定义等操作 -->
      <!-- <template #close-icon>
        <slot name="close-icon" />
      </template> -->
      <!-- 删除按钮 - 仅在非禁用状态下显示 -->
      <span
        v-if="!disabled"
        class="flex-none arco-icon-hover arco-tag-icon-hover arco-tag-close-btn"
        role="button"
        aria-label="Close"
        @click="handleRemove(itx)"
      >
        <slot name="close-icon">
          <icon-close />
        </slot>
      </span>
    </a-tag>

    <!-- 超过 displayCount 限制时的省略号显示 -->
    <a-tag
      v-if="displayCount !== -1 && model.length > displayCount"
      class="!h-full self-stretch"
    >
      ... 共 {{ model.length }} {{ displayUnit }}
    </a-tag>

    <!-- 输入框 - 仅在非禁用且显示输入框时显示 -->
    <a-form-item
      v-if="!disabled && showInput"
      :size="size"
      :validate-status="validateStatus"
      :help="validateStatus === 'error' ? validateMessage : ''"
      hide-label
      row-class="relative !w-max !mb-0"
      content-class="!h-min !min-h-min"
      :wrapper-col-style="{ minHeight: 'min-content' }"
    >
      <a-input
        ref="inputRef"
        v-model.trim="inputVal"
        allow-clear
        :size="size"
        :placeholder="placeholder"
        class="!min-w-60px !w-auto !flex-auto"
        @keyup.enter="handleAdd"
        @blur="handleAdd"
      />
    </a-form-item>

    <!-- 新增按钮 - 仅在非禁用且未达到最大数量时显示 -->
    <a-button
      v-else-if="!disabled && (totalCount === -1 || model.length < totalCount)"
      :size="size"
      type="dashed"
      class="!flex !px-2"
      @click="handleEdit"
    >
      <template #icon>
        <icon-plus />
      </template>
      {{ addButtonText }}
    </a-button>
  </div>
</template>

<style lang="less" scoped>
  /* 标签样式调整 */
  :deep(.arco-tag) {
    position: relative;
  }

  /* 表单验证消息样式调整 */
  :deep(.arco-form-item-message) {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
  }
</style>
