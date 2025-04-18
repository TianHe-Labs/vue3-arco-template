<template>
  <!-- 如果没有导航栏，在右边放一个固定按钮入口 -->
  <div
    v-if="!appStore.navbar || breakpoints.smallerOrEqual('md').value"
    class="fixed right-5 bottom-36"
  >
    <a-button
      class="fixed-btn"
      size="large"
      shape="circle"
      @click="feedbackPanelVisible = !feedbackPanelVisible"
    >
      <template #icon>
        <icon-customer-service size="large" />
      </template>
    </a-button>
  </div>
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

<script lang="ts" setup>
  import { reactive, ref, inject } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import axios from 'axios';
  import { useAppStore } from '@/store';

  const breakpoints = inject('breakpoints') as any;

  const { t } = useI18n();
  const appStore = useAppStore();

  const feedbackPanelVisible = inject('feedbackPanelVisible') as boolean;

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

  const feedbackFormRef = ref();

  const feedbackModel = reactive({
    type: '',
    content: '',
  });

  /* const beforeUpload = (file: File) => {
    console.log(file);
  }; */

  const handleSubmit = async () => {
    const errors = await feedbackFormRef.value?.validate();
    if (errors && Object.keys(errors).length > 0) {
      return false;
    }
    try {
      const resp = await axios.post('/api/feedback/create');
      if (resp.status >= 200 && resp.status < 300) {
        Message.success('反馈已提交');
      }
    } catch (err: any) {
      Message.error(err?.message);
    }
    // 不要主动关闭反馈窗口，有可能会反馈多个问题，用户可以不用重新打开窗口
    return false;
  };
</script>
