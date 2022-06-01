/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse, Method } from 'axios';

export const call = async (uri: string, method: Method = 'GET', data?: any) => {
  let result: any, error: any;

  try {
    result = await axios.request({
      method,
      url: `http://localhost:8080${uri}`,
      data,
    });
  } catch (err) {
    error = err;
  }

  return {
    result: result as AxiosResponse | undefined,
    error: error as AxiosError<any, any> | undefined,
  };
};
