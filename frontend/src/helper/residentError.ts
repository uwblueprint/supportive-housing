import {
  ErrorResponse,
} from "../types/ResidentTypes";

export const isResidentErrorResponse = (res: boolean | ErrorResponse) : res is ErrorResponse => {
  return (typeof res !== 'boolean' && 'errMessage' in res);
}