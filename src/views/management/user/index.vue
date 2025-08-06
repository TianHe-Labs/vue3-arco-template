<script lang="ts" setup>
  import Filter from './components/filter.vue';
  import Table from './components/table.vue';
  import CreateUpdatePanel from './components/create-update-panel.vue';
  import BatchCreatePanel from './components/batch-create-panel.vue';
  import { provideSearchUser } from './composables/search';
  import { provideCreateUpdateUser } from './composables/create-update';
  import { provideBatchCreateUser } from './composables/batch-create';
  import { provideBatchOperateUser } from './composables/batch-operate';

  // 查询
  provideSearchUser();

  // 删除等批量操作
  provideBatchOperateUser();

  // 创建（单个）或更新用户，共用弹窗表单
  provideCreateUpdateUser();

  // 批量创建用户
  provideBatchCreateUser();
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4">
    <!-- 面包屑导航 -->
    <Breadcrumb :items="['menu.management', 'menu.management.user']" />

    <!-- 筛选表单 -->
    <Filter />

    <!-- 用户列表 -->
    <Table />

    <!-- 更新面板 -->
    <CreateUpdatePanel />

    <!-- 批量创建用户面板 -->
    <BatchCreatePanel />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'UserManagement',
  };
</script>
