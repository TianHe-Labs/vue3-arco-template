<script lang="ts" setup>
  import { TableColumnData } from '@arco-design/web-vue';
  import { useSearchMessage } from '../composables/search';
  import { dayjs } from '@/utils/format';
  import { computed, ref } from 'vue';
  import { useBatchOperateMessage } from '../composables/batch-operate';

  const {
    loading,
    pagination,
    queryModel,
    renderData,
    fetchData,
    onPageChange,
    onPageSizeChange,
    onUpdateRenderData,
  } = useSearchMessage();

  // 顶部栏只显示消息数量，所以 provideFetchMessage 在最顶层调用
  // 但是获取数据需要依赖于当前组件，所以需要在这里调用

  // 获取数据
  fetchData();

  // 标记已读、删除等批量操作
  const {
    selectionState,
    toggleSelection,
    handleBatchReadMessage,
    handleBatchDeleteMessage,
  } = useBatchOperateMessage();

  // 渲染列
  const renderColumns = computed<TableColumnData[]>(() => {
    return [
      ...(selectionState.visible
        ? []
        : [
            {
              title: '#',
              dataIndex: 'index',
              slotName: 'index',
              align: 'center',
              fixed: 'left',
              width: 50,
            },
          ]),
      {
        title: '消息',
        dataIndex: 'content',
        slotName: 'content',
        headerCellClass: 'whitespace-nowrap',
        bodyCellClass: 'cursor-pointer',
      },
      {
        title: '时间',
        dataIndex: 'createdAt',
        slotName: 'createdAt',
        headerCellClass: 'whitespace-nowrap',
        width: 180,
      },
      // {
      //   title: '操作',
      //   dataIndex: 'operations',
      //   slotName: 'operations',
      //   fixed: 'right',
      //   width: 120,
      //   headerCellClass: 'whitespace-nowrap',
      // },
    ];
  });
</script>

<template>
  <a-card
    :bordered="false"
    :header-style="{
      height: 'auto',
      padding: '16px 16px 0',
      borderBottom: 'none',
    }"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <a-typography-text>消息列表</a-typography-text>
        <a-checkbox v-model="queryModel.unread">
          <span class="text-text-3 hover:text-text-2">仅显示未读</span>
        </a-checkbox>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center gap-3">
        <a-button
          v-if="selectionState.visible"
          status="normal"
          size="small"
          class="!px-3"
          @click="toggleSelection(false)"
        >
          取消操作
        </a-button>
        <!-- 点击后，显示列表勾选框 -->
        <a-button
          :type="selectionState.visible ? 'primary' : 'outline'"
          size="small"
          class="!px-3"
          @click="handleBatchReadMessage(onUpdateRenderData)"
        >
          标记已读
        </a-button>
        <a-button
          :type="selectionState.visible ? 'primary' : 'outline'"
          status="danger"
          size="small"
          class="!px-3"
          @click="handleBatchDeleteMessage(onUpdateRenderData)"
        >
          批量删除
        </a-button>
      </div>
    </template>

    <a-table
      v-model:selectedKeys="selectionState.checked"
      row-key="id"
      :loading="loading"
      :bordered="false"
      :pagination="pagination"
      :columns="renderColumns"
      :data="renderData"
      :row-selection="
        selectionState.visible
          ? {
              type: 'checkbox',
              showCheckedAll: true,
              onlyCurrent: false,
            }
          : undefined
      "
      :scroll="{ x: 'max-content' }"
      filter-icon-align-left
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
    >
      <!-- 序号 + (pagination.current - 1) * pagination.pageSize -->
      <template #index="{ rowIndex }">
        <span class="font-number font-bold italic opacity-40">
          {{ rowIndex + 1 }}
        </span>
      </template>
      <!-- 消息 -->
      <template #content="{ record }">
        <a-typography-text bold :type="record.readAt ? 'secondary' : 'default'">
          {{ record.title }}
        </a-typography-text>
        <a-typography-paragraph
          class="!mb-0"
          :type="record.readAt ? 'secondary' : 'default'"
        >
          {{ record.content }}
        </a-typography-paragraph>
      </template>
      <!-- 时间 -->
      <template #createdAt="{ record }">
        <div class="flex flex-col gap-0.5">
          <a-typography-text
            type="secondary"
            class="!text-sm !whitespace-nowrap"
          >
            {{ dayjs(record.createdAt).fromNow() }}
          </a-typography-text>
          <a-typography-text
            type="secondary"
            class="!text-sm !whitespace-nowrap"
          >
            {{ dayjs(record.createdAt).format('L LTS') }}
          </a-typography-text>
        </div>
      </template>
      <!-- 操作 -->
      <!-- <template #operations>
        <div class="flex items-center gap-2">
          <a-button status="danger" size="small" type="text" class="!px-2">
            删除
          </a-button>
        </div>
      </template> -->
    </a-table>
  </a-card>
</template>
