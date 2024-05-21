type RoleEnum = 'admin' | 'user';

export interface UserState {
  username?: string;
  role?: RoleEnum;

  password?: string;

  email?: string;
  phone?: string;
  sector?: string;

  accessToken?: string;
  refreshToken?: string;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
