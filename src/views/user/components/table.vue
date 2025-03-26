<script lang="ts" setup>
  import { TableColumnData, Modal, Message } from '@arco-design/web-vue';
  import { differenceBy } from 'lodash';
  import { UserModel } from '@/api/user';
  import { useSearchUser } from '../hooks/search';
  import { useEditUser } from '../hooks/edit';

  const { loading, pagination, renderData, onPageChange, onPageSizeChange } =
    useSearchUser();

  const {
    handleOpenEditPanel,
    selectionState,
    handleToggleSelection,
    submitDelete,
  } = useEditUser();

  // 响应函数
  const handleDelete = async ($event: Event, record?: UserModel) => {
    const ids = record && record?.id ? [record.id] : selectionState.checked;
    if (!ids || ids.length === 0) {
      Message.warning('未选择要删除的用户');
      return;
    }
    Modal.confirm({
      title: '警告',
      titleAlign: 'start',
      content: '确认删除用户？',
      modalClass: '!p-5',
      onOk: async () => {
        const failedIds = await submitDelete(ids);
        // 直接在前端逻辑中移除已经被删除的用户，不再请求接口
        renderData.value = differenceBy(renderData.value, failedIds, 'id');
      },
    });
  };

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
  ];
</script>

<template>
  <a-card :bordered="false" title="用户列表">
    <template #extra>
      <div class="flex gap-3">
        <!-- 删除 -->
        <template v-if="selectionState.visible">
          <a-button size="small" @click="handleToggleSelection">取消</a-button>
          <a-button
            type="primary"
            status="danger"
            size="small"
            class="!px-2"
            @click="handleDelete"
          >
            提交删除
          </a-button>
        </template>
        <!-- 起始状态 -->
        <a-button
          v-else
          type="primary"
          status="danger"
          size="small"
          class="!px-2"
          @click="handleToggleSelection"
        >
          批量删除
        </a-button>

        <!-- 新增 -->
        <a-button
          type="primary"
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
      :stripe="true"
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
            type="primary"
            class="!px-2"
            @click="handleOpenEditPanel($event, record)"
          >
            修改
          </a-button>
          <a-button
            status="danger"
            type="primary"
            size="small"
            @click="handleDelete($event, record)"
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
