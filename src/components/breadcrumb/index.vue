<template>
  <a-breadcrumb>
    <a-breadcrumb-item>
      <icon-apps />
    </a-breadcrumb-item>
    <template v-for="(item, index) in items" :key="index">
      <a-breadcrumb-item class="opacity-75">
        <router-link v-if="isBreadcrumbRoute(item)" :to="item">
          {{ item.label }}
        </router-link>
        <template v-else-if="te(item)">
          {{ t(item) }}
        </template>
        <template v-else>
          {{ item }}
        </template>
      </a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
  import { BreadcrumbRoute } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';

  const { te, t } = useI18n();

  withDefaults(
    defineProps<{
      items: (string | BreadcrumbRoute)[];
    }>(),
    {
      items: () => [],
    }
  );
  const isBreadcrumbRoute = (
    item: string | BreadcrumbRoute
  ): item is BreadcrumbRoute => {
    return (item as BreadcrumbRoute).label !== undefined;
  };
</script>
