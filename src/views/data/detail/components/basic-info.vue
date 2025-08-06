<script setup lang="ts">
  import { useSearchXxxx } from '@/views/data/search/composables/search';
  import { useCreateUpdateXxxx } from '@/views/data/search/composables/create-update';

  // 复用检索逻辑
  const { renderData } = useSearchXxxx();

  // 更新（单个）
  const { handleCreateUpdateXxxx } = useCreateUpdateXxxx();
</script>

<template>
  <a-card
    title="基本信息"
    :header-style="{ padding: '16px 16px 0', borderBottom: 'none' }"
  >
    <template #extra>
      <a-button
        type="text"
        status="warning"
        @click="handleCreateUpdateXxxx($event, renderData?.[0])"
      >
        <template #icon>
          <icon-edit />
        </template>
        修改
      </a-button>
    </template>

    <a-descriptions :column="1">
      <a-descriptions-item label="名称">
        {{ renderData?.[0]?.name }}
      </a-descriptions-item>
      <a-descriptions-item label="描述">
        {{ renderData?.[0]?.description }}
      </a-descriptions-item>
      <a-descriptions-item label="标签">
        <div class="flex flex-wrap gap-1">
          <a-tag v-for="tag in renderData?.[0]?.tags" :key="tag">
            {{ tag }}
          </a-tag>
        </div>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>
