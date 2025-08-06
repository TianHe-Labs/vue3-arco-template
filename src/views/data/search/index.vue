<script lang="ts" setup>
  import { ref } from 'vue';
  import Filter from './components/filter.vue';
  import Table from './components/table.vue';
  import CreateUpdatePanel from './components/create-update-panel.vue';
  import BatchCreatePanel from './components/batch-create-panel.vue';
  import { provideSearchXxxx } from './composables/search';
  import { provideCreateUpdateXxxx } from './composables/create-update';
  import { provideBatchCreateXxxx } from './composables/batch-create';
  import { provideBatchOperateXxxx } from './composables/batch-operate';

  // 搜索
  provideSearchXxxx(ref({}));

  // 创建（单个）/更新（单个）
  provideCreateUpdateXxxx();

  // 批量创建
  provideBatchCreateXxxx();

  // 批量操作：删除等
  provideBatchOperateXxxx();
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <!-- 面包屑，保持这种最简洁高效的写法 -->
    <!-- 不要通过复杂的路由计算，浪费性能，得不偿失 -->
    <Breadcrumb :items="['menu.data.search']" />

    <!-- 过滤 -->
    <Filter />

    <!-- 表格 -->
    <Table />

    <!-- 创建（单个）/更新（单个） -->
    <CreateUpdatePanel />

    <!-- 批量创建 -->
    <BatchCreatePanel />
  </div>
</template>
