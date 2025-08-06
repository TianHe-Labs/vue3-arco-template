<script lang="ts" setup>
  import { computed } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';
  import { useUserStore } from '@/store';
  import { useSearchUser } from '../composables/search';
  import { useCreateUpdateUser } from '../composables/create-update';
  import { useBatchCreateUser } from '../composables/batch-create';
  import { useBatchOperateUser } from '../composables/batch-operate';

  // 搜索
  const {
    loading,
    pagination,
    renderData,
    onPageChange,
    onPageSizeChange,
    exportLoading,
    handleExportData,
    onUpdateRenderData,
  } = useSearchUser();

  // 创建（单个）或更新用户，共用弹窗表单
  const { handleCreateUpdateUser } = useCreateUpdateUser();

  // 批量创建用户
  const { handleBatchCreateUser } = useBatchCreateUser();

  // 删除
  const {
    selectionState,
    toggleSelection,
    handleSubmitDeleteUser,
    handleBatchDeleteUser,
  } = useBatchOperateUser();

  const userStore = useUserStore();

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
      title: '用户',
      dataIndex: 'username',
      slotName: 'username',
      headerCellClass: 'whitespace-nowrap',
    },
    {
      title: '所属部门',
      dataIndex: 'org',
      slotName: 'org',
      headerCellClass: 'whitespace-nowrap',
    },
    {
      title: '角色权限',
      dataIndex: 'role',
      slotName: 'role',
      headerCellClass: 'whitespace-nowrap',
    },
    // {
    //   title: '角色权限',
    //   dataIndex: 'roles',
    //   slotName: 'roles',
    //   headerCellClass: 'whitespace-nowrap',
    // },
    {
      title: '联系方式',
      dataIndex: 'phone',
      slotName: 'phone',
      headerCellClass: 'whitespace-nowrap',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
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
  <a-card :header-style="{ padding: '16px 16px 0', borderBottom: 'none' }">
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
          @click="handleBatchDeleteUser(onUpdateRenderData)"
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
            @click="handleCreateUpdateUser"
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
              <a-doption @click="handleBatchCreateUser"> 批量新增 </a-doption>
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

      <!-- 用户 -->
      <template #username="{ record }">
        <div class="font-semibold">{{ record?.username }}</div>
        <div v-if="record.nickname" class="text-xs">{{ record?.nickname }}</div>
      </template>

      <!-- 所属部门 -->
      <template #org="{ record }">
        {{ record?.org?.orgName }}
      </template>

      <!-- 角色权限 -->
      <template #role="{ record }">
        <a-tag
          :color="$t(`user.role.color.${record.role.toLowerCase()}`)"
          bordered
        >
          {{ $t(`user.role.text.${record.role.toLowerCase()}`) }}
        </a-tag>
      </template>

      <!-- 如果是roles -->
      <!-- <template #roles="{ record }">
        <a-tag v-for="role in record.roles" :key="role" color="arcoblue" bordered>
          {{ $t(`user.role.text.${role}`) }}
        </a-tag>
      </template> -->

      <!-- 联系方式 -->
      <template #phone="{ record }">
        <div class="flex flex-col gap-0.5">
          <a-typography-text v-if="record.phone" class="text-sm">
            <icon-phone />
            {{ record.phone }}
          </a-typography-text>
          <a-typography-text v-if="record.email" class="text-sm">
            <icon-email />
            {{ record.email }}
          </a-typography-text>
        </div>
      </template>

      <!-- 状态 -->
      <template #status="{ record }">
        <a-tag
          :color="$t(`user.status.color.${record.status.toLowerCase()}`)"
          bordered
        >
          {{ $t(`user.status.text.${record.status.toLowerCase()}`) }}
        </a-tag>
      </template>

      <!-- 操作 -->
      <template #operations="{ record }">
        <div class="flex items-center">
          <a-button
            size="small"
            type="text"
            status="warning"
            class="!px-2"
            @click="handleCreateUpdateUser($event, record)"
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
            :disabled="record.id === userStore?.id"
            class="!px-2"
            @click="handleSubmitDeleteUser([record.id], onUpdateRenderData)"
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
