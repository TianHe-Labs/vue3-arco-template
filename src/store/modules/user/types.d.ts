// eslint-disable-next-line no-shadow
export enum USERROLE {
  DEVELOPER = 'developer',
  ADMIN = 'admin',
  COMMON = 'common',
}

export interface UserState {
  id?: string;
  username?: string;
  nickname?: string;

  password?: string;

  role?: USERROLE;
  // roles?: USERROLE[]; // 多角色，应该复杂场景，暂时未使用

  email?: string;
  phone?: string;

  sector?: string;
  status?: string;
  avatar?: string;

  accessToken?: string;
  refreshToken?: string;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
