export interface IResponse<T> {
  statusCode:number;
  mensaje:string;
  data?: T;
}
