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
  // 总数，有些地方不需要
  total?: number;
  // 为了拓展性，列表数据放在 list 下
  list: T[];
}

interface SelectionState {
  visible: boolean;
  checked: string[];
}
