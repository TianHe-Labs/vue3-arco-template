<script lang="ts" setup>
  import { inject } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useAppStore } from '@/store';
  import { useFeedback } from './composables/feedback';

  const breakpoints = inject('breakpoints') as any;

  const appStore = useAppStore();

  // 反馈
  const {
    feedbackPanelVisible,
    toggleFeedbackPanel,
    feedbackFormRef,
    feedbackModel,
    handleSubmit,
  } = useFeedback();

  const { t } = useI18n();
  const typeOptions = [
    'fix',
    'feat',
    'perf',
    'style',
    'docs',
    'support',
    'other',
  ].map((value) => ({
    value,
    label: t(`feedback.options.${value}`),
  }));
</script>

<template>
  <a-modal
    v-model:visible="feedbackPanelVisible"
    title="问题反馈"
    title-align="start"
    draggable
    :width="680"
    :fullscreen="breakpoints.smallerOrEqual('md').value"
    @before-ok="handleSubmit"
  >
    <a-form ref="feedbackFormRef" layout="vertical" :model="feedbackModel">
      <a-form-item
        field="type"
        required
        asterisk-position="end"
        label="反馈类型"
        :rules="[
          {
            required: true,
            message: '反馈类型不可为空',
          },
        ]"
      >
        <a-select
          v-model="feedbackModel.type"
          allow-clear
          :options="typeOptions"
          placeholder="选择反馈问题类型"
        />
      </a-form-item>
      <a-form-item
        field="content"
        label="反馈详情"
        required
        asterisk-position="end"
        :rules="[
          {
            required: true,
            message: '反馈问题详情不可为空',
          },
        ]"
      >
        <a-textarea
          v-model="feedbackModel.content"
          allow-clear
          :auto-size="{ minRows: 8, maxRows: 12 }"
          placeholder="输入反馈问题详情"
        />
      </a-form-item>
      <!-- <a-form-item
        field="attachment"
        label="添加附件"
      >
        <a-upload
          draggable
          multiple
          image-preview
          :auto-upload="false"
          @before-upload="beforeUpload"
        />
      </a-form-item> -->
    </a-form>
  </a-modal>
</template>
