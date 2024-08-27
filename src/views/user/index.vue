<template>
  <div class="h-full flex flex-col gap-4 px-5 py-4">
    <Breadcrumb :items="['menu.user']" />
    <div class="flex flex-wrap md:flex-nowrap gap-5">
      <a-card
        class="flex-auto rounded"
        :bordered="false"
        :header-style="{ border: 'none' }"
        :body-style="{ height: '100%' }"
        :title="t('information.form.title')"
      >
        <Information />
      </a-card>
      <a-card
        class="flex-auto rounded"
        :bordered="false"
        :header-style="{ border: 'none' }"
        :body-style="{ height: '100%' }"
        :title="t('password.form.title')"
      >
        <Password />
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import Information from './components/information.vue';
  import Password from './components/password.vue';

  const { t } = useI18n();
</script>

<script lang="ts">
  export default {
    name: 'Profile',
  };
</script>
