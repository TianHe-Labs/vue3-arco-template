import axios from 'axios';
import qs from 'query-string';
import { List, Pagination } from '@/global';
import { UserState } from '@/store/modules/user/types.d';

export interface UserModel
  extends Omit<UserState, 'accessToken' | 'refreshToken'> {}

export interface QueryUserListReq extends Partial<UserModel> {}
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

// 创建/更新
// 创建时没有ID
export type CreateOrUpdateUserReq = Partial<UserModel>;
export type CreateOrUpdateUserRes = Partial<UserModel>;
// 创建用户时需要把密码返回

export function createOrUpdateUser(data: CreateOrUpdateUserReq) {
  return axios.post('/api/user/create-update', data);
}

// 删除 兼容批量
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
