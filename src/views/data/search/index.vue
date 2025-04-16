<script lang="ts" setup>
  import Filter from './components/filter.vue';
  import Table from './components/table.vue';
  import { provideSearchXXX } from './composables/search';
  import { provideDeleteXxxx } from './composables/delete';

  // 搜索
  provideSearchXXX();

  // 删除
  provideDeleteXxxx();
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <Breadcrumb :items="['menu.data.search']" />
    <Filter />
    <Table />
  </div>
</template>
