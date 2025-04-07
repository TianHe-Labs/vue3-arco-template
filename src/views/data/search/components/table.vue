<script lang="ts" setup>
  import { TableColumnData } from '@arco-design/web-vue';
  import { useSearchXXX } from '../composables/search';

  const {
    loading,
    pagination,
    queryModel,
    renderData,
    onPageChange,
    onPageSizeChange,
  } = useSearchXXX();

  const renderColumns: TableColumnData[] = [
    {
      title: '#',
      dataIndex: 'index',
      slotName: 'index',
      align: 'center',
      fixed: 'left',
      width: 50,
    },
    {
      title: '名称',
      dataIndex: 'name',
      slotName: 'name',
      fixed: 'left',
      headerCellClass: 'whitespace-nowrap',
    },
    {
      title: '描述',
      dataIndex: 'description',
      slotName: 'description',
      headerCellClass: 'whitespace-nowrap',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      slotName: 'tags',
      headerCellClass: 'whitespace-nowrap',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      slotName: 'actions',
      fixed: 'right',
      width: 110,
      headerCellClass: 'whitespace-nowrap',
    },
  ];
</script>

<template>
  <a-card :bordered="false" title="检索结果">
    <a-table
      row-key="id"
      :loading="loading"
      :bordered="false"
      :pagination="pagination"
      :columns="renderColumns"
      :data="renderData"
      :scroll="{ x: 1200 }"
      filter-icon-align-left
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
    >
      <!-- 序号 + (pagination.current - 1) * pagination.pageSize -->
      <template #index="{ rowIndex }">
        <span font="number bold italic" opacity-40>
          {{ rowIndex + 1 }}
        </span>
      </template>
      <!-- 标签 -->
      <template #tags="{ record }">
        <div flex="~ wrap gap-1">
          <a-tag
            v-for="tag in record.tags"
            :key="tag"
            :data-name="tag"
            :checked="queryModel.tags?.includes(tag)"
            checkable
            class="!text-base before:content-['#']"
          >
            <span :data-name="tag" class="truncate">{{ tag }}</span>
          </a-tag>
        </div>
      </template>
      <!-- 操作 -->
      <template #actions="{ record }">
        <div class="flex items-center gap-2">
          <router-link
            :to="{ name: 'XxxxDetail', params: { id: record.id } }"
            target="_blank"
          >
            <a-button size="small" type="outline" class="!px-2">详情</a-button>
          </router-link>
          <a-button status="danger" size="small" type="outline" class="!px-2">
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
        </div>
      </template>
    </a-table>
  </a-card>
</template>
