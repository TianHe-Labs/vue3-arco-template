<script lang="ts" setup>
  import Table from './components/table.vue';
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <Breadcrumb :items="['消息通知']" />
    <Table />
  </div>
</template>
