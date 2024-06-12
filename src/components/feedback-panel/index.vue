<template>
  <!-- 如果没有导航栏，在右边放一个固定按钮入口 -->
  <div
    v-if="!appStore.navbar || appStore.device !== 'desktop'"
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
    :width="680"
    :fullscreen="appStore.device === 'mobile'"
    :title="$t('toolbar.feedback')"
    draggable
    title-align="start"
    @before-ok="handleSubmit"
  >
    <a-form ref="feedbackFormRef" layout="vertical" :model="feedbackModel">
      <a-form-item
        required
        asterisk-position="end"
        field="type"
        :label="$t('feedback.form.type.label')"
        :rules="[
          {
            required: true,
            message: $t('feedback.form.type.placeholder'),
          },
        ]"
      >
        <a-select
          v-model="feedbackModel.type"
          allow-clear
          :options="typeOptions"
          :placeholder="$t('feedback.form.type.placeholder')"
        />
      </a-form-item>
      <a-form-item
        required
        asterisk-position="end"
        field="content"
        :label="$t('feedback.form.content.label')"
        :rules="[
          {
            required: true,
            message: $t('feedback.form.content.placeholder'),
          },
        ]"
      >
        <a-textarea
          v-model="feedbackModel.content"
          allow-clear
          :auto-size="{ minRows: 7, maxRows: 12 }"
          :placeholder="$t('feedback.form.content.placeholder')"
        />
      </a-form-item>
      <!-- <a-form-item
        field="attachment"
        :label="$t('feedback.form.attachment.label')"
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
  import { useAppStore } from '@/store';
  import axios from 'axios';

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
    label: t(`feedback.form.type.options.${value}`),
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
    if (errors && Object.keys(errors).length) {
      return false;
    }
    try {
      const resp = await axios.post('/api/feedback/create');
      if (resp.status >= 200 && resp.status < 300) {
        Message.success(t('feedback.form.submit.success.message'));
        return true;
      }
      return true;
    } catch (err: any) {
      Message.error(t('feedback.form.submit.failure.message'));
      return false;
    }
  };
</script>
