<script lang="ts" setup>
  import { useSearchXxxx } from '../composables/search';
  import { useCreateUpdateXxxx } from '../composables/create-update';

  // 创建（单个）/更新时，前端更新数据，不再请求接口
  const { onUpdateRenderData } = useSearchXxxx();

  // 更正信息
  const {
    createUpdateXxxxPanelVisible,
    createUpdateXxxxFormRef,
    createUpdateXxxxModel,
    handleSubmitCreateUpdateXxxx,
  } = useCreateUpdateXxxx();
</script>

<template>
  <a-modal
    v-model:visible="createUpdateXxxxPanelVisible"
    title-align="start"
    :title="!!createUpdateXxxxModel.id ? '编辑XX' : '新增XX'"
    @before-ok="handleSubmitCreateUpdateXxxx(onUpdateRenderData)"
  >
    <a-form
      ref="createUpdateXxxxFormRef"
      :model="createUpdateXxxxModel"
      auto-label-width
    >
      <a-form-item
        field="name"
        label="名称"
        :rules="[{ required: true, message: '请输入名称' }]"
      >
        <a-input v-model="createUpdateXxxxModel.name" placeholder="输入名称" />
      </a-form-item>
      <a-form-item field="description" label="描述">
        <a-textarea
          v-model="createUpdateXxxxModel.description"
          placeholder="输入描述"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <DynamicTag
          v-model="createUpdateXxxxModel.tags"
          placeholder="添加标签"
          class="flex flex-wrap gap-1"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
