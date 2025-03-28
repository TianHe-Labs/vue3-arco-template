<template>
  <!-- 移动端fixed固定在屏幕右下角 -->
  <a-badge
    v-if="breakpoints.smallerOrEqual('md').value"
    :count="9"
    dot
    class="fixed right-5 bottom-20"
  >
    <a-button
      class="fixed-btn"
      size="large"
      shape="circle"
      @click="setPopoverVisible"
    >
      <icon-notification />
    </a-button>
  </a-badge>
  <a-popover
    :visible="true"
    trigger="click"
    :position="breakpoints.greater('md').value ? 'br' : 'tr'"
    class="w-480px max-w-9/10"
    content-class="mt-0"
  >
    <div ref="triggerRef"></div>
    <template #content>
      <a-tabs
        v-model:activeKey="messageType"
        justify
        type="rounded"
        size="small"
      >
        <!-- 清空：标记已读清空列表 -->
        <template #extra>
          <a-button type="text" size="small" @click="handleClearData">
            清空
          </a-button>
        </template>
        <a-tab-pane v-for="tab in tabList" :key="tab.key">
          <template #title>
            <span> {{ tab.title }} </span>
            <span v-if="renderStats[tab.key]">
              ({{ renderStats[tab.key] }})
            </span>
          </template>
          <a-list :bordered="false" :loading="loading">
            <a-list-item
              v-for="item in renderData"
              :key="item.id"
              :style="{
                opacity: item.readAt ? 0.5 : 1,
              }"
            >
              <div class="item-wrap" @click="handleItemClick(item)">
                <a-list-item-meta>
                  <template v-if="item.avatar" #avatar>
                    <a-avatar shape="circle">
                      <img
                        v-if="item.avatar"
                        width="20px"
                        height="20px"
                        :src="item.avatar"
                      />
                      <icon-desktop v-else />
                    </a-avatar>
                  </template>
                  <template #title>
                    <a-space :size="4">
                      <a-typography-text>
                        {{ item.title }}
                      </a-typography-text>
                      <a-typography-text type="secondary">
                        {{ item.subTitle }}
                      </a-typography-text>
                    </a-space>
                  </template>
                  <template #description>
                    <div>
                      <a-typography-paragraph :ellipsis="{ rows: 1 }">
                        {{ item.content }}
                      </a-typography-paragraph>
                      <a-typography-text class="time-text">
                        {{ item.createdAt }}
                      </a-typography-text>
                    </div>
                  </template>
                </a-list-item-meta>
              </div>
            </a-list-item>
            <!-- 底部 -->
            <template v-if="renderData && renderData.length" #footer>
              <a-button
                type="text"
                size="small"
                @click="handleMarkAllRead(messageType)"
                >全部已读</a-button
              >
            </template>
          </a-list>
        </a-tab-pane>
      </a-tabs>
    </template>
  </a-popover>
</template>

<script lang="ts" setup>
  import { inject } from 'vue';
  import { MessageRecord } from '@/api/message';
  import { useMessage } from './hooks';

  const breakpoints = inject('breakpoints') as any;

  const {
    triggerRef,
    loading,
    tabList,
    messageType,
    renderData,
    renderStats,
    setPopoverVisible,
    handleMarkRead,
    handleMarkAllRead,
    handleClearData,
  } = useMessage();

  const handleItemClick = (item: MessageRecord) => {
    if (item) {
      handleMarkRead([item.id]);
    }
  };
</script>

<style lang="less" scoped>
  :deep(.arco-tabs-nav) {
    padding: 4px 0 12px;
    border-bottom: 1px solid var(--color-border-2);
  }

  :deep(.arco-list-wrapper) {
    margin-top: -16px;

    .arco-list-item {
      min-height: 84px;
    }

    .arco-list-item-meta {
      align-items: start;
    }

    .arco-list-item-meta-content {
      flex: 1;
    }

    .item-wrap {
      cursor: pointer;
    }

    .time-text {
      color: var(--color-text-3);
      font-size: 12px;
    }

    .arco-list-footer {
      padding: 12px 0 0;
      text-align: right;
    }

    .arco-typography {
      margin-bottom: 0;
    }
  }
</style>
