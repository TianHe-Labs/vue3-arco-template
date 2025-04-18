<template>
  <a-input-tag
    v-model:model-value="model"
    v-model:input-value="input"
    :allow-clear="allowClear"
    :unique-value="uniqueValue"
    :placeholder="placeholder"
    @change="(value: any, event: any) => emits('change', value, event)"
    @press-enter="
      (inputValue: any, event: any) => emits('press-enter', inputValue, event)
    "
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { TagData } from '@arco-design/web-vue';
  import { watchDebounced } from '@vueuse/core';

  type ModelType = (string | number | TagData)[];

  const model = defineModel<ModelType>({ default: () => [] });

  const props = defineProps({
    allowClear: {
      type: Boolean,
      default: true,
    },
    uniqueValue: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '输入内容，支持回车、逗号、分号、顿号分隔',
    },
    totalCount: {
      type: Number,
      default: -1, // -1 表示不限制显示数量
    },
    validate: {
      type: Function,
      default: (item: string) => !!item,
    },
  });

  const emits = defineEmits([
    'input-value-change:inputValue',
    'change',
    'press-enter',
  ]);

  const input = ref<string>('');

  // 监听逗号、分号、顿号等分隔符
  watchDebounced(
    input,
    () => {
      if (
        props.totalCount !== -1 &&
        model.value &&
        model.value.length >= props.totalCount
      ) {
        input.value = '';
        return;
      }
      if (input.value) {
        // 逗号、分号、顿号等分隔符时触发
        // 或者用户不操作后触发
        // && input.value.search(/,|，|;|；|、/) !== -1
        const splited = input.value.split(/\s*(?:,|，|;|；|、|$)\s*/);
        const cleaned = splited.filter((item) => props.validate(item));
        model.value = model.value?.concat(cleaned);
        input.value = '';
      }
    },
    { debounce: 500 },
  );
</script>
