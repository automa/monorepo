import { StatusCodes } from 'http-status-codes';

export enum ErrorType {
  UNABLE_TO_LOGIN_WITH_PROVIDER = 1000,
  PROVIDER_ALREADY_LINKED,
  UNABLE_TO_CONNECT_INTEGRATION,
  MULTIPLE_JIRA_SITES_FOR_USER_NOT_SUPPORTED,
}

export type Error = {
  code: ErrorType;
  status: StatusCodes;
  message: string;
};

export const errors: { [key in ErrorType]: Omit<Error, 'code'> } = {
  [ErrorType.UNABLE_TO_LOGIN_WITH_PROVIDER]: {
    status: StatusCodes.FORBIDDEN,
    message: 'Unable to login with given provider account.',
  },
  [ErrorType.PROVIDER_ALREADY_LINKED]: {
    status: StatusCodes.FORBIDDEN,
    message:
      'User with this email is already linked with another provider account.',
  },
  [ErrorType.UNABLE_TO_CONNECT_INTEGRATION]: {
    status: StatusCodes.BAD_REQUEST,
    message: 'Unable to connect integration.',
  },
  [ErrorType.MULTIPLE_JIRA_SITES_FOR_USER_NOT_SUPPORTED]: {
    status: StatusCodes.BAD_REQUEST,
    message:
      'Connecting to multiple Jira sites with the same user is not supported.',
  },
};
