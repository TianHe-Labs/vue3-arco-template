import { CallbackDataParams } from 'echarts/types/dist/shared';

export interface ToolTipFormatterParams extends CallbackDataParams {
  axisDim: string;
  axisIndex: number;
  axisType: string;
  axisId: string;
  axisValue: string;
  axisValueLabel: string;
}

export interface Pagination {
  current: number;
  pageSize: number;
}

export interface List<T> {
  total: number;
  list: T[];
}
