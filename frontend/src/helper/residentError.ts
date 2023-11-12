import {
  ErrorResponse,
} from "../types/ResidentTypes";

const isResidentErrorResponse = (res: boolean | ErrorResponse) : res is ErrorResponse => {
  return (typeof res !== 'boolean' && 'errMessage' in res);
}

export default isResidentErrorResponse