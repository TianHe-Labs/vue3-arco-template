<script lang="ts" setup>
  import { useCreateUpdateOrg } from '../composables/create-update';
  import { useSearchOrg } from '../composables/search';
  import { SelectOption } from '@arco-design/web-vue';

  const { onUpdateRenderData } = useSearchOrg();

  // 创建/更新
  const {
    createUpdateOrgPanelVisible,
    createUpdateOrgFormRef,
    createUpdateOrgModel,
    handleSubmitCreateUpdateOrg,
  } = useCreateUpdateOrg();

  // 部门选项
  const orgOptions: SelectOption[] = [];
</script>

<template>
  <a-modal
    v-model:visible="createUpdateOrgPanelVisible"
    title-align="start"
    :title="!!createUpdateOrgModel.id ? '修改部门' : '新增部门'"
    @before-ok="handleSubmitCreateUpdateOrg(onUpdateRenderData)"
  >
    <a-form
      ref="createUpdateOrgFormRef"
      :model="createUpdateOrgModel"
      auto-label-width
    >
      <a-form-item
        field="orgName"
        label="部门名称"
        required
        :rules="[
          {
            required: true,
            message: '部门名称不可为空',
          },
        ]"
      >
        <a-input
          v-model="createUpdateOrgModel.orgName"
          allow-clear
          placeholder="输入部门名称"
        />
      </a-form-item>

      <a-form-item field="orgDescription" label="部门描述">
        <a-textarea
          v-model="createUpdateOrgModel.orgDescription"
          allow-clear
          placeholder="输入部门描述"
        />
      </a-form-item>

      <a-form-item field="parentOrgId" label="上级部门">
        <a-select
          v-model="createUpdateOrgModel.parentOrgId"
          allow-clear
          :options="orgOptions"
          placeholder="选择上级部门"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
