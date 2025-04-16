import axios from 'axios';
import qs from 'query-string';
import { List, Pagination } from '@/global';

export interface XxxxModel {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface QueryXxxxListReq extends Partial<XxxxModel> {
  keyword?: string;
}
export type QueryXxxxListRes = List<XxxxModel>;

export function queryXxxxList(params: QueryXxxxListReq & Pagination) {
  const { current, pageSize, ...data } = params;

  return axios.post<QueryXxxxListRes>('/api/xxxx/search', data, {
    params: { current, pageSize },
    paramsSerializer: (obj: Record<string, any>) => {
      return qs.stringify(obj);
    },
  });
}

// 删除 兼容批量
export interface DeleteXxxxReq {
  ids: XxxxModel['id'][];
}
export interface DeleteXxxxRes {
  ids: XxxxModel['id'][]; // 删除成功的ID
}

export function deleteXxxx(data: DeleteXxxxReq) {
  return axios.delete('/api/xxxx/delete', {
    data,
  });
}
