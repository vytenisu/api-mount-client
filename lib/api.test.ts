import {apiMountFactory} from 'api-mount-server'
import {mountApi} from './api'

const BASE_URL = 'http://localhost:3000'

describe('API', () => {
  it('mounts api', async () => {
    const RETURN_VALUE = 'mount'

    const ApiMount = apiMountFactory()

    const api = {
      testMount: () => RETURN_VALUE,
    }

    ApiMount.exposeApi(api)
    const clientApi = mountApi({baseUrl: BASE_URL})

    expect(await clientApi.testMount()).toBe(RETURN_VALUE)
  })

  it('allows passing multiple arguments', async () => {
    const ApiMount = apiMountFactory()

    const api = {
      testArgs: (...args: any[]) => args,
    }

    ApiMount.exposeApi(api)

    const clientApi = mountApi({baseUrl: BASE_URL})

    const args = [123, 'someString', {some: 'object'}]

    expect(await clientApi.testArgs(...args)).toEqual(args)
  })

  it('rejects in case api returns an error', async () => {
    const ERROR = 'error'
    const ApiMount = apiMountFactory()

    const api = {
      testError: () => Promise.reject(ERROR),
    }

    ApiMount.exposeApi(api)

    const clientApi = mountApi({baseUrl: BASE_URL})

    let actualError = null

    await clientApi.testError().catch((e: any) => {
      actualError = e
    })

    expect(actualError).toBe(ERROR)
  })

  it('allows changing base path', async () => {
    const RETURN_VALUE = 'static'

    const ApiMount = apiMountFactory()

    class StaticClass {
      public static testStatic() {
        return RETURN_VALUE
      }
    }

    ApiMount.exposeClassBasedApi(StaticClass)
    const clientApi = mountApi({baseUrl: `${BASE_URL}/static-class`})

    expect(await clientApi.testStatic()).toBe(RETURN_VALUE)
  })

  it('allows overriding fetch init arguments', async () => {
    const RETURN_VALUE = 'anotherStatic'

    const ApiMount = apiMountFactory()

    class AnotherStaticClass {
      public static testAnotherStatic(arg: any) {
        return arg
      }
    }

    ApiMount.exposeClassBasedApi(AnotherStaticClass)

    const badClientApi = mountApi({
      baseUrl: `${BASE_URL}/another-static-class`,
      fetchConfig: {requestInit: {headers: {}}},
    })

    const goodClientApi = mountApi({
      baseUrl: `${BASE_URL}/another-static-class`,
    })

    expect(await goodClientApi.testAnotherStatic(RETURN_VALUE)).toBe(
      RETURN_VALUE,
    )

    let error = false

    try {
      await badClientApi.testAnotherStatic(RETURN_VALUE)
    } catch (e) {
      error = true
    }

    expect(error).toBeTruthy()
  })
})
