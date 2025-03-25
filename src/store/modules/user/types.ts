// eslint-disable-next-line no-shadow
export enum USERROLE {
  DEVELOPER = 'developer',
  ADMIN = 'admin',
  USER = 'user',
}

export interface UserState {
  username?: string;
  nickname?: string;

  password?: string;

  role?: USERROLE.ADMIN;

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

export {};
