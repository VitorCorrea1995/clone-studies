export enum HttpStatusCode {
  unathorized = 401,
  badRequest = 400,
  ok = 200,
  serverError = 500,
  notFound = 400
}

export type HttpResponse<T> = {
  statusCode: HttpStatusCode
  body?: T
}
