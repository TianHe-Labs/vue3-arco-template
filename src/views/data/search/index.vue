<script lang="ts" setup>
  import { ref } from 'vue';
  import Filter from './components/filter.vue';
  import Table from './components/table.vue';
  import UpdatePanel from './components/update-panel.vue';
  import { provideSearchXxxx } from './composables/search';
  import { provideUpdateXxxx } from './composables/update';
  import { provideDeleteXxxx } from './composables/delete';

  // 搜索
  provideSearchXxxx(ref({}));

  // 更新
  provideUpdateXxxx();

  // 删除
  provideDeleteXxxx();
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

    <!-- 更新信息面板 -->
    <UpdatePanel />
  </div>
</template>
