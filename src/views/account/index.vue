<script lang="ts" setup>
  import Banner from './components/banner.vue';
  import BasicInfo from './components/basic-info.vue';
  import Password from './components/password.vue';
</script>

<script lang="ts">
  export default {
    name: 'Account',
  };
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <Breadcrumb :items="['账号设置']" />

    <Banner />

    <a-card
      class="flex-auto rounded"
      :bordered="false"
      :header-style="{ border: 'none' }"
      :body-style="{ height: '100%' }"
    >
      <a-tabs justify :header-padding="false">
        <a-tab-pane key="basicInfo" title="基本信息">
          <BasicInfo />
        </a-tab-pane>

        <a-tab-pane key="password" title="密码管理">
          <Password />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<style lang="less" scoped>
  :deep(.arco-tabs-content) {
    padding-top: 60px;
  }
</style>
