import { isDevelopment } from '@/utils';

export default ({ mock, setup }: { mock?: boolean; setup: () => void }) => {
  if (mock !== false && isDevelopment) setup();
};

export const successResponseWrap = (data: any) => {
  return data;
};

export const failureResponseWrap = (message: string) => {
  return {
    message,
  };
};
