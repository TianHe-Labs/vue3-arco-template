<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    dayjs,
    formatNumber,
    formatNumberEnAbbr,
    formatNumberZhAbbr,
  } from '@/utils/format';
  import { enum2Arr } from '@/utils/transform';
  import { USERROLE } from '@/store/modules/user/types';
  import Banner from './components/banner.vue';
  import StackBarDist from './components/stack-bar-dist.vue';
  import DynamicTag from '@/components/dynamic-tag/index.vue';
  import ExtendedInputTag from '@/components/extended-input-tag/index.vue';

  const dynamicTagRef = ref<InstanceType<typeof DynamicTag>>();
  const tags = ref<string[]>([]);
  // 标签数据映射
  const tagMap: Record<string, string> = {
    '1': '标签一',
    '2': '标签二',
    '3': '标签三',
  };
  // 格式化标签显示值
  const formatTagLabel = (id: string) => {
    return tagMap[id] || id;
  };

  const handleAddButtonClick = () => {
    dynamicTagRef.value?.addTag('1');
  };
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4">
    <Breadcrumb :items="['menu.dashboard']" />
    <Banner />
    <StackBarDist />

    <div class="flex flex-col gap-4 p-4 bg-bg-2">
      <ExtendedInputTag v-model="tags" />

      <!-- 开启 customMode 属性，监听 add-button-click 事件 -->
      <!-- 通过调用暴漏出的方法 dynamicTagRef.addTag 自定义地添加标签 -->
      <DynamicTag
        v-model="tags"
        ref="dynamicTagRef"
        custom-mode
        :format-tag="formatTagLabel"
        @add-button-click="handleAddButtonClick"
        class="!w-800px"
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
