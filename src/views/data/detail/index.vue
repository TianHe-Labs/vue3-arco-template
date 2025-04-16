<script setup lang="ts">
  defineProps<{
    id: string;
  }>();
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <Breadcrumb :items="['menu.data', 'menu.data.detail']" />
    {{ id }}
  </div>
</template>
