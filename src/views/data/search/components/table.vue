<script lang="ts" setup>
  import { computed } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';
  import { dayjs } from '@/utils/format';
  import { useSearchXxxx } from '../composables/search';
  import { useCreateUpdateXxxx } from '../composables/create-update';
  import { useBatchCreateXxxx } from '../composables/batch-create';
  import { useBatchOperateXxxx } from '../composables/batch-operate';

  interface Props {
    title?: string;
    showOperations?: boolean; // 是否显示操作列、批量操作等
  }

  const props = withDefaults(defineProps<Props>(), {
    showOperations: true,
  });

  // 搜索
  const {
    loading,
    pagination,
    queryModel,
    renderData,
    onPageChange,
    onPageSizeChange,
    onUpdateRenderData,
    exportLoading,
    handleExportData,
  } = useSearchXxxx();

  // 创建（单个）/更新（单个）
  const { handleCreateUpdateXxxx } = useCreateUpdateXxxx();

  // 批量创建
  const { handleBatchCreateXxxx } = useBatchCreateXxxx();

  // 批量操作：删除等
  const {
    selectionState,
    toggleSelection,
    handleSubmitDeleteXxxx,
    handleBatchDeleteXxxx,
  } = useBatchOperateXxxx();

  // 表格列
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
    // {
    //   title: '描述',
    //   dataIndex: 'description',
    //   slotName: 'description',
    //   headerCellClass: 'whitespace-nowrap',
    // },
    {
      title: '标签',
      dataIndex: 'tags',
      slotName: 'tags',
      headerCellClass: 'whitespace-nowrap',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      slotName: 'createdAt',
      headerCellClass: 'whitespace-nowrap',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      fixed: 'right',
      width: props.showOperations ? 160 : 80,
      headerCellClass: 'whitespace-nowrap',
    },
  ]);
</script>

<template>
  <a-card :header-style="{ padding: '16px 16px 0', borderBottom: 'none' }">
    <template #title>
      <div class="flex items-center gap-2">
        <!-- 页面需要复用时，支持修改标题等 -->
        <a-typography-text v-if="title">
          {{ title }}
        </a-typography-text>

        <span class="arco-pagination-total">
          {{ $t('pagination.total', [pagination.total]) }}
        </span>
        <!-- 占位 -->
        <div flex="auto"> </div>
      </div>
    </template>
    <template v-if="showOperations" #extra>
      <div class="flex gap-3">
        <!-- 删除 -->
        <a-button
          v-if="selectionState.visible"
          size="small"
          class="!px-3"
          @click="toggleSelection(false)"
          >取消操作</a-button
        >
        <!-- 起始状态 -->
        <a-button
          :type="selectionState.visible ? 'primary' : 'outline'"
          status="danger"
          size="small"
          class="!px-3"
          @click="handleBatchDeleteXxxx(onUpdateRenderData)"
        >
          批量删除
        </a-button>

        <!-- 新增 -->
        <a-button-group size="small" type="outline">
          <!-- 创建（单个） -->
          <a-button
            type="outline"
            size="small"
            class="!px-3"
            @click="handleCreateUpdateXxxx"
          >
            <template #icon>
              <icon-plus />
            </template>
            新增
          </a-button>
          <!-- 批量新增 -->
          <a-dropdown position="br">
            <a-button>
              <template #icon>
                <icon-menu />
              </template>
            </a-button>
            <template #content>
              <a-doption @click="handleBatchCreateXxxx"> 批量新增 </a-doption>
            </template>
          </a-dropdown>
        </a-button-group>

        <!-- 导出 -->
        <a-button
          size="small"
          type="outline"
          class="!px-3"
          :loading="exportLoading"
          @click="handleExportData"
        >
          <template #icon>
            <icon-download />
          </template>
          导出
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
      :row-selection="
        selectionState.visible
          ? { type: 'checkbox', showCheckedAll: true, onlyCurrent: false }
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

      <!-- 描述 -->
      <!-- <template #description="{ record }">
        <a-typography-paragraph type="secondary">
          {{ record.description }}
        </a-typography-paragraph>
      </template> -->

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

      <!-- 创建时间 -->
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
      <template #operations="{ record }">
        <!-- 按钮较多时，根据操作使用频率 分行显示 详情等 操作放一行 -->
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

        <!-- 按钮较多时，根据操作使用频率 分行显示 删改等操作放一行 -->
        <div v-if="showOperations" class="flex items-center">
          <a-button
            status="warning"
            size="small"
            type="text"
            class="!px-2"
            @click="handleCreateUpdateXxxx($event, record)"
          >
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
            @click="handleSubmitDeleteXxxx([record.id], onUpdateRenderData)"
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
