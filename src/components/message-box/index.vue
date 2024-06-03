<template>
  <!-- 移动端fixed固定在屏幕右下角 -->
  <a-badge
    v-if="appStore.device !== 'desktop'"
    :count="9"
    dot
    class="fixed-message"
  >
    <a-button
      class="msg-btn"
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
    :position="appStore.device === 'desktop' ? 'br' : 'tr'"
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
            {{ $t('messageBox.actions.allClear') }}
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
                >{{ $t('messageBox.actions.allRead') }}</a-button
              >
            </template>
          </a-list>
        </a-tab-pane>
      </a-tabs>
    </template>
  </a-popover>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import { MessageRecord } from '@/api/message';
  import { useMessage } from './hooks';

  const appStore = useAppStore();

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
  .fixed-message {
    position: fixed;
    right: 25px;
    bottom: 100px;
    z-index: 999;

    .msg-btn {
      background: var(--color-bg-5) !important;
      border: 1px solid var(--color-fill-3) !important;
      box-shadow: 0 2px 12px #0000001a;
    }
  }

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
