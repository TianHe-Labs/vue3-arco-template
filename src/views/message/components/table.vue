<script lang="ts" setup>
  import { Message, TableColumnData } from '@arco-design/web-vue';
  import { useMessage } from '../hooks/message';
  import { dayjs } from '@/utils/format';
  import { computed, ref } from 'vue';

  const {
    loading,
    pagination,
    queryModel,
    fuzzyQueryModel,
    renderData,
    renderStats,
    fetchData,
    onPageChange,
    onPageSizeChange,
    selectionState,
    toggleSelection,
    handleMarkRead,
    handleDelete,
  } = useMessage();

  // 顶部栏只显示消息数量，所以 provideMessage 在最顶层调用
  // 但是获取数据需要依赖于当前组件，所以需要在这里调用

  // 获取数据
  fetchData();

  const popupVisible = ref<boolean>(false);

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
      //   dataIndex: 'actions',
      //   slotName: 'actions',
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
      <a-tabs
        v-model:active-key="queryModel.type"
        type="rounded"
        justify
        hide-content
      >
        <a-tab-pane
          v-for="(count, type) in renderStats"
          :key="type === 'total' ? undefined : type"
          :title="$t(`message.type.${type}`)"
        />
      </a-tabs>
    </template>
    <template #extra>
      <div class="flex items-center gap-3">
        <a-button
          v-if="selectionState.visible"
          status="normal"
          size="small"
          class="!px-2"
          @click="toggleSelection"
        >
          取消操作
        </a-button>
        <!-- 点击后，显示列表勾选框 -->
        <a-button
          :type="selectionState.visible ? 'primary' : 'outline'"
          size="small"
          class="!px-2"
          @click="handleMarkRead"
        >
          标记已读
        </a-button>
        <a-button
          :type="selectionState.visible ? 'primary' : 'outline'"
          status="danger"
          size="small"
          class="!px-2"
          @click="handleDelete"
        >
          删除
        </a-button>
        <!-- 筛选入口 -->
        <!-- 搜索 -->
        <!-- <a-input
          v-model="fuzzyQueryModel.fuzzyWord"
          allow-clear
          placeholder="请输入标题或内容检索关键字后回车"
          class="!w-400px"
          @press-enter="fetchData"
        /> -->
        <a-dropdown
          v-model:popup-visible="popupVisible"
          trigger="click"
          position="br"
          :unmount-on-close="false"
        >
          <a-button :type="popupVisible ? 'primary' : 'outline'" size="small">
            <template #icon>
              <icon-filter />
            </template>
          </a-button>
          <template #content>
            <a-form-item hide-label row-class="!px-3 !my-2">
              <a-button
                long
                :type="queryModel.unread ? 'outline' : undefined"
                class="!justify-start !pl-2"
              >
                <a-checkbox v-model="queryModel.unread">
                  <span class="text-text-3 hover:text-text-1">仅显示未读</span>
                </a-checkbox>
              </a-button>
            </a-form-item>
            <a-form-item hide-label row-class="!px-3 !my-2">
              <a-input
                v-model="fuzzyQueryModel.fuzzyWord"
                allow-clear
                placeholder="请输入标题或内容检索关键字后回车"
                class="!w-320px"
                @press-enter="fetchData"
              />
            </a-form-item>
          </template>
        </a-dropdown>
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
      :stripe="true"
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
        <span font="number bold italic" opacity-40>
          {{ rowIndex + 1 }}
        </span>
      </template>
      <!-- 消息 -->
      <template #content="{ record }">
        <a-typography-text bold>
          {{ record.title }}
        </a-typography-text>
        <a-typography-paragraph class="!mb-0">
          {{ record.content }}
        </a-typography-paragraph>
      </template>
      <!-- 时间 -->
      <template #createdAt="{ record }">
        <div>
          {{ dayjs(record.createdAt).fromNow() }}
        </div>
        <div class="text-text-2 text-sm">
          {{ dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </template>
      <!-- 操作 -->
      <!-- <template #actions>
        <div class="flex items-center gap-2">
          <a-button status="danger" size="small" type="text" class="!px-1">
            删除
          </a-button>
        </div>
      </template> -->
    </a-table>
  </a-card>
</template>
