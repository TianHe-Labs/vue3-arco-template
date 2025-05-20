<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    dayjs,
    formatNumber,
    formatNumberEnAbbr,
    formatNumberZhAbbr,
  } from '@/utils/format';
  import { enum2Arr } from '@/utils/transform';
  import { USERROLE } from '@/store/modules/user/types.d';
  import Banner from './components/banner.vue';
  import StackBarDist from './components/stack-bar-dist.vue';
  import DynamicTag, { TagItem } from '@/components/dynamic-tag/index.vue';
  import ExtendedInputTag from '@/components/extended-input-tag/index.vue';

  const inputTags = ref<string[]>([]);

  const dynamicTagRef = ref<InstanceType<typeof DynamicTag>>();
  const dynamicTags = ref<TagItem[]>([]);
  // 标签数据映射
  const tagMap: Record<string, string> = {
    '1': '标签一',
    '2': '标签二',
    '3': '标签三',
  };
  // 格式化标签显示值
  const formatTagLabel = (item: TagItem) => {
    return (
      (item as any)?.name ||
      tagMap[(item as any)?.id || item] ||
      (item as string)
    );
  };

  const handleAddButtonClick = () => {
    // 通过组件内的方法可以触发相关事件
    dynamicTagRef.value?.addTag({ id: '1', name: '标签一' });

    // 当然也可以直接修改绑定的变量值
    // dynamicTags.value.push({ id: '1', name: '标签一' });
  };
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4">
    <Breadcrumb :items="['menu.dashboard']" />
    <Banner />
    <StackBarDist />

    <div class="flex flex-col gap-4 p-4 bg-bg-2">
      {{ inputTags }}

      <ExtendedInputTag v-model="inputTags" />

      {{ dynamicTags }}

      <!-- 开启 customMode 属性，监听 add-button-click 事件 -->
      <DynamicTag
        v-model="dynamicTags"
        ref="dynamicTagRef"
        value-key="id"
        :unique-value="true"
        :custom-mode="true"
        :format-tag="formatTagLabel"
        :vertical="true"
        @add-button-click="handleAddButtonClick"
      />

      <div> 当前时间：{{ dayjs().format('YYYY-MM-DD HH:mm:ss') }} </div>

      <div>
        事件格式化 dayjs()： 2000-04-18 12:00:00 距今
        {{ dayjs('2000-04-18 12:00:00').fromNow() }}
      </div>

      <div>
        209032323 千位分隔符格式化 formatNumber：{{ formatNumber(209032323) }}
      </div>

      <div>
        209032323 英文单位格式化 formatNumberEnAbbr：{{
          formatNumberEnAbbr(209032323)
        }}
      </div>

      <div>
        209032323 中文单位格式化 formatNumberZhAbbr：{{
          formatNumberZhAbbr(209032323)
        }}
      </div>

      <div> 用户角色（类型定义转数组）：{{ enum2Arr(USERROLE) }} </div>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'Dashboard',
  };
</script>
