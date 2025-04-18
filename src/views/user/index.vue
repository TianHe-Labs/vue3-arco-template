<script lang="ts" setup>
  import Filter from './components/filter.vue';
  import Table from './components/table.vue';
  import EditPanel from './components/edit-panel.vue';
  import { provideSearchUser } from './composables/search';
  import { provideEditUser } from './composables/edit';
  import { provideDeleteUser } from './composables/delete';

  // 查询
  provideSearchUser();

  // 删除
  provideDeleteUser();

  // 编辑
  provideEditUser();
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4">
    <Breadcrumb :items="['menu.user']" />

    <Filter />
    <Table />
    <EditPanel />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'User',
  };
</script>
