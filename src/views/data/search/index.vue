<script lang="ts" setup>
  import Filter from './components/filter.vue';
  import Table from './components/table.vue';
  import { provideSearchXXX } from './composables/search';

  provideSearchXXX();
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <Breadcrumb :items="['menu.data.search']" />
    <Filter />
    <Table />
  </div>
</template>
