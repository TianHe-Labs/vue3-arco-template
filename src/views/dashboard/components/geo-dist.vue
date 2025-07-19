<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { ECharts, registerMap } from 'echarts';
  import useLoading from '@/composables/loading';
  import { ToolTipFormatterParams } from '@/global.d';
  import useChartOption from '@/composables/chart-option';
  import {
    queryXxxxGeoDist,
    QueryXxxxGeoDistReq,
    QueryXxxxGeoDist,
  } from '@/api/dashboard';
  import worldJson from '@/assets/geo/world.json';
  import names from '@/assets/geo/names.json';
  import { sortBy } from 'lodash';

  const { loading, setLoading } = useLoading(true);

  // 请求参数
  const queryModel = reactive<QueryXxxxGeoDistReq>({
    timespan: 7,
  });

  // 绘图数据
  const renderData = ref<QueryXxxxGeoDist[]>([]);

  // 聚焦时刻
  const currentFocusDataIndex = ref<number>(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await queryXxxxGeoDist(queryModel);
      currentFocusDataIndex.value = data.list?.length - 1 || 0;
      // 按照 value 排个序，饼图层级更清晰
      renderData.value = sortBy(data.list || [], 'value');
    } catch (err: any) {
      Message.error(err?.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();

  // 绘图
  // 堆叠柱状图/曲线/面积图分布示例
  // 统一使用数据集的方式来传入数据
  // https://echarts.apache.org/handbook/zh/concepts/dataset/
  // 这样可以是实现图之间的联动
  // 在曲线图或者堆叠柱图中，聚焦某一x轴时，同步使用饼图的方式来显示比例
  const chartRef = ref<ECharts | null>(null);
  const { chartOption } = useChartOption((isDark) => {
    registerMap('world', worldJson as any);
    return {
      legend: {
        show: false,
        top: 'top',
        left: 'left',
        padding: [16, 0],
        itemGap: 15,
        icon: 'circle',
        textStyle: {
          color: isDark ? 'rgb(246, 246, 246)' : 'rgb(29, 33, 41)',
        },
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter(params: any) {
          return `<div>
            <p class="tooltip-title">${params.name}</p>
            <div class="content-panel">
            <p>
              <span style="background-color: ${
                params.color
              }" class="tooltip-item-icon"></span>
            </p>
            <span class="tooltip-value">
              ${Number(params.value || 0).toLocaleString()}
            </span>
          </div>
          </div>`;
        },
        className: 'echarts-tooltip-diy',
      },
      color: ['#246EFF', '#00B2FF', '#0E42D2', '#81E2FF'],
      visualMap: [
        {
          show: true,
          type: 'continuous',
          min: 0,
          max: Math.max(
            ...(renderData.value || []).map((item) => item.value),
            0,
          ),
        },
      ],
      // 如果需要在地图上绘制叠加其他图形
      // 通过 geo 绘图地图设置为 地图 取代坐标系
      geo: [
        {
          show: true,
          map: 'world',
          roam: false,
          // nameMap: names, // 国家中英文映射关系，此处需要适配国际化问题
          top: 0,
          bottom: 0,
          left: 0,
          // 特定区域样式
          regions: [],
          label: {},
          z: 1,
        },
      ],
      series: [
        {
          name: 'geoDist',
          // geo 和 map 同时使用，会出现两个图层
          // 所以需要将 map 的图层设置为 geo 的图层
          geoIndex: 0,
          type: 'map',
          map: 'world',
          colorBy: 'data',
          select: {
            label: {
              show: true,
            },
            itemStyle: {},
          },
          // color: isDark ? '#3D72F6' : '#246EFF',
          // nameMap: names, // 国家中英文映射关系，此处需要适配国际化问题
          data: renderData.value,
          z: 9,
        },
        // 饼图联动，更直观的比例
        {
          // 轨迹分布 颜色地图 分布
          name: 'pieDist',
          type: 'pie',
          left: '60%',
          radius: ['0%', '50%'],
          colorBy: 'data',
          emphasis: {
            focus: 'self',
          },
          select: {
            label: {
              show: true,
            },
            itemStyle: {},
          },
          // color: isDark ? '#3D72F6' : '#246EFF',
          nameMap: names, // 国家中英文映射关系，此处需要适配国际化问题
          data: renderData.value,
          label: {
            alignTo: 'edge',
            formatter: `{name|{b}}：{ratio|{d}%}`,
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
        },
      ] as any[],
    };
  });
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
        autoresize
        :option="chartOption"
        style="height: 350px"
      />
    </a-card>
  </a-spin>
</template>
