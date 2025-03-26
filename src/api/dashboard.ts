import axios from 'axios';

export interface QueryXxxxDistReq {
  timespan?: number; // 统计时间区间
}
export interface QueryXxxxDist {
  datetime: string; // 时间横轴
  [property: string]: any; // 多个统计属性
}

export function queryXxxxDist(params: QueryXxxxDistReq) {
  return axios.get<QueryXxxxDist[]>('/api/xxxx/dist', { params });
}
