<script lang="ts" setup>
  import Banner from './components/banner.vue';
  import BasicInfo from './components/basic-info.vue';
  import Password from './components/password.vue';
</script>

<template>
  <div class="h-full flex flex-col gap-4 p-4">
    <Breadcrumb :items="['menu.account', 'menu.account.setting']" />

    <Banner />

    <a-card
      class="flex-auto"
      :body-style="{ height: '100%', paddingTop: '8px' }"
    >
      <a-tabs justify :header-padding="false">
        <a-tab-pane key="basicInfo" title="基本信息">
          <BasicInfo />
        </a-tab-pane>

        <a-tab-pane key="password" title="密码设置">
          <Password />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'AccountSetting',
  };
</script>

<style lang="less" scoped>
  :deep(.arco-tabs-content) {
    padding-top: 60px;
  }
</style>
