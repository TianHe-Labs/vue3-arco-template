<template>
  <div class="h-full flex flex-col gap-4 px-5 py-4">
    <Breadcrumb :items="['menu.user']" />
    <a-card
      :bordered="false"
      class="flex-auto"
      :body-style="{ height: '100%' }"
    >
      <a-tabs default-active-key="1" type="rounded" justify>
        <a-tab-pane key="1" :title="$t('UserProfile.tab.userInformation')">
          <BasicInfo class="py-10" />
        </a-tab-pane>
        <a-tab-pane key="2" :title="$t('UserProfile.tab.userPassword')">
          <Password class="py-10" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import BasicInfo from './components/basic-info.vue';
  import Password from './components/password.vue';
</script>

<script lang="ts">
  export default {
    name: 'UserProfile',
  };
</script>

<style lang="less" scoped>
  .wrapper {
    flex: 1 1 auto;
    min-height: 580px;
    padding: 20px 0 0 20px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
</style>
