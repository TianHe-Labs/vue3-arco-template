<script lang="ts" setup>
  import { InputInstance } from '@arco-design/web-vue';
  import { cloneDeep } from 'lodash';
  import { nextTick, ref, PropType } from 'vue';

  // v-model 双向绑定
  const model = defineModel<string[]>({ default: [] });

  // 组件属性
  const props = defineProps({
    // 大小
    size: {
      type: String as PropType<
        'small' | 'medium' | 'large' | 'mini' | undefined
      >,
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
      default: 1, // -1 表示不限制显示数量
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
  });

  const emits = defineEmits<{
    (event: 'change', value: string[]): void; // v-model 绑定值的变化
    (event: 'add-button-click'): void; // 点击新增按钮时（仅customMode为true时触发）
  }>();

  const showInput = ref<boolean>(false);
  const inputRef = ref<InputInstance>();
  const inputVal = ref<string>('');

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
    if (inputVal.value && props.validate(inputVal.value)) {
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
  <div class="flex flex-wrap items-center gap-2">
    <!-- displayCount 限制显示数量 -->
    <a-tag
      v-for="itx in model.slice(0, displayCount)"
      :key="itx"
      closable
      class="!h-full self-stretch"
      @close="handleRemove(itx)"
    >
      {{ formatTag(itx) }}
    </a-tag>
    <!-- 超过 displayCount 限制显示数量 -->
    <a-tag
      v-if="displayCount !== -1 && model.length > displayCount"
      class="!h-full self-stretch"
    >
      ... 共 {{ model.length }} {{ displayUnit }}
    </a-tag>

    <a-input
      v-if="showInput"
      ref="inputRef"
      v-model.trim="inputVal"
      :size="size"
      :placeholder="placeholder"
      class="!min-w-60px !w-auto !flex-auto"
      @keyup.enter="handleAdd"
      @blur="handleAdd"
    />
    <a-button
      v-else
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
