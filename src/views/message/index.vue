<script lang="ts" setup>
  // import { provideMessage } from './composables/message';
  import { provideOperation } from './composables/operation';
  import Filter from './components/filter.vue';
  import Table from './components/table.vue';

  // 顶层 provide，因为顶部栏显示消息数量，所以 provideMessage 在最顶层调用
  // provideMessage();

  // 操作
  provideOperation();
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <Breadcrumb :items="['menu.message']" />
    <Filter />
    <Table />
  </div>
</template>
