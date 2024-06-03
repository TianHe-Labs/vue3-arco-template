<template>
  <div class="block">
    <h5 class="title">{{ title }}</h5>
    <div v-for="option in options" :key="option.name" class="form-item">
      <span>{{ $t(option.label) }}</span>
      <form-wrapper
        :type="option?.type || 'boolean'"
        :name="option.name"
        :default-value="option.defaultValue"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import FormWrapper from './form-wrapper.vue';

  interface Option {
    name: string;
    label: string;
    type?: string;
    defaultValue: boolean | number;
  }

  interface Props {
    title: string;
    options: Option[];
  }

  defineProps<Props>();

  const appStore = useAppStore();

  const handleChange = async (value: any, name: string) => {
    if (name === 'menuFromServer' && value) {
      await appStore.queryAppServerMenus();
    }
    if (name === 'topMenu') {
      appStore.updateSettings({
        menuCollapse: false,
      });
    }
    if (name === 'colorWeak') {
      document.body.style.filter = value ? 'invert(80%)' : 'none';
    }
    appStore.updateSettings({ [name]: value });
  };
</script>

<style lang="less" scoped>
  .block {
    margin-bottom: 24px;
  }

  .title {
    margin: 10px 0;
    font-size: 14px;
  }

  .form-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
  }
</style>
