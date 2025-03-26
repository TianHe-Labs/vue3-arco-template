import axios from 'axios';
import qs from 'query-string';
import { List, Pagination } from '@/global';
import { UserState } from '@/store/modules/user/types';

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

// 删除
// 兼容批量
export interface DeleteUserReq {
  ids: UserModel['id'][];
}
// 返回结果虽然定义上与请求相同，但是它代表的是删除失败的ID
// 以此来告诉用户哪些操作失败了
export type DeleteUserRes = DeleteUserReq;

export function deleteUser(data: DeleteUserReq) {
  return axios.delete('/api/user/delete', {
    data,
  });
}
