import axios from 'axios';
import qs from 'query-string';
import { List, Pagination } from '@/global';
import { OrgModel } from './org';

/**
 * 角色
 */
export enum USERROLE {
  DEVELOPER = 'developer',
  ADMIN = 'admin',
  COMMON = 'common',
}

/**
 * 状态
 */
export enum USERSTATUS {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

/**
 * 用户信息，可根据实际业务拓展
 */
export interface UserModel {
  id: string;
  username: string;
  nickname: string;

  password?: string;

  orgId?: string;
  orgName?: string;
  org?: OrgModel; // 关联查询

  role: USERROLE;
  // roles?: USERROLE[]; // 多角色，应该复杂场景，暂时未使用

  avatar: string;

  status: USERSTATUS;

  email: string;
  phone: string;

  createdAt: string | Date;
  updatedAt: string | Date;

  [property: string]: any; // 保留字段，用于扩展
}

/**
 * 查询用户列表
 */
export interface QueryUserListReq
  extends Partial<
    Pick<
      UserModel,
      | 'id'
      | 'username'
      | 'nickname'
      | 'email'
      | 'phone'
      | 'role'
      | 'orgId'
      | 'org'
      | 'status'
    >
  > {}
export type QueryUserListRes = List<UserModel>;

export function queryUserList(params: QueryUserListReq & Pagination) {
  const { current, pageSize, ...data } = params;

  return axios.post<QueryUserListRes>('/api/user/search', data, {
    params: { current, pageSize },
    paramsSerializer: (obj: Record<string, any>) => {
      return qs.stringify(obj);
    },
  });
}

/**
 * 导出用户列表（文件流），参数与查询一致，场景：导出查询结果
 */
export type ExportUserListReq = QueryUserListReq;

export function exportUserList(data: ExportUserListReq) {
  return axios.post('/api/user/export', data, {
    responseType: 'blob',
  });
}

/**
 * 创建或更新用户表单模型
 */
export type CreateUpdateUserModel = Partial<
  Pick<
    UserModel,
    | 'id'
    | 'username'
    | 'nickname'
    | 'status'
    | 'email'
    | 'phone'
    | 'role'
    | 'orgId'
    | 'orgName'
  >
>;

/**
 * 创建，单个（近似于更新，只是没有ID，页面逻辑上可以与更新复用）和批量
 */
export type CreateUserReq = List<CreateUpdateUserModel>;

// 返回创建成功的数据列表
export type CreateUserRes = List<Partial<UserModel>>;

export function createUser(data: CreateUserReq) {
  return axios.post('/api/user/create', data);
}

/**
 * 更新用户，单个
 */
export type UpdateUserReq = CreateUpdateUserModel;

export type UpdateUserRes = Partial<UserModel>;

export function updateUser(data: UpdateUserReq) {
  return axios.post('/api/user/update', data);
}

// 删除用户，单个和批量
export interface DeleteUserReq {
  ids: UserModel['id'][];
}
export interface DeleteUserRes {
  ids: UserModel['id'][]; // 删除成功的ID
}

export function deleteUser(data: DeleteUserReq) {
  return axios.delete('/api/user/delete', {
    data,
  });
}
