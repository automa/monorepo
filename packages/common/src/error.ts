import { StatusCodes } from 'http-status-codes';

export type Error = {
  code: number;
  status: StatusCodes;
  message: string;
};

export const errors = [
  {
    code: 1000,
    status: StatusCodes.FORBIDDEN,
    message:
      "User with the given provider account's primary email already exists and you are not allowed to link this provider account to your account.",
  },
  {
    code: 1001,
    status: StatusCodes.FORBIDDEN,
    message:
      "Given provider account is already linked to another user's account.",
  },
  {
    code: 1002,
    status: StatusCodes.FORBIDDEN,
    message: 'Unable to login with given provider account.',
  },
];
