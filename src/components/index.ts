import { App, h } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  MapChart,
} from 'echarts/charts';
import {
  GeoComponent,
  VisualMapComponent,
  GridComponent,
  AxisPointerComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components';

import Chart from 'vue-echarts';
import Breadcrumb from './breadcrumb/index.vue';
import DynamicTag from './dynamic-tag/index.vue';
import ExtendedInputTag from './extended-input-tag/index.vue';

// Manually introduce ECharts modules to reduce packing size

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  MapChart,
  GeoComponent,
  VisualMapComponent,
  GridComponent,
  TooltipComponent,
  AxisPointerComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
  DatasetComponent,
  TransformComponent,
]);

export default {
  install(Vue: App) {
    Vue.component(
      'Chart',
      h(Chart, {
        loadingOptions: {
          text: '',
          maskColor: 'transparent',
          lineWidth: 2,
        },
      }),
    );
    Vue.component('Breadcrumb', Breadcrumb);
    Vue.component('DynamicTag', DynamicTag);
    Vue.component('ExtendedInputTag', ExtendedInputTag);
  },
};
