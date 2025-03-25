<script lang="ts" setup>
  import { useEditUser } from '../hooks/edit';
  import { useSearchUser } from '../hooks/search';

  const { renderData } = useSearchUser();

  const { editPanelVisible, editUserModel, submitCreateOrUpdate } =
    useEditUser();

  const handleCreateOrUpdate = async () => {
    const id = await submitCreateOrUpdate();
    if (editUserModel.value?.id) {
      // 更新
      renderData.value = renderData.value.map((item) => {
        if (item.id === editUserModel.value.id) {
          return {
            ...item,
            ...editUserModel.value,
          };
        }
        return item;
      });
    } else {
      renderData.value.unshift({ ...editUserModel.value, id });
    }
  };
</script>

<template>
  <a-modal
    v-model:visible="editPanelVisible"
    title-align="start"
    :title="!!editUserModel.id ? '修改用户' : '创建用户'"
    @before-ok="handleCreateOrUpdate"
  >
    <a-form :model="editUserModel" auto-label-width>
      <a-form-item field="nickname" lanel="用户昵称">
        <a-input
          v-model="editUserModel.nickname"
          allow-clear
          placeholder="请输入用户昵称"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
