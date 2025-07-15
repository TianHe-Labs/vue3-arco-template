<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { isEmpty, mapValues, mergeWith, omit } from 'lodash';
  import useLoading from '@/composables/loading';
  import { ToolTipFormatterParams } from '@/global.d';
  import useChartOption from '@/composables/chart-option';
  import {
    queryXxxxTrend,
    QueryXxxxTrendReq,
    QueryXxxxTrend,
  } from '@/api/dashboard';
  import { Message } from '@arco-design/web-vue';
  import { ECharts } from 'echarts';

  const { loading, setLoading } = useLoading(true);

  // 请求参数
  const queryModel = reactive<QueryXxxxTrendReq>({
    timespan: 7,
  });

  // 绘图数据
  const renderData = ref<any[]>([]);

  // 聚焦时刻
  const currentFocusDataIndex = ref<number>(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await queryXxxxTrend(queryModel);
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
       * 转化为
       * [
       *    ['datetime', 'image', 'text', 'audio', 'video'],
       *    ['2024-03-18 19:00:00', 40, 21, 19, 23],
       *    ['2024-03-18 21:00:00', 28, 11, 10, 43],
       *    ...
       * ]
       * 生成共享dataset用于绘图，并实现图之间的联动
       *
       */

      // 重置变量避免造成影响
      // 数据处理
      // 防御性编程，避免
      // (data.list || []) 接口返回结果不规范（如：null等）
      currentFocusDataIndex.value = data.list?.length - 1 || 0;
      renderData.value = (data.list || []).reduce(
        (acc, cur) => {
          acc.push(Object.values(cur));
          return acc;
        },
        [Object.keys(data.list?.[0] || {})],
      );
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
        (el, idx) =>
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
              ${Number((el.value as any[])?.[idx + 1]).toLocaleString()}
            </span>
          </div>`,
      )
      .join('');
  };

  // 绘图
  // 堆叠柱状图/曲线/面积图分布示例
  // 统一使用数据集的方式来传入数据
  // https://echarts.apache.org/handbook/zh/concepts/dataset/
  // 这样可以是实现图之间的联动
  // 在曲线图或者堆叠柱图中，聚焦某一x轴时，同步使用饼图的方式来显示比例
  const chartRef = ref<ECharts | null>(null);
  const { chartOption } = useChartOption((isDark) => {
    return {
      grid: {
        left: '35%',
        right: 12,
        top: 24,
        bottom: 24,
      },
      legend: {
        top: 'top',
        left: 'left',
        padding: [16, 0],
        itemGap: 15,
        icon: 'circle',
        textStyle: {
          color: isDark ? 'rgb(246, 246, 246)' : 'rgb(29, 33, 41)',
        },
      },

      // https://echarts.apache.org/zh/option.html#dataset
      dataset: [
        {
          // 维度
          // 用数据源中第一行数据作为维度
          // 默认是自动检测
          // dimensions: renderDimensions.value,
          // 数据源
          source: renderData.value,
        },
        // 几个 transform 被声明成 array ，他们构成了一个链，
        // 前一个 transform 的输出是后一个 transform 的输入。
        {
          transform: [
            {
              type: 'sort',
              // 时间正序
              config: { dimension: 'datetime', order: 'asc' },
              // 打印数据用于调试
              print: true,
            },
          ],
        },
      ],
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: isDark ? '#3f3f3f' : '#A9AEB8',
          },
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          // lineStyle: {
          //   color: '#86909C',
          // },
        },
        axisLabel: {
          color: isDark ? 'rgb(246, 246, 246)' : 'rgb(29, 33, 41)',
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          // formatter(value: number, idx: number) {
          //   if (idx === 0) return value;
          //   return formatNumberEnAbbr(value);
          // },
        },
        splitLine: {
          lineStyle: {
            color: isDark ? 'rgb(72, 72, 73)' : 'rgb(229, 230, 235)',
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
      series: [
        ...(renderData.value?.[0]?.slice(1) || []).map((item: string) => {
          return {
            name: item,
            stack: 'one',
            type: 'line', // 'bar'
            // smooth: true,
            // 系列被安放到 dataset 的列上面
            // 默认是 column
            seriesLayoutBy: 'column',
            emphasis: { focus: 'series' },
            barWidth: 16,
            // color: isDark ? '#4A7FF7' : '#246EFF',
          };
        }),
        {
          id: 'pie',
          type: 'pie',
          // 系列被安放到 dataset 的行上面
          // 绘制某一datetime时各项数据占比
          seriesLayoutBy: 'row',
          left: 'left',
          right: '70%',
          width: '30%',
          radius: '30%',
          center: ['50%', '50%'],
          emphasis: {
            focus: 'self',
          },
          label: {
            alignTo: 'edge',
            formatter: `{name|{b}: {@${currentFocusDataIndex.value}}}\n {ratio|{d}%}`,
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 18,
            rich: {
              name: {
                fontSize: 12,
                color: isDark ? 'rgb(246, 246, 246)' : 'rgb(29, 33, 41)',
              },
              ratio: {
                fontSize: 10,
                color: isDark ? 'rgb(197, 197, 197)' : 'rgb(78, 89, 105)',
              },
            },
          },
          // 标签引导线调整
          // https://echarts.apache.org/examples/zh/editor.html?c=pie-labelLine-adjust
          labelLine: {
            length: 15,
            length2: 0,
            maxSurfaceAngle: 80,
          },
          labelLayout: function (params: any) {
            // 饼图占据左边 30% 的宽度
            const isLeft =
              params.labelRect.x <
              ((chartRef.value?.getWidth() as number) * 0.3) / 2;
            const points = params.labelLinePoints;
            // Update the end point.
            points[2][0] = isLeft
              ? params.labelRect.x
              : params.labelRect.x + params.labelRect.width;
            return {
              labelLinePoints: points,
            };
          },
          encode: {
            // 必须得有，不然数据项 name 为空
            // 关联 formatter 中的 {b}
            itemName: 'datetime',
            value: currentFocusDataIndex.value,
          },
        },
      ] as any[],
    };
  });

  const handleUpdateAxisPointer = (params: any) => {
    currentFocusDataIndex.value =
      params?.axesInfo?.[0]?.value + 1 || renderData.value.length - 1;
    // 默认值：最新 datetime
  };
</script>

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
      <Chart
        ref="chartRef"
        style="height: 350px"
        :option="chartOption"
        @updateAxisPointer="handleUpdateAxisPointer"
      />
    </a-card>
  </a-spin>
</template>
