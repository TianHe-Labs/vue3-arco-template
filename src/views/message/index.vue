<script lang="ts" setup>
  // import { provideSearchMessage } from './composables/search';
  import { provideBatchOperateMessage } from './composables/batch-operate';
  import Filter from './components/filter.vue';
  import Table from './components/table.vue';

  // 顶层 provide，因为顶部栏显示消息数量，所以 provideSearchMessage 在最顶层调用
  // provideSearchMessage();

  // 标记已读、删除等批量操作
  provideBatchOperateMessage();
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <Breadcrumb :items="['menu.message']" />

    <!-- 筛选表单 -->
    <Filter />

    <!-- 消息列表 -->
    <Table />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'Message',
  };
</script>
