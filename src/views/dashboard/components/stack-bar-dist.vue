<template>
  <!-- 堆叠柱图/曲线/面积图分布示例 -->
  <a-spin :loading="loading">
    <a-card
      title="Xxxx分布"
      :bordered="false"
      :header-style="{ borderBottom: 'none', paddingBottom: 0 }"
      :body-style="{ paddingTop: 0 }"
      class="rounded"
    >
      <template #extra>
        <!-- 时间 -->
        <a-select
          v-model="queryModel.timespan"
          :bordered="false"
          :options="[3, 7, 15, 30]"
          allow-create
          size="mini"
          class="!w-76px !px-1 !text-right !text-primary"
          @change="fetchData"
        >
          <!-- 选择框展示内容 -->
          <template #label="{ data }">
            <span>{{ $t('dateRange.shortcuts', [data.value]) }}</span>
          </template>
        </a-select>
      </template>
      <Chart style="height: 350px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { isEmpty, mapValues, mergeWith } from 'lodash';
  import useLoading from '@/composables/loading';
  import { ToolTipFormatterParams } from '@/global';
  import useChartOption from '@/composables/chart-option';
  import {
    queryXxxxDist,
    QueryXxxxDistReq,
    QueryXxxxDist,
  } from '@/api/dashboard';
  import { matchNumber } from '@/utils/transform';
  import { Message } from '@arco-design/web-vue';
  // import { formatNumberEnAbbr } from '@/utils/format';

  const { loading, setLoading } = useLoading(true);

  // 请求参数
  const queryModel = reactive<QueryXxxxDistReq>({
    timespan: 7,
  });

  // 绘图数据
  const xAxisData = ref<string[]>([]);
  const chartData = ref<any>({} as any);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await queryXxxxDist(queryModel);
      /**
       * [
       *    {
       *      datetime: '2024-03-18 19:00:00',
       *      image: 40,
       *      text: 21,
       *      audio: 19,
       *      video: 23
       *    },
       *    {
       *      datetime: '2024-03-18 21:00:00',
       *      image: 28,
       *      text: 11,
       *      audio: 10,
       *      video: 43
       *    },
       *    ...
       * ]
       *
       * ==>
       *
       * 根据统计属性 image 等
       * 按照统计尺度（通常为时间 datetime）顺序转换为 chart 对应的多个 serial
       * {
       *    image: [40, 28],
       *    text: [21, 11],
       *    audio: [19, 10],
       *    video: [23, 43],
       * }
       *
       */

      // 重置变量避免造成影响
      xAxisData.value = [];
      chartData.value = {};

      // 数据处理
      let obj: any = {};
      // 防御性编程，避免
      // 1. (data || []) 接口返回结果不规范（如：null等）
      // 2. data 未按照规定顺序排序，通常要求按照时间正序排列
      // datetime 通常为 '2024-03-18 21:00:00'
      // 用正则方式matchNumber匹配出数字来做比较（仅供参考）
      (data || [])
        .sort(
          (prev, next) =>
            matchNumber(prev?.datetime) - matchNumber(next?.datetime),
        )
        .forEach((item: QueryXxxxDist) => {
          const { datetime, ...values } = item;

          // 横轴
          xAxisData.value.push(datetime);

          // 数据
          if (isEmpty(obj)) {
            obj = mapValues(values, (val) => [val]);
          } else {
            obj = mergeWith(obj, values, (objVal: number[], srcVal: number) => {
              return objVal.concat(srcVal);
            });
          }
        });

      chartData.value = obj;
    } catch (err: any) {
      Message.error(err?.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();

  // 工具函数
  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map(
        (el) =>
          `<div class="content-panel">
            <p>
              <span style="background-color: ${
                el.color
              }" class="tooltip-item-icon"></span>
              <span>
              ${el.seriesName}
              </span>
            </p>
            <span class="tooltip-value">
              ${Number(el.value).toLocaleString()}
            </span>
          </div>`,
      )
      .join('');
  };

  // 绘图
  const { chartOption } = useChartOption((isDark) => {
    return {
      grid: {
        left: 32,
        right: 0,
        top: 32,
        bottom: 24,
      },
      legend: {
        top: 'top',
        padding: [0, 10],
        itemGap: 15,
        icon: 'circle',
        textStyle: {
          color: '#4E5969',
        },
      },
      xAxis: {
        type: 'category',
        data: xAxisData.value,
        axisLine: {
          lineStyle: {
            color: isDark ? '#3f3f3f' : '#A9AEB8',
          },
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          lineStyle: {
            color: '#86909C',
          },
        },
        axisLabel: {
          color: '#86909C',
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#86909C',
          // formatter(value: number, idx: number) {
          //   if (idx === 0) return value;
          //   return formatNumberEnAbbr(value);
          // },
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#3F3F3F' : '#E5E6EB',
          },
        },
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter(params) {
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
          </div>`;
        },
        className: 'echarts-tooltip-diy',
      },
      color: ['#246EFF', '#00B2FF', '#0E42D2', '#81E2FF'],
      series: Object.entries(chartData.value).map(([serial, data]) => {
        return {
          name: serial,
          data,
          stack: 'one',
          type: 'bar',
          barWidth: 16,
          // color: isDark ? '#4A7FF7' : '#246EFF',
        } as any;
      }),
    };
  });
</script>
