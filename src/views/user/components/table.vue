<script lang="ts" setup>
  import { computed } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';
  import { useUserStore } from '@/store';
  import { useSearchUser } from '../composables/search';
  import { useEditUser } from '../composables/edit';
  import { useDeleteUser } from '../composables/delete';
  // 搜索
  const {
    loading,
    pagination,
    renderData,
    onPageChange,
    onPageSizeChange,
    onUpdateRenderData,
  } = useSearchUser();

  // 编辑
  const { handleOpenEditPanel } = useEditUser();

  // 删除
  const {
    selectionState,
    toggleSelection,
    handleConfirmDeleteUser,
    handleBatchDeleteUser,
  } = useDeleteUser();

  const userStore = useUserStore();

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
      title: '用户名',
      dataIndex: 'username',
      slotName: 'username',
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
      title: '所属部门',
      dataIndex: 'sector',
      slotName: 'sector',
      headerCellClass: 'whitespace-nowrap',
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      slotName: 'email',
      headerCellClass: 'whitespace-nowrap',
    },

    {
      title: '手机号码',
      dataIndex: 'phone',
      slotName: 'phone',
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
    title="用户列表"
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
          @click="handleBatchDeleteUser(onUpdateRenderData)"
        >
          批量删除
        </a-button>

        <!-- 新增 -->
        <a-button
          type="outline"
          size="small"
          class="!px-2"
          @click="handleOpenEditPanel"
        >
          <template #icon>
            <icon-plus />
          </template>
          新增用户
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
        <span class="font-number font-bold italic opacity-40">
          {{ rowIndex + 1 }}
        </span>
      </template>
      <!-- 用户 -->
      <template #username="{ record }">
        <div class="font-semibold">{{ record?.username }}</div>
        <div v-if="record.nickname" class="text-xs">{{ record?.nickname }}</div>
      </template>
      <!-- 角色权限 -->
      <template #role="{ record }">
        <a-tag color="arcoblue" bordered>
          {{ $t(`account.roles.${record.role}`) }}
        </a-tag>
      </template>

      <!-- 如果是roles -->
      <!-- <template #roles="{ record }">
        <a-tag v-for="role in record.roles" :key="role" color="arcoblue" bordered>
          {{ $t(`account.roles.${role}`) }}
        </a-tag>
      </template> -->

      <!-- 操作 -->
      <template #operations="{ record }">
        <div class="flex items-center">
          <a-button
            size="small"
            type="text"
            class="!px-2"
            @click="handleOpenEditPanel($event, record)"
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
            @click="handleConfirmDeleteUser([record.id], onUpdateRenderData)"
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
