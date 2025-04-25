<script lang="ts" setup>
  import { computed } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';
  import { useSearchXXX } from '../composables/search';
  import { useDeleteXxxx } from '../composables/delete';

  const {
    loading,
    pagination,
    queryModel,
    renderData,
    onPageChange,
    onPageSizeChange,
    onUpdateRenderData,
  } = useSearchXXX();

  const {
    selectionState,
    toggleSelection,
    handleConfirmDeleteXxxx,
    handleBatchDeleteXxxx,
  } = useDeleteXxxx();

  const renderColumns = computed<TableColumnData[]>(() => [
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
      dataIndex: 'operations',
      slotName: 'operations',
      fixed: 'right',
      width: 160,
      headerCellClass: 'whitespace-nowrap',
    },
  ]);
</script>

<template>
  <a-card
    title="检索结果"
    :bordered="false"
    :header-style="{ borderBottom: 'none', paddingBottom: '0px' }"
  >
    <template #extra>
      <div class="flex gap-3">
        <!-- 删除 -->
        <a-button
          v-if="selectionState.visible"
          size="small"
          @click="toggleSelection(false)"
          >取消操作</a-button
        >
        <!-- 起始状态 -->
        <a-button
          :type="selectionState.visible ? 'primary' : 'outline'"
          status="danger"
          size="small"
          class="!px-2"
          @click="handleBatchDeleteXxxx(onUpdateRenderData)"
        >
          批量删除
        </a-button>
      </div>
    </template>
    <a-table
      v-model:selected-keys="selectionState.checked"
      row-key="id"
      :loading="loading"
      :bordered="false"
      :pagination="pagination"
      :columns="renderColumns"
      :data="renderData"
      :scroll="{ x: 1200 }"
      :row-selection="
        selectionState.visible
          ? { type: 'checkbox', showCheckedAll: true, onlyCurrent: false }
          : undefined
      "
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
      <template #operations="{ record }">
        <!-- 按钮较多时，分行显示 操作类的放一行 -->
        <router-link
          :to="{ name: 'XxxxDetail', params: { id: record.id } }"
          target="_blank"
        >
          <a-button size="small" type="text" class="!px-2">
            <template #icon>
              <icon-launch />
            </template>
            详情
          </a-button>
        </router-link>
        <div class="flex items-center">
          <a-button size="small" type="text" class="!px-2">
            <template #icon>
              <icon-edit />
            </template>
            修改
          </a-button>
          <a-button
            status="danger"
            size="small"
            type="text"
            class="!px-2"
            @click="handleConfirmDeleteXxxx([record.id], onUpdateRenderData)"
          >
            <template #icon>
              <icon-delete />
            </template>
            删除
          </a-button>
        </div>
      </template>
    </a-table>
  </a-card>
</template>
