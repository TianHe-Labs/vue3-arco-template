import axios from 'axios';
import qs from 'query-string';
import { List, Pagination } from '@/global';

/**
 * 部门信息，可根据实际业务拓展
 */
export interface OrgModel {
  // ID 编号
  id: string;
  // 机构名称
  orgName: string;
  // 备注说明
  orgDescription?: string;
  // 上级部门
  parentOrgId?: string;
  // 上级部门名称
  parentOrgName?: string;
  parentOrg?: OrgModel; // 关联查询
  // 创建时间
  createdAt: string;
  // 更新时间
  updatedAt: string;

  [property: string]: any; // 保留字段，用于扩展
}

/**
 * 查询部门列表
 */
export type QueryOrgListReq = Partial<Pick<OrgModel, 'id' | 'orgName'>>;

export type QueryOrgListRes = List<OrgModel>;

export function queryOrgList(params: QueryOrgListReq & Pagination) {
  const { current, pageSize, ...data } = params;

  return axios.post<QueryOrgListRes>('/api/org/search', data, {
    params: { current, pageSize },
    paramsSerializer: (obj: Record<string, any>) => {
      return qs.stringify(obj);
    },
  });
}

/**
 * 导出部门列表清单
 */
export type ExportOrgListReq = QueryOrgListReq;

export function exportOrgList(data: ExportOrgListReq) {
  return axios.post('/api/org/export', data, {
    responseType: 'blob',
  });
}

/**
 * 创建或更新部门表单数据
 */
export type CreateUpdateOrgModel = Partial<
  Pick<
    OrgModel,
    'id' | 'orgName' | 'orgDescription' | 'parentOrgId' | 'parentOrgName'
  >
>;

/**
 * 创建部门，单个（近似于更新，只是没有ID，页面逻辑上可以与更新复用）和批量
 */
export type CreateOrgReq = List<CreateUpdateOrgModel>;

// 返回创建成功的数据列表
export type CreateOrgRes = List<Partial<OrgModel>>;

export function createOrg(data: CreateOrgReq) {
  return axios.post<CreateOrgRes>('/api/org/create', data);
}

/**
 * 更新部门，单个
 */
export type UpdateOrgReq = CreateUpdateOrgModel;

export type UpdateOrgRes = Partial<OrgModel>;

export function updateOrg(data: UpdateOrgReq) {
  return axios.put<UpdateOrgRes>('/api/org/update', data);
}

/**
 * 删除部门，单个和批量
 */
export interface DeleteOrgReq {
  ids: OrgModel['id'][]; // 要删除的部门IDs
}

export interface DeleteOrgRes {
  ids: OrgModel['id'][]; // 删除成功的部门IDs
}

export function deleteOrg(data: DeleteOrgReq) {
  return axios.delete('/api/org/delete', {
    data,
  });
}
