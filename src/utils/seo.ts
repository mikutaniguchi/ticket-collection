import { APP_NAME } from '../constants/app';

export const setPageTitle = (title?: string) => {
  document.title = title ? `${title} - ${APP_NAME}` : APP_NAME;
};

export const resetPageTitle = () => {
  document.title = APP_NAME;
};
