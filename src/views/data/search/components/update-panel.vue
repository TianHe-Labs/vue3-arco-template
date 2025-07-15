<script lang="ts" setup>
  import DynamicTag from '@/components/dynamic-tag/index.vue';
  import { useSearchXxxx } from '../composables/search';
  import { useUpdateXxxx } from '../composables/update';
  import { XxxxModel } from '@/api/xxxx';

  const emits = defineEmits<{
    (
      event: 'update:renderData',
      data: {
        type: 'update' | 'delete';
        record?: XxxxModel;
        ids?: XxxxModel['id'][];
      },
    ): void | Promise<void>;
  }>();

  const { onUpdateRenderData } = useSearchXxxx();

  // 更正信息
  const { updateXxxxPanelVisible, updateXxxxModel, handleSubmitUpdateXxxx } =
    useUpdateXxxx();
</script>

<template>
  <a-modal
    v-model:visible="updateXxxxPanelVisible"
    title-align="start"
    title="编辑内容信息"
    @before-ok="handleSubmitUpdateXxxx(onUpdateRenderData)"
  >
    <a-form :model="updateXxxxModel" auto-label-width>
      <a-form-item field="name" label="名称">
        <a-input v-model="updateXxxxModel.name" placeholder="输入名称" />
      </a-form-item>
      <a-form-item field="description" label="描述">
        <a-textarea
          v-model="updateXxxxModel.description"
          placeholder="输入描述"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <DynamicTag
          v-model="updateXxxxModel.tags"
          placeholder="添加标签"
          class="flex flex-wrap gap-1"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
