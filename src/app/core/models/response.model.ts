export interface IResponse<T> {
  message: string;
  result: IResponseResult<T>;
}

export interface IResponseResult<T> {
  properties: T;
  description: string;
  _id: string;
  uid: string;
  __v: number;
}
