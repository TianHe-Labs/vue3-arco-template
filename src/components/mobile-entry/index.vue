<script lang="ts" setup>
  import { inject } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAppStore } from '@/store';
  import { useSearchMessage } from '@/views/message/composables/search';
  import { useFeedback } from '@/components/feedback-panel/composables/feedback';

  const router = useRouter();

  const appStore = useAppStore();

  // 消息
  const { renderStats } = useSearchMessage();

  // 反馈
  const { toggleFeedbackPanel } = useFeedback();

  const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;
</script>

<template>
  <teleport to="body">
    <div
      class="fixed left-1/2 transform -translate-x-1/2 bottom-16 flex items-center gap-4 z-99"
    >
      <a-button
        size="large"
        shape="circle"
        class="!float-button"
        @click="toggleFeedbackPanel()"
      >
        <template #icon>
          <icon-customer-service size="large" />
        </template>
      </a-button>

      <a-button
        size="large"
        shape="round"
        class="!float-button font-medium"
        @click="toggleDrawerMenu"
      >
        <template #icon>
          <icon-common />
        </template>
        导航设置
      </a-button>

      <!-- 消息 -->
      <a-badge
        v-if="appStore.messageEnabled"
        :count="renderStats?.total || 0"
        dot
      >
        <a-button
          size="large"
          shape="circle"
          class="!float-button"
          @click="router.push({ name: 'Message' })"
        >
          <icon-notification size="large" />
        </a-button>
      </a-badge>
    </div>
  </teleport>
</template>
