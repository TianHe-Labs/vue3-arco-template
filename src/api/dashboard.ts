import axios from 'axios';
import { List } from '@/global';

export interface QueryXxxxTrendReq {
  timespan?: number; // 统计时间区间
}
export interface QueryXxxxTrend {
  datetime: string; // 时间横轴
  [property: string]: any; // 多个统计属性
}
export type QueryXxxxTrendRes = List<QueryXxxxTrend>;

export function queryXxxxTrend(params: QueryXxxxTrendReq) {
  return axios.get<QueryXxxxTrendRes>('/api/xxxx/trend', { params });
}

export interface QueryXxxxGeoDistReq {
  timespan?: number; // 统计时间区间
}
export interface QueryXxxxGeoDist {
  name: string; // 国家名称
  value: number; // 统计值
}
export type QueryXxxxGeoDistRes = List<QueryXxxxGeoDist>;

export function queryXxxxGeoDist(params: QueryXxxxGeoDistReq) {
  return axios.get<QueryXxxxGeoDistRes>('/api/xxxx/geo-dist', { params });
}
