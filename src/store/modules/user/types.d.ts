// eslint-disable-next-line no-shadow
export enum USERROLE {
  DEVELOPER = 'developer',
  ADMIN = 'admin',
  COMMON = 'common',
}

// 用户信息
// 根据具体业务场景，可以扩展字段
export interface UserState {
  id?: string;
  username?: string;
  nickname?: string;

  password?: string;

  role?: USERROLE;
  // roles?: USERROLE[]; // 多角色，应该复杂场景，暂时未使用

  avatar?: string;

  status?: string;

  org?: string;

  email?: string;
  phone?: string;

  accessToken?: string;
  refreshToken?: string;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
