export interface IError {
  error: string;
}

export const isErrorType = (obj: any): obj is IError => {
  return "error" in obj;
};
