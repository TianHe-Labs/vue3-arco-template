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

// 导出
export function exportXxxxList(data: QueryXxxxListReq) {
  return axios.post('/api/xxxx/export', data, {
    responseType: 'blob',
  });
}

// 创建（如果需要批量添加时，单个/批量二合一）
export type CreateXxxxModel = Pick<XxxxModel, 'name' | 'description' | 'tags'>;

export type CreateXxxxReq = List<CreateXxxxModel>;

// 返回创建失败的 CreateXxxxModel 保留显示给用户
export type CreateXxxxRes = List<CreateXxxxModel>;

export function createXxxx(data: CreateXxxxReq) {
  return axios.post<CreateXxxxRes>('/api/xxxx/create', data);
}

// 更新
export type UpdateXxxxReq = Pick<XxxxModel, 'id'> &
  Partial<Pick<XxxxModel, 'id' | 'name' | 'description' | 'tags'>>;
export type UpdateXxxxRes = XxxxModel;

export function updateXxxx(data: UpdateXxxxReq) {
  return axios.put<UpdateXxxxRes>('/api/xxxx/update', data);
}

// 创建/更新（如果不需要批量创建或者不支持批量创建，创建和更新接口可以合并）
// 页面逻辑上，可以共用一个弹窗
export type CreateOrUpdateXxxxReq = Partial<XxxxModel>;
export type CreateOrUpdateXxxxRes = XxxxModel;

export function createOrUpdateXxxx(data: CreateOrUpdateXxxxReq) {
  return axios.post<CreateOrUpdateXxxxRes>('/api/xxxx/create-update', data);
}

// 删除 （单个/批量二合一）
// 其他需要批量操作的，可以参考这个接口
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
