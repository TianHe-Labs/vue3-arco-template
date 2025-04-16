<template>
  <a-input-tag
    v-model:model-value="value"
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
  import { ref, computed } from 'vue';
  import { TagData } from '@arco-design/web-vue';
  import { watchDebounced } from '@vueuse/core';

  type ModelType = (string | number | TagData)[];

  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => [],
    },
    /* inputValue: {
      type: String,
      default: '',
    }, */
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
      default: '',
    },
    length: {
      type: Number,
      default: -1,
    },
    validate: {
      type: Function,
      default: (item: string) => !!item,
    },
  });

  const emits = defineEmits([
    'update:modelValue',
    'input-value-change:inputValue',
    'change',
    'press-enter',
  ]);

  const value = computed<ModelType>({
    get: () => props.modelValue as ModelType,
    set: (val) => {
      // eslint-disable-next-line vue/custom-event-name-casing
      emits('update:modelValue', val);
    },
  });

  const input = ref<string>('');

  // 监听逗号、分号、顿号等分隔符
  watchDebounced(
    input,
    () => {
      if (
        props.length !== -1 &&
        value.value &&
        value.value.length >= props.length
      ) {
        input.value = '';
        return;
      }
      if (input.value && input.value.search(/,|，|;|；|、/) !== -1) {
        const splited = input.value.split(/\s*(?:,|，|;|；|、|$)\s*/);
        const cleaned = splited.filter((item) => props.validate(item));
        value.value = value.value?.concat(cleaned);
        input.value = '';
      }
    },
    { debounce: 300 },
  );
</script>
