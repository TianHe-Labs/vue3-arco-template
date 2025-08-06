<script setup lang="ts">
  import Filter from './components/filter.vue';
  import Table from './components/table.vue';
  import CreateUpdatePanel from './components/create-update-panel.vue';
  import BatchCreatePanel from './components/batch-create-panel.vue';
  import { provideSearchOrg } from './composables/search';
  import { provideCreateUpdateOrg } from './composables/create-update';
  import { provideBatchCreateOrg } from './composables/batch-create';
  import { provideBatchOperateOrg } from './composables/batch-operate';

  // 查询
  provideSearchOrg();

  // 删除等批量操作
  provideBatchOperateOrg();

  // 创建（单个）或更新用户，共用弹窗表单
  provideCreateUpdateOrg();

  // 批量创建用户
  provideBatchCreateOrg();
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <!-- 面包屑导航 -->
    <Breadcrumb :items="['menu.management', 'menu.management.org']" />

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
