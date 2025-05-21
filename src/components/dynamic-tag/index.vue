<script lang="ts" setup generic="T extends string | Record<string, any>">
  import { nextTick, ref, PropType, VNode, watch, h } from 'vue';
  import { InputInstance } from '@arco-design/web-vue';

  // v-model 双向绑定
  const model = defineModel<T[]>({ default: [] });

  // 组件属性
  const props = defineProps({
    // 大小
    size: {
      type: String as PropType<'small' | 'medium' | 'large' | undefined>,
      default: 'small',
    },
    // 是否唯一值
    uniqueValue: {
      type: Boolean,
      default: true,
    },
    // 是否显示删除按钮
    disabled: {
      type: Boolean,
      default: false,
    },
    // 标题图标格式化函数
    formatIcon: {
      type: Function as PropType<(value: T) => VNode | undefined>,
      default: undefined,
    },
    // 标签显示值格式化函数
    formatTag: {
      type: Function as PropType<(value: T) => VNode | string>,
      default: (value: T) =>
        typeof value === 'string'
          ? h('span', {}, value)
          : h('span', {}, JSON.stringify(value)),
    },
    // 如果model是对象数组，则用于标识对象数组中唯一性的属性名
    valueKey: {
      type: String,
      default: '',
    },
    // 删除前的回调函数，返回 true 或 Promise<true> 则继续删除，返回 false 或 Promise<false> 则取消删除
    beforeRemove: {
      type: Function as PropType<(item: T) => boolean | Promise<boolean>>,
      default: undefined,
    },
    // 最大数量
    totalCount: {
      type: Number,
      default: -1,
    },
    // 最大显示数量
    displayCount: {
      type: Number,
      default: -1, // -1 表示不限制显示数量
    },
    // 单位
    displayUnit: {
      type: String,
      default: '个',
    },
    // 输入验证函数
    validate: {
      type: Function as PropType<(item: T) => boolean>,
      default: (item: T) => !!item,
    },
    // 校验不通过时的消息提示
    validateMessage: {
      type: String,
      default: '格式校验不通过',
    },
    // 输入框占位符
    placeholder: {
      type: String,
      default: '输入内容回车添加',
    },
    // 是否使用自定义模式
    // true 点击新增按钮不会显示输入框，而是触发add-button-click事件
    customMode: {
      type: Boolean,
      default: false,
    },
    // 新增按钮文本
    addButtonText: {
      type: String,
      default: '新增',
    },
    // 是否垂直排列标签
    vertical: {
      type: Boolean,
      default: false,
    },
  });

  const emits = defineEmits<{
    (event: 'add-button-click'): void; // 点击新增按钮时（仅customMode为true时触发）
    (event: 'change', value: T[]): void; // v-model 绑定值的变化
    (event: 'add', item: T, newValue: T[]): void; // 添加标签时触发
    (event: 'remove', item: T, newValue: T[]): void; // 删除标签时触发
  }>();

  const showInput = ref<boolean>(false);
  const inputRef = ref<InputInstance>();
  const inputVal = ref<T extends string ? string : T>();
  const validateStatus = ref<'success' | 'warning' | 'error' | 'validating'>();

  // 比较两个值是否相等
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

  // 点击新增按钮
  const handleEdit = () => {
    if (props.customMode) {
      //自定义模式下，触发add-button-click事件
      emits('add-button-click');
      return;
    }
    showInput.value = true;
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value?.focus();
      }
    });
  };

  // 输入框输入回车添加
  const handleAdd = () => {
    if (props.totalCount !== -1 && model.value.length >= props.totalCount) {
      inputVal.value = undefined;
      return;
    }
    if (inputVal.value) {
      if (!props.validate(inputVal.value as T)) {
        validateStatus.value = 'error';
        nextTick(() => {
          if (inputRef.value) {
            inputRef.value?.focus();
          }
        });
        return;
      }
      model.value.push(inputVal.value as T);
      if (props.uniqueValue) {
        model.value = model.value.filter(
          (item, index, self) =>
            index === self.findIndex((t) => isEqual(t, item)),
        );
      }
      emits('change', model.value);
      emits('add', inputVal.value as T, model.value);
      // 清空输入框
      inputVal.value = undefined;
    }
    showInput.value = false;
  };

  // 执行删除操作
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

  // 点击标签删除
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

  // 监听model.value的变化
  // 如果用户在外部直接修改绑定的 model 值，也可以触发change事件、过滤
  watch(model.value, (newVal) => {
    // 过滤
    if (props.uniqueValue) {
      model.value = newVal.filter(
        (item, index, self) =>
          index === self.findIndex((t) => isEqual(t, item)),
      );
    }
    // 触发事件
    emits('change', newVal);
  });

  // 暴露给父组件的方法
  // 通过组件内的方法可以触发校验
  defineExpose({
    // 添加标签
    addTag: (value: T) => {
      if (props.totalCount !== -1 && model.value.length >= props.totalCount) {
        return false;
      }
      if (value && props.validate(value)) {
        model.value.push(value);
        if (props.uniqueValue) {
          model.value = model.value.filter(
            (item, index, self) =>
              index === self.findIndex((t) => isEqual(t, item)),
          );
        }
        emits('change', model.value);
        emits('add', value, model.value);
        return true;
      }
      return false;
    },
    // 删除标签
    removeTag: (value: T) => {
      model.value = model.value.filter((itx) => !isEqual(itx, value));
      if (props.uniqueValue) {
        model.value = model.value.filter(
          (item, index, self) =>
            index === self.findIndex((t) => isEqual(t, item)),
        );
      }
      emits('change', model.value);
      emits('remove', value, model.value);
    },
  });
</script>

<template>
  <div
    :class="[
      'max-w-full flex flex-wrap gap-2',
      { 'flex-col items-start': vertical },
    ]"
  >
    <!-- displayCount 限制显示数量 -->
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
      :class="['!self-stretch', { 'w-full': vertical }]"
      :style="{
        'min-height':
          size === 'small' ? '28px' : size === 'medium' ? '32px' : '36px',
      }"
    >
      <!-- 图标 -->
      <template #icon>
        <!-- 具名插槽方式 -->
        <slot name="icon" :item="itx">
          <component :is="formatIcon?.(itx)" v-if="formatIcon" />
        </slot>
      </template>
      <!-- 内容 -->
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
      <!-- 删除按钮 -->
      <span
        v-if="!disabled"
        class="arco-icon-hover arco-tag-icon-hover arco-tag-close-btn"
        role="button"
        aria-label="Close"
        @click="handleRemove(itx)"
      >
        <slot name="close-icon" />
      </span>
    </a-tag>
    <!-- 超过 displayCount 限制显示数量 -->
    <a-tag
      v-if="displayCount !== -1 && model.length > displayCount"
      class="!h-full self-stretch"
    >
      ... 共 {{ model.length }} {{ displayUnit }}
    </a-tag>

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
    <a-button
      v-else-if="!disabled && (totalCount === -1 || model.length < totalCount)"
      :size="size"
      :long="vertical"
      type="dashed"
      class="!px-2"
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
  :deep(.arco-tag) {
    position: relative;
  }

  :deep(.arco-form-item-message) {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
  }
</style>
