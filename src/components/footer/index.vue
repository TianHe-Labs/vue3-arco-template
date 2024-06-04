<template>
  <a-layout-footer
    class="py-4 flex justify-center items-center text-center"
    style="color: var(--color-text-2)"
  >
    &copy; {{ new Date().getFullYear() }} {{ appCopyright }}
  </a-layout-footer>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const appCopyright = import.meta.env.VITE_APP_COPR || t('');
</script>
