<script lang="ts" setup>
  // import { provideFetchMessage } from './composables/fetch';
  import { provideOperateMessage } from './composables/operate';
  import Filter from './components/filter.vue';
  import Table from './components/table.vue';

  // 顶层 provide，因为顶部栏显示消息数量，所以 provideFetchMessage 在最顶层调用
  // provideFetchMessage();

  // 操作
  provideOperateMessage();
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <Breadcrumb :items="['menu.message']" />
    <Filter />
    <Table />
  </div>
</template>
