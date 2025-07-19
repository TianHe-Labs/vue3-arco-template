<script lang="ts" setup>
  import { TableColumnData } from '@arco-design/web-vue';
  import { useFetchMessage } from '../composables/fetch';
  import { dayjs } from '@/utils/format';
  import { computed, ref } from 'vue';
  import { useOperateMessage } from '../composables/operate';

  const {
    loading,
    pagination,
    queryPanelVisible,
    toggleQueryPanel,
    queryModel,
    renderData,
    fetchData,
    onPageChange,
    onPageSizeChange,
    onUpdateRenderData,
  } = useFetchMessage();

  // 顶部栏只显示消息数量，所以 provideFetchMessage 在最顶层调用
  // 但是获取数据需要依赖于当前组件，所以需要在这里调用

  // 获取数据
  fetchData();

  // 操作
  const {
    selectionState,
    toggleSelection,
    handleBatchReadMessage,
    handleBatchDeleteMessage,
  } = useOperateMessage();

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
      //   width: 110,
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
          class="!px-2"
          @click="toggleSelection(false)"
        >
          取消操作
        </a-button>
        <!-- 点击后，显示列表勾选框 -->
        <a-button
          :type="selectionState.visible ? 'primary' : 'outline'"
          size="small"
          class="!px-2"
          @click="handleBatchReadMessage(onUpdateRenderData)"
        >
          标记已读
        </a-button>
        <a-button
          :type="selectionState.visible ? 'primary' : 'outline'"
          status="danger"
          size="small"
          class="!px-2"
          @click="handleBatchDeleteMessage(onUpdateRenderData)"
        >
          删除
        </a-button>

        <!-- 高级筛选 显示/隐藏 -->
        <a-button
          :type="queryPanelVisible ? 'primary' : 'outline'"
          size="small"
          @click="toggleQueryPanel"
        >
          <template #icon>
            <icon-filter />
          </template>
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
      :scroll="{ x: 1200 }"
      :row-selection="
        selectionState.visible
          ? {
              type: 'checkbox',
              showCheckedAll: true,
              onlyCurrent: false,
            }
          : undefined
      "
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
        <div>
          {{ dayjs(record.createdAt).fromNow() }}
        </div>
        <div class="text-text-2 text-sm">
          {{ dayjs(record.createdAt).format('L LTS') }}
        </div>
      </template>
      <!-- 操作 -->
      <!-- <template #operations>
        <div class="flex items-center gap-2">
          <a-button status="danger" size="small" type="text" class="!px-1">
            删除
          </a-button>
        </div>
      </template> -->
    </a-table>
  </a-card>
</template>

<style lang="less" scoped>
  :deep(.arco-typography-secondary) {
    color: var(--color-text-3) !important;
  }
</style>
