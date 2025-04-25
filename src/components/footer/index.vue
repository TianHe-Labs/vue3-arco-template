<script lang="ts" setup>
  const appCopyright = import.meta.env.VITE_APP_COPYRIGHT;
</script>

<template>
  <a-layout-footer class="h-42px leading-42px text-center text-text-2">
    &copy; {{ new Date().getFullYear() }} {{ appCopyright }}
  </a-layout-footer>
</template>
