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

/**
 * 查询列表
 * 传入 id 参数时，其优先级最高，其余参数可以忽略，可以表示查询详情，此时返回单个数据
 * 这样可以减少不必要的接口数量，同时让前端的相关逻辑也可以复用
 */
export interface QueryXxxxListReq extends Partial<XxxxModel> {
  createdRange?: string[]; // 创建时间范围
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

/**
 * 导出，参数与查询列表相同，返回 blob 文件流
 */
export function exportXxxxList(data: QueryXxxxListReq) {
  return axios.post('/api/xxxx/export', data, {
    responseType: 'blob',
  });
}

/**
 * 创建或更新表单模型
 */
export type CreateUpdateXxxxModel = Partial<
  Pick<XxxxModel, 'id' | 'name' | 'description' | 'tags'>
>;

/**
 * 创建，单个（近似于更新，只是没有ID，页面逻辑上可以与更新复用）和批量
 */

export type CreateXxxxReq = List<CreateUpdateXxxxModel>;

// 返回创建成功的数据列表
export type CreateXxxxRes = List<CreateUpdateXxxxModel>;

export function createXxxx(data: CreateXxxxReq) {
  return axios.post<CreateXxxxRes>('/api/xxxx/create', data);
}

/**
 * 更新
 */
export type UpdateXxxxReq = CreateUpdateXxxxModel;

export type UpdateXxxxRes = Partial<XxxxModel>;

export function updateXxxx(data: UpdateXxxxReq) {
  return axios.put<UpdateXxxxRes>('/api/xxxx/update', data);
}

/**
 * 删除，单个和批量，其他批量操作的，可以参考这个接口
 */
export interface DeleteXxxxReq {
  ids: XxxxModel['id'][];
}
export interface DeleteXxxxRes {
  ids: XxxxModel['id'][]; // 删除成功的IDs
}

export function deleteXxxx(data: DeleteXxxxReq) {
  return axios.delete('/api/xxxx/delete', {
    data,
  });
}
