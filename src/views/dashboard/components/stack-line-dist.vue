<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/composables/loading';
  import { ToolTipFormatterParams } from '@/global.d';
  import useChartOption from '@/composables/chart-option';
  import {
    QueryXxxxTrend,
    queryXxxxTrend,
    QueryXxxxTrendReq,
  } from '@/api/dashboard';
  import { Message } from '@arco-design/web-vue';
  import { ECharts } from 'echarts';
  import { omit, pick, sortBy } from 'lodash';

  // 工具函数
  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map((el) => {
        // 找到数据在value数组中的位置
        const idx =
          el.dimensionNames?.findIndex((itx) => itx === el.seriesName) || 0;
        return `<div class="content-panel">
            <p>
              <span style="background-color: ${
                el.color
              }" class="tooltip-item-icon"></span>
              <span>
              ${el.seriesName}
              </span>
            </p>
            <span class="tooltip-value">
              ${Number((el.value as any[])?.[idx]).toLocaleString()}
            </span>
          </div>`;
      })
      .join('');
  };

  const { t } = useI18n();

  const { loading, setLoading } = useLoading(false);

  // 请求参数
  const queryModel = reactive<QueryXxxxTrendReq>({
    timespan: 7,
  });

  // 原始数据
  const renderData = ref<QueryXxxxTrend[]>([]);

  // 聚焦时刻
  const currentFocusDataIndex = ref<number>(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await queryXxxxTrend(queryModel);
      // 重置变量避免造成影响
      // 数据处理
      // 防御性编程，避免
      // (data.list || []) 接口返回结果不规范（如：null等）
      currentFocusDataIndex.value = data.list?.length - 1 || 0;
      renderData.value = sortBy(data.list || [], 'datetime');
    } catch (err: any) {
      Message.error(err?.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();

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

  // 绘图数据
  const renderBarData = computed(() => {
    const dimensions = [
      'datetime',
      ...Object.keys(omit(renderData.value[0], ['datetime', 'score'])),
    ];
    return [
      // 第一行是维度
      // 须确保 datetime 在第一列
      dimensions.map((item: string) =>
        item === 'datetime' ? item : t(`media.type.text.${item}`),
      ),
      ...renderData.value.reduce((acc, cur) => {
        // 剥离 score 字段
        // 须确保 datetime 在第一列
        acc.push(dimensions.map((item: string) => cur[item]));
        return acc;
      }, [] as any[]),
    ];
  });

  const renderLineData = computed(() => {
    const dimensions = [
      'datetime',
      ...Object.keys(pick(renderData.value[0], ['score'])),
    ];
    return [
      // 第一行是维度
      // 须确保 datetime 在第一列
      dimensions.map((item: string) =>
        item === 'datetime' ? item : t(`media.type.text.${item}`),
      ),
      ...renderData.value.reduce((acc, cur) => {
        // 剥离 score 字段
        // 须确保 datetime 在第一列
        acc.push(dimensions.map((item: string) => cur[item]));
        return acc;
      }, [] as any[]),
    ];
  });

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
          // 绘制柱图
          source: renderBarData.value,
          sourceHeader: true, // 是否将数据源中的第一行作为维度
        },
        {
          // 维度
          // 用数据源中第一行数据作为维度
          // 默认是自动检测
          // dimensions: renderDimensions.value,
          // 数据源
          // 绘制线图
          source: renderLineData.value,
        },
        // 自行排序
        // 几个 transform 被声明成 array ，他们构成了一个链，
        // 前一个 transform 的输出是后一个 transform 的输入。
        // {
        //   transform: [
        //     {
        //       type: 'sort',
        //       // 时间正序
        //       config: { dimension: 'datetime', parser: 'time', order: 'asc' },
        //       // 打印数据用于调试
        //       print: true,
        //     },
        //   ],
        // },
      ],
      xAxis: {
        show: true,
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
          alignMinLabel: 'left',
          color: isDark ? 'rgb(246, 246, 246)' : 'rgb(29, 33, 41)',
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
          },
        },
        axisPointer: {
          show: true,
          type: 'line', // 曲线图用 line
          lineStyle: {
            width: 2,
          },
          handle: {
            show: true,
            size: 32,
            margin: 46,
            color: isDark ? '#ffffffe6' : '#1d2129',
          },
        },
      },
      yAxis: [
        // 柱图和线图y轴值域范围可能不一样
        // 以防万一，分开设置
        // bar
        {
          show: true,
          type: 'value',

          axisLabel: {
            formatter(value: number) {
              if (value < 1000) return value;
              return `${value / 1000}k`;
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: isDark ? 'rgb(72, 72, 73)' : 'rgb(229, 230, 235)',
            },
          },
        },
        // line
        {
          show: true,
          type: 'value',
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
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
        ...(renderLineData.value?.[0] || [])
          .filter((itx: string) => itx !== 'datetime')
          .map((item: string) => {
            return {
              name: item,
              type: 'line',
              smooth: true,
              datasetIndex: 1, // 重要
              // 系列被安放到 dataset 的列上面
              // 默认是 column
              seriesLayoutBy: 'column',
              encode: {
                // 重要
                x: 'datetime', // 指定 datetime 映射为 x 轴
                y: item,
                tooltip: ['datetime', item],
              },
              yAxisIndex: 1,
              emphasis: { focus: 'self' },
              symbol: 'circle',
              symbolSize: 8,
              lineStyle: {
                width: 3,
              },
              // 线条单独设置颜色，不占用 color 数组，确保柱图、饼图、图例颜色一致
              // 否则，因为饼图数据只与柱图数据联动，线图不参与联动，
              // 会导致颜色自动映射时错位，导致图例与饼图颜色不一致
              color: isDark ? '#4A7FF7' : '#246EFF',
            };
          }),
        ...(renderBarData.value?.[0] || [])
          .filter((itx: string) => itx !== 'datetime')
          .map((item: string) => {
            return {
              name: item,
              // stack: 'one', // 设置为一样的（任意）值堆表示堆叠
              type: 'line', // 'bar'
              smooth: true,
              // 系列被安放到 dataset 的列上面
              // 默认是 column
              datasetIndex: 0, // 重要
              seriesLayoutBy: 'column',
              encode: {
                // 重要
                x: 'datetime', // 指定 datetime 映射为 x 轴
                y: item,
              },
              yAxisIndex: 0,
              emphasis: { focus: 'self' },
              // 柱图颜色映射，确保柱图、饼图、图例颜色一致
              // itemStyle: {
              //   color: (params: any) => {
              //     // params.seriesName
              //     console.log('params', params);
              //     return colors[params.seriesName as keyof typeof colors];
              //   },
              // },
              // barWidth: 16,
            };
          }),
        {
          id: 'pie',
          type: 'pie',
          // 系列被安放到 dataset 的行上面
          // 绘制某一datetime时各项数据占比
          datasetIndex: 0, // 重要
          seriesLayoutBy: 'row',
          encode: {
            // 必须得有，不然数据项 name 为空
            // 关联 formatter 中的 {b}
            itemName: 0, // 'datetime' 第 0 列 即为 datetime
            value: currentFocusDataIndex.value,
          },
          left: 'left',
          right: '70%',
          width: '30%',
          radius: '30%',
          center: ['50%', '50%'],
          emphasis: {
            focus: 'self',
          },
          // 饼图颜色映射，确保柱图、饼图、图例颜色一致
          // itemStyle: {
          //   color: (params: any) => {
          //     // params.name
          //     console.log('params', params);
          //     return colors[params.name as keyof typeof colors];
          //   },
          // },
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
            if (points && points.length > 2) {
              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width;
            }
            return {
              labelLinePoints: points,
            };
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
  <a-card
    title="Xxxx分布"
    :loading="loading"
    :header-style="{ padding: '16px 16px 0', borderBottom: 'none' }"
    :body-style="{ paddingTop: 0 }"
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

    堆叠柱图/曲线/面积图分布 与 饼图的联动 示例

    <Chart
      ref="chartRef"
      autoresize
      :option="chartOption"
      style="height: 350px"
      @updateAxisPointer="handleUpdateAxisPointer"
    />
  </a-card>
</template>
