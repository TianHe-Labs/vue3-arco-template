<template>
  <div class="h-full flex flex-col mb-5 px-5 pb-5">
    <Breadcrumb :items="['menu.userCenter']" />
    <a-card
      :bordered="false"
      class="flex-auto"
      :body-style="{ height: '100%' }"
    >
      <a-tabs default-active-key="1" type="rounded" justify>
        <a-tab-pane key="1" :title="$t('userSettings.tab.userInformation')">
          <UserInformation class="py-10" />
        </a-tab-pane>
        <a-tab-pane key="2" :title="$t('userSettings.tab.userPassword')">
          <userPassword class="py-10" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import UserInformation from './components/user-information.vue';
  import UserPassword from './components/user-password.vue';
</script>

<script lang="ts">
  export default {
    name: 'UserSettings',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px;
  }

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
