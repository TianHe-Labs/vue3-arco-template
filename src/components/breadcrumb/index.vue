<template>
  <a-breadcrumb>
    <a-breadcrumb-item>
      <icon-apps />
    </a-breadcrumb-item>
    <template v-for="item in items" :key="item?.path || item">
      <a-breadcrumb-item class="opacity-75">
        <router-link v-if="isBreadcrumbRoute(item)" :to="item">
          {{ t(item.label) }}
        </router-link>
        <template v-else>
          {{ t(item) }}
        </template>
      </a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import type { BreadcrumbRoute } from '@arco-design/web-vue';

  withDefaults(
    defineProps<{
      items: (string | BreadcrumbRoute)[];
    }>(),
    {
      items: () => [],
    },
  );

  const { t } = useI18n();

  const isBreadcrumbRoute = (
    item: string | BreadcrumbRoute,
  ): item is BreadcrumbRoute => {
    return (item as BreadcrumbRoute).label !== undefined;
  };
</script>
