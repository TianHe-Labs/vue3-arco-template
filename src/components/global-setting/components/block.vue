<template>
  <div class="mb-6">
    <h5 class="my-2 text-base">{{ title }}</h5>
    <div
      v-for="option in options"
      :key="option.name"
      class="flex justify-between items-center my-3"
    >
      <span>{{ t(option.label) }}</span>
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
  import { useI18n } from 'vue-i18n';
  import { useAppStore } from '@/store';
  import FormWrapper from './form-wrapper.vue';

  const { t } = useI18n();

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
