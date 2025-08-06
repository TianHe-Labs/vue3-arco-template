<script lang="ts" setup>
  import { ref } from 'vue';
  import { updateUserAvatar } from '@/api/account';
  import { useUserStore } from '@/store';
  import { FileItem, RequestOption, Upload } from '@arco-design/web-vue';
  import { AxiosProgressEvent } from 'axios';

  const userStore = useUserStore();

  // 上传文件列表
  const fileList = ref<FileItem[]>([]);

  // 自定义上传请求
  // 为了在 /api 中统一接口的管理
  // 而不是直接在上传组件的 action 属性中直接填写 path
  const customRequest = (option: RequestOption) => {
    const { onProgress, onError, onSuccess, fileItem } = option;

    // 要上传的文件
    const formData = new FormData();
    formData.append('avatar', fileItem.file as Blob);

    // https://axios-http.com/zh/docs/cancellation
    const controller = new AbortController();

    // 上传进度
    // 浏览器专属原生事件
    // https://developer.mozilla.org/zh-CN/docs/Web/API/ProgressEvent/loaded
    const onUploadProgress = (event: AxiosProgressEvent) => {
      let percent = '0.00';
      if (event.total && event.total > 0) {
        percent = ((event.loaded / event.total) * 100).toFixed(2);
      }
      // 从 axios获取上传进度 更新当前上传组件中
      onProgress(parseInt(percent, 10), event);
    };

    (async () => {
      try {
        // https://github.com/axios/axios/issues/1630
        // https://github.com/nuysoft/Mock/issues/127
        const { data } = await updateUserAvatar(formData, {
          signal: controller.signal,
          onUploadProgress, // 浏览器专属原生事件
        });
        onSuccess(data);
      } catch (err) {
        console.log('error', err);
        onError(err);
      }
    })();

    return {
      abort() {
        controller.abort();
      },
    };
  };

  const onUploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
    // console.log('upload change', fileItemList, fileItem);
    fileList.value = [{ ...fileItem }];
  };

  const onUploadSuccess = (fileItem: FileItem) => {
    // console.log('upload success', fileItem);
    userStore.setUserInfo({
      avatar: fileItem.url,
    });
  };

  /* const onUploadError = (fileItem: FileItem) => {
    console.log('upload error', fileItem);
  }; */
</script>

<template>
  <a-card
    :body-style="{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '32px',
      alignItems: 'end',
      padding: '32px',
    }"
  >
    <a-upload
      ref="uploadRef"
      :custom-request="customRequest"
      :file-list="fileList"
      :show-upload-button="true"
      :show-file-list="false"
      accept="image/*"
      class="!inline-block"
      @change="onUploadChange"
      @success="onUploadSuccess"
    >
      <!-- @error="onUploadError" -->
      <template #upload-button>
        <a-avatar
          v-if="fileList?.[0]?.url || userStore?.avatar"
          shape="circle"
          :size="100"
          :style="{
            border: '2px solid var(--color-border-2)',
          }"
        >
          <template #trigger-icon>
            <icon-camera :size="16" class="m-8px text-primary-5 font-bold" />
          </template>
          <img :src="fileList?.[0]?.url || userStore?.avatar" />
        </a-avatar>
        <a-avatar
          v-else
          shape="circle"
          :size="100"
          :style="{
            border: '2px solid var(--color-border-2)',
            background:
              'linear-gradient(217deg, rgba(var(--primary-5)), rgba(255, 0, 0, 0) 72%), linear-gradient(127deg, rgba(var(--primary-4)), rgba(0, 255, 0, 0) 72%), linear-gradient(336deg, rgba(var(--primary-3)), rgba(0, 0, 255, 0) 72%)',
          }"
        >
          <template #trigger-icon>
            <icon-camera :size="16" class="m-8px text-primary-5 font-bold" />
          </template>
          <span v-if="userStore?.nickname" class="uppercase">{{
            (userStore?.nickname || userStore?.username)?.substring(0, 1)
          }}</span>
          <icon-user v-else />
        </a-avatar>
      </template>
    </a-upload>

    <a-descriptions :column="{ xs: 1, md: 2 }" :align="{ label: 'right' }">
      <a-descriptions-item label="用户名">
        {{ userStore.username }}
      </a-descriptions-item>

      <a-descriptions-item label="用户昵称">
        {{ userStore.nickname }}
      </a-descriptions-item>

      <a-descriptions-item label="角色权限">
        <a-tag bordered :color="$t(`user.role.color.${userStore.role}`)">
          {{ $t(`user.role.text.${userStore.role}`) }}</a-tag
        >
      </a-descriptions-item>

      <!-- 如果是roles -->
      <!-- <a-descriptions-item label="角色权限">
        <div class="flex flex-wrap gap-2">
          <a-tag
            v-for="role in userStore.roles"
            :key="role"
            bordered
            :color="$t(`user.role.color.${role}`)"
          >
            {{ $t(`user.role.text.${role}`) }}
          </a-tag>
        </div>
      </a-descriptions-item> -->

      <a-descriptions-item label="账号状态">
        <a-tag
          :color="$t(`user.status.color.${userStore.status?.toLowerCase()}`)"
        >
          {{ $t(`user.status.text.${userStore.status?.toLowerCase()}`) }}
        </a-tag>
      </a-descriptions-item>

      <a-descriptions-item label="电子邮箱">
        {{ userStore.email }}
      </a-descriptions-item>

      <a-descriptions-item label="手机号码">
        {{ userStore.phone }}
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<style lang="less" scoped>
  :deep(.arco-avatar-trigger-icon-button) {
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
</style>
