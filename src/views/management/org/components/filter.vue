<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { useSearchOrg } from '../composables/search';

  const {
    queryFormRef,
    queryModel,
    fuzzyQueryModel,
    fetchData,
    handleResetQueryModel,
  } = useSearchOrg();

  const { t } = useI18n();

  const fuzzyKeyOptions = [
    {
      label: '部门名称',
      value: 'orgName',
    },
    {
      label: '部门描述',
      value: 'orgDescription',
    },
  ];
</script>

<template>
  <a-card :bordered="false" :body-style="{ paddingTop: '20px' }">
    <a-form ref="queryFormRef" :model="queryModel" auto-label-width>
      <div class="grid lg:grid-cols-2 gap-x-4">
        <!-- 精确匹配 -->
        <!-- <a-form-item field="orgLevel" label="部门层级" :rules="[]">
          <a-radio-group
            v-model="queryModel.orgLevel"
            :options="levelOptions"
          />
        </a-form-item> -->

        <!-- 指定属性的全文检索 -->
        <!-- orgName, orgDescription, orgArea -->
        <a-form-item
          label="全文检索"
          class="lg:col-span-2"
          content-class="flex-wrap gap-2"
        >
          <a-input-search
            v-model="fuzzyQueryModel.fuzzyText"
            allow-clear
            placeholder="输入检索关键字"
            @press-enter="fetchData"
            @clear="fetchData"
          >
            <template #suffix>
              <a-divider
                direction="vertical"
                class="!hidden !lg:inline-block"
              />
              <a-select
                v-model="fuzzyQueryModel.fuzzyKeys"
                multiple
                show-header-on-empty
                :bordered="false"
                :max-tag-count="2"
                :allow-search="false"
                :show-extra-options="false"
                :options="fuzzyKeyOptions"
                placeholde="选择关键字要匹配的属性"
                class="!hidden !lg:flex !p-0 flex-none !w-240px custom-select"
              >
                <template #arrow-icon>
                  <icon-select-all />
                </template>
                <template #header>
                  <div p="x-4 y-2" text="text-3"> 选择匹配属性 </div>
                </template>
              </a-select>
            </template>
          </a-input-search>
          <a-select
            v-model="fuzzyQueryModel.fuzzyKeys"
            multiple
            show-header-on-empty
            :allow-search="false"
            :show-extra-options="false"
            :options="fuzzyKeyOptions"
            placeholde="选择关键字要匹配的属性"
            class="!lg:hidden"
          >
            <template #arrow-icon>
              <icon-select-all />
            </template>
            <template #header>
              <div p="x-4 y-2" text="text-3"> 选择匹配属性 </div>
            </template>
          </a-select>
        </a-form-item>
      </div>
    </a-form>

    <a-divider class="!mt-0" />

    <div class="h-full flex gap-4">
      <!-- 占位将左、右多个元素分别挤压到两侧，减少标签嵌套 -->
      <div class="flex-auto"></div>
      <a-button @click="handleResetQueryModel()">
        <template #icon>
          <icon-refresh />
        </template>
        重置
      </a-button>
      <a-button type="primary" @click="fetchData">
        <template #icon>
          <icon-search />
        </template>
        检索
      </a-button>
    </div>
  </a-card>
</template>
