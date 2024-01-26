export const ACS_TOKEN_KEY = 'acs-token';
export const RSH_TOKEN_KEY = 'rsh-token';

const isLogin = () => {
  return !!localStorage.getItem(ACS_TOKEN_KEY);
};

const getToken = (tokenKey = ACS_TOKEN_KEY) => {
  return localStorage.getItem(tokenKey);
};

const setToken = (token: string, tokenKey = ACS_TOKEN_KEY) => {
  localStorage.setItem(tokenKey, token);
};

const clearToken = () => {
  localStorage.removeItem(ACS_TOKEN_KEY);
  localStorage.removeItem(RSH_TOKEN_KEY);
};

export { isLogin, getToken, setToken, clearToken };
