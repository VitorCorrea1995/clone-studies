import { HttpPostClient, HttpPostParams } from '../http/http-post-client'
import { HttpResponse, HttpStatusCode } from '../http/http-response'

export class HttpClientPostSpy<T, R> implements HttpPostClient<T,R> {
  url?: string
  body?: object
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok
  }

  async post (params: HttpPostParams<T>): Promise<HttpResponse> {
    this.url = params.url
    this.body = params.body
    return Promise.resolve(this.response)
  }
}
