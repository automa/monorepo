import { StatusCodes } from 'http-status-codes';

export enum ErrorType {
  ACCOUNT_WITH_EMAIL_EXISTS = 1000,
  PROVIDER_ALREADY_LINKED,
  UNABLE_TO_LOGIN_WITH_PROVIDER,
}

export type Error = {
  code: ErrorType;
  status: StatusCodes;
  message: string;
};

export const errors: { [key in ErrorType]: Omit<Error, 'code'> } = {
  [ErrorType.ACCOUNT_WITH_EMAIL_EXISTS]: {
    status: StatusCodes.FORBIDDEN,
    message:
      "User with the given provider account's primary email already exists and you are not allowed to link this provider account to your account.",
  },
  [ErrorType.PROVIDER_ALREADY_LINKED]: {
    status: StatusCodes.FORBIDDEN,
    message:
      "Given provider account is already linked to another user's account.",
  },
  [ErrorType.UNABLE_TO_LOGIN_WITH_PROVIDER]: {
    status: StatusCodes.FORBIDDEN,
    message: 'Unable to login with given provider account.',
  },
};
