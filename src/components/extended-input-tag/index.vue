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
    // 是否允许清空所有标签
    allowClear: {
      type: Boolean,
      default: true,
    },
    // 是否只允许唯一值（防止重复标签）
    uniqueValue: {
      type: Boolean,
      default: true,
    },
    // 输入框占位符文本
    placeholder: {
      type: String,
      default: '输入内容，支持回车、逗号、分号、顿号分隔',
    },
    // 标签总数限制，-1 表示不限制显示数量
    totalCount: {
      type: Number,
      default: -1, // -1 表示不限制显示数量
    },
    // 标签验证函数，用于过滤无效的输入内容
    validate: {
      type: Function,
      default: (item: string) => !!item, // 默认验证：非空字符串
    },
  });

  // 定义组件的事件发射器
  const emits = defineEmits([
    'input-value-change:inputValue', // 输入值变化事件
    'change', // 标签值变化事件
    'press-enter', // 回车键事件
  ]);

  // 输入框的当前值
  const input = ref<string>('');

  // 使用防抖监听输入值变化，处理分隔符输入：逗号、分号、顿号等
  watchDebounced(
    input,
    () => {
      // 检查是否达到标签数量限制
      if (
        props.totalCount !== -1 &&
        model.value &&
        model.value.length >= props.totalCount
      ) {
        input.value = ''; // 清空输入框
        return;
      }

      // 处理输入内容
      if (input.value) {
        // 使用正则表达式分割输入内容
        // 支持的分隔符：逗号(,)、中文逗号(，)、分号(;)、中文分号(；)、顿号(、)
        // \s* 匹配任意空白字符，确保分割后的内容去除首尾空格
        const splited = input.value.split(/\s*(?:,|，|;|；|、|$)\s*/);

        // 过滤并验证分割后的内容，只保留通过验证的项
        const cleaned = splited.filter((item) => props.validate(item));

        // 将验证通过的内容添加到模型中
        model.value = model.value?.concat(cleaned);

        // 清空输入框，准备下一次输入
        input.value = '';
      }
    },
    { debounce: 500 }, // 500ms 防抖延迟，避免频繁触发
  );
</script>
