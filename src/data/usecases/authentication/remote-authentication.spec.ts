import { HttpClientPostSpy } from '../../protocols/test/mock-http-client'
import { RemoteAuthentication } from './remote-authentication'
import faker from 'faker'
import { mockAuthentication } from '../../../domain/test/mock-account'
import { InvalidCredentialsError } from '../../../domain/errors/invalid-credentials'
import { UnexpectedError } from '../../../domain/errors/unexpected-error'
import { HttpStatusCode } from '../../protocols/http/http-response'
import { AuthenticationParams } from '../../../domain/usecases/authentication'
import { AccountModel } from '../../../domain/models/account-model'
type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpClientPostSpy<AuthenticationParams, AccountModel>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpClientPostSpy<AuthenticationParams, AccountModel>()
  const sut = new RemoteAuthentication(url, httpPostClientSpy)
  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.auth(mockAuthentication())
    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpPostClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const authenticationParams = mockAuthentication()
    await sut.auth(authenticationParams)
    expect(httpPostClientSpy.body).toEqual(authenticationParams)
  })

  test('Should throw InvalidCredentialsError if HttpPostClient returns 401', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unathorized
    }
    const authenticationParams = mockAuthentication()
    const promise = await sut.auth(authenticationParams)
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should throw InvalidCredentialsError if HttpPostClient returns 400', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const authenticationParams = mockAuthentication()
    const promise = await sut.auth(authenticationParams)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw InvalidCredentialsError if HttpPostClient returns 500', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const authenticationParams = mockAuthentication()
    const promise = await sut.auth(authenticationParams)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw InvalidCredentialsError if HttpPostClient returns 400', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const authenticationParams = mockAuthentication()
    const promise = await sut.auth(authenticationParams)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw InvalidCredentialsError if HttpPostClient returns 400', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    const httpResult
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const authenticationParams = mockAuthentication()
    const promise = await sut.auth(authenticationParams)
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
