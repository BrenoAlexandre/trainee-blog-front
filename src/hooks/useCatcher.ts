import { EApiErrors } from '../enums/EApiErrors';
import toastMsg, { ToastType } from '../utils/toastMsg';

interface IError {
  response: {
    status: number;
    data: {
      message: string;
      error: { message: string };
    };
  };
}

interface IReturn {
  catcher: (apiCall: string, error: IError) => string;
}

const toastError = (msg: string): void => {
  toastMsg(ToastType.Error, msg);
};

export const useCatcher = (): IReturn => {
  const catcher = (apiCall: string, { response }: IError): string => {
    const { data } = response;

    if (data.message && Object.keys(EApiErrors).includes(`${apiCall}_${data.message}`)) {
      toastError(EApiErrors[`${apiCall}_${data.message}`]);
    } else toastError(EApiErrors.default);

    return data.message;
  };

  return { catcher };
};
