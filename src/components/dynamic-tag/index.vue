<script lang="ts" setup>
  import { InputInstance } from '@arco-design/web-vue';
  import { nextTick, ref, PropType } from 'vue';

  // v-model 双向绑定
  const model = defineModel<string[]>({ default: [] });

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
    // 标签显示值格式化函数
    formatTag: {
      type: Function as PropType<(value: string) => string>,
      default: (value: string) => value,
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
      type: Function,
      default: (item: string) => !!item,
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
    (event: 'change', value: string[]): void; // v-model 绑定值的变化
    (event: 'add-button-click'): void; // 点击新增按钮时（仅customMode为true时触发）
  }>();

  const showInput = ref<boolean>(false);
  const inputRef = ref<InputInstance>();
  const inputVal = ref<string>('');
  const validateStatus = ref<'success' | 'warning' | 'error' | 'validating'>();

  // 暴露给父组件的方法
  defineExpose({
    // 添加标签
    addTag: (value: string) => {
      if (props.totalCount !== -1 && model.value.length >= props.totalCount) {
        return false;
      }
      if (value && props.validate(value)) {
        model.value.push(value);
        if (props.uniqueValue) {
          model.value = [...new Set(model.value)];
        }
        emits('change', model.value);
        return true;
      }
      return false;
    },
    // 删除标签
    removeTag: (value: string) => {
      model.value = model.value.filter((itx) => itx !== value);
      if (props.uniqueValue) {
        model.value = [...new Set(model.value)];
      }
      emits('change', model.value);
    },
  });

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

  const handleAdd = () => {
    if (props.totalCount !== -1 && model.value.length >= props.totalCount) {
      inputVal.value = '';
      return;
    }
    if (inputVal.value) {
      if (!props.validate(inputVal.value)) {
        validateStatus.value = 'error';
        nextTick(() => {
          if (inputRef.value) {
            inputRef.value?.focus();
          }
        });
        return;
      }
      model.value.push(inputVal.value);
      if (props.uniqueValue) {
        model.value = [...new Set(model.value)];
      }
      inputVal.value = '';
      emits('change', model.value);
    }
    showInput.value = false;
  };

  const handleRemove = (key: string) => {
    const newModel = model.value.filter((itx) => itx !== key);
    if (props.uniqueValue) {
      model.value = [...new Set(newModel)];
    }
    emits('change', newModel);
  };
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
      :key="itx"
      closable
      :class="['!self-stretch', { 'w-full': vertical }]"
      :style="{
        'min-height':
          size === 'small' ? '28px' : size === 'medium' ? '32px' : '36px',
      }"
      @close="handleRemove(itx)"
    >
      <span class="flex-auto truncate">{{ formatTag(itx) }}</span>
    </a-tag>
    <!-- 超过 displayCount 限制显示数量 -->
    <a-tag
      v-if="displayCount !== -1 && model.length > displayCount"
      class="!h-full self-stretch"
    >
      ... 共 {{ model.length }} {{ displayUnit }}
    </a-tag>

    <a-form-item
      v-if="showInput"
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
      v-else-if="totalCount === -1 || model.length < totalCount"
      :size="size"
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
