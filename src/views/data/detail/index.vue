<script setup lang="ts">
  defineProps<{
    id: string;
  }>();
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <Breadcrumb :items="['数据管理', '数据详情']" />
    {{ id }}
  </div>
</template>
