<script setup lang="ts">
  import { computed } from 'vue';
  import { provideSearchXxxx } from '@/views/data/search/composables/search';
  import { provideUpdateXxxx } from '@/views/data/search/composables/update';
  import Breadcrumb from '@/components/breadcrumb/index.vue';
  import UpdateXxxxPanel from '@/views/data/search/components/update-panel.vue';
  import BasicInfo from './components/basic-info.vue';

  const props = defineProps<{
    id: string;
  }>();

  // 复用检索逻辑，传入 id 查询详情
  provideSearchXxxx(computed(() => ({ id: props.id })));

  // 更新（单个）
  provideUpdateXxxx();
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <Breadcrumb :items="['menu.data', 'menu.data.detail']" />

    <!-- 基本信息 -->
    <BasicInfo />

    <!-- 更新信息面板（复用） -->
    <!-- 避免命名冲突，改个名字加个前缀 -->
    <UpdateXxxxPanel />
  </div>
</template>
