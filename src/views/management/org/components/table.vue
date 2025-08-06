<script lang="ts" setup>
  import { computed } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';
  // import { dayjs } from '@/utils/format';
  import { useSearchOrg } from '../composables/search';
  import { useCreateUpdateOrg } from '../composables/create-update';
  import { useBatchCreateOrg } from '../composables/batch-create';
  import { useBatchOperateOrg } from '../composables/batch-operate';

  // 搜索
  const {
    loading,
    pagination,
    renderData,
    onPageChange,
    onPageSizeChange,
    onUpdateRenderData,
  } = useSearchOrg();

  // 创建（单个）或更新用户，共用弹窗表单
  const { handleCreateUpdateOrg } = useCreateUpdateOrg();

  // 批量创建用户
  const { handleBatchCreateOrg } = useBatchCreateOrg();

  // 删除
  const {
    selectionState,
    toggleSelection,
    handleSubmitDeleteOrg,
    handleBatchDeleteOrg,
  } = useBatchOperateOrg();

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
      title: '部门',
      dataIndex: 'orgName',
      slotName: 'orgName',
      fixed: 'left',
      headerCellClass: 'whitespace-nowrap',
    },
    {
      title: '描述',
      dataIndex: 'orgDescription',
      slotName: 'orgDescription',
      headerCellClass: 'whitespace-nowrap',
    },
    {
      title: '上级部门',
      dataIndex: 'parentOrgId',
      slotName: 'parentOrgId',
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
    :header-style="{
      padding: '16px 16px 0',
      borderBottom: 'none',
    }"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <!-- <a-typography-text v-if="title">
          {{ title }}
        </a-typography-text> -->

        <span class="arco-pagination-total">
          {{ $t('pagination.total', [pagination.total]) }}
        </span>
        <!-- 占位 -->
        <div flex="auto"> </div>
      </div>
    </template>

    <template #extra>
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
          @click="handleBatchDeleteOrg(onUpdateRenderData)"
        >
          <template #icon>
            <icon-delete />
          </template>
          删除
        </a-button>

        <!-- 新增 -->
        <a-button-group size="small" type="outline">
          <!-- 创建（单个） -->
          <a-button
            type="outline"
            size="small"
            class="!px-3"
            @click="handleCreateUpdateOrg"
          >
            <template #icon>
              <icon-user-add />
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
              <a-doption @click="handleBatchCreateOrg"> 批量新增 </a-doption>
            </template>
          </a-dropdown>
        </a-button-group>
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

      <!-- 部门 -->
      <template #orgName="{ record }">
        <!-- <a-tag :color="$t(`orgLevel.color.${record.orgLevel?.toLowerCase()}`)">
          {{ $t(`orgLevel.text.${record.orgLevel?.toLowerCase()}`) }}
        </a-tag> -->
        <a-typography-text class="ml-2">
          {{ record?.orgName }}
        </a-typography-text>
      </template>

      <!-- 上级部门 -->
      <template #parentOrgId="{ record }">
        {{ record.parentOrg?.orgName }}
      </template>

      <!-- 操作 -->
      <template #operations="{ record }">
        <div class="flex items-center">
          <a-button
            size="small"
            type="text"
            status="warning"
            class="!px-2"
            @click="handleCreateUpdateOrg($event, record)"
          >
            <template #icon>
              <icon-edit />
            </template>
            修改
          </a-button>
          <a-button
            status="danger"
            type="text"
            size="small"
            class="!px-2"
            @click="handleSubmitDeleteOrg([record.id], onUpdateRenderData)"
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
