<script lang="ts" setup>
  interface Props {
    type: string;
    name: string;
    defaultValue: number | boolean;
  }

  interface Emits {
    (event: 'change', value: any, name: string): void;
  }

  const props = defineProps<Props>();

  const emits = defineEmits<Emits>();

  const handleChange = (value: any) => {
    emits('change', value, props.name);
  };
</script>

<template>
  <a-input-number
    v-if="type === 'number'"
    size="small"
    :style="{ width: '80px' }"
    :default-value="defaultValue as number"
    @change="handleChange"
  />
  <a-switch
    v-else-if="type === 'boolean'"
    :default-checked="defaultValue as boolean"
    size="small"
    @change="handleChange"
  />
</template>
