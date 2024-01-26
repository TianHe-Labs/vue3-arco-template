import debug from './env';

export default ({ mock, setup }: { mock?: boolean; setup: () => void }) => {
  if (mock !== false && debug) setup();
};

export const successResponseWrap = (data: unknown) => {
  return data;
};

export const failResponseWrap = (message: string, code = 50000) => {
  return {
    message,
    code,
  };
};
