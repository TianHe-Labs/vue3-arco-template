<script lang="ts" setup>
  import { computed } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';
  import { UserModel } from '@/api/user';
  import { useSearchUser } from '../composables/search';
  import { useEditUser } from '../composables/edit';

  const {
    loading,
    pagination,
    renderData,
    onPageChange,
    onPageSizeChange,
    selectionState,
    toggleSelection,
    confirmDeleteUser,
    handleDeleteUser,
  } = useSearchUser();

  const { handleOpenEditPanel } = useEditUser();

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
      dataIndex: 'actions',
      slotName: 'actions',
      fixed: 'right',
      width: 110,
      headerCellClass: 'whitespace-nowrap',
    },
  ]);
</script>

<template>
  <a-card :bordered="false" title="用户列表">
    <template #extra>
      <div class="flex gap-3">
        <!-- 删除 -->
        <a-button
          v-if="selectionState.visible"
          size="small"
          @click="toggleSelection"
          >取消操作</a-button
        >
        <!-- 起始状态 -->
        <a-button
          :type="selectionState.visible ? 'primary' : 'outline'"
          status="danger"
          size="small"
          class="!px-2"
          @click="handleDeleteUser"
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
        <span font="number bold italic" opacity-40>
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
      <!-- 操作 -->
      <template #actions="{ record }">
        <div class="flex items-center gap-2">
          <a-button
            size="small"
            type="outline"
            class="!px-2"
            @click="handleOpenEditPanel($event, record)"
          >
            修改
          </a-button>
          <a-button
            status="danger"
            type="outline"
            size="small"
            @click="confirmDeleteUser([record.id])"
          >
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
        </div>
      </template>
    </a-table>
  </a-card>
</template>
