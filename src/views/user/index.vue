<script lang="ts" setup>
  import Filter from './components/filter.vue';
  import Table from './components/table.vue';
  import EditPanel from './components/edit-panel.vue';
  import { provideSearchUser } from './composables/search';
  import { provideEditUser } from './composables/edit';

  // 查询
  provideSearchUser();

  // 创建 更新
  provideEditUser();
</script>

<script lang="ts">
  export default {
    name: 'User',
  };
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4">
    <Breadcrumb :items="['用户管理']" />

    <Filter />
    <Table />
    <EditPanel />
  </div>
</template>
