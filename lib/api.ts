import {Api, IFetchInit} from 'api-link'

/**
 * Options for customizing mountApi behavior
 */
export interface IMountApiOptions {
  /**
   * Base URL of served API
   */
  baseUrl?: string

  /**
   * Fetch configuration - it is forwarded to api-link library
   */
  fetchConfig?: IFetchInit
}

/**
 * Mount API and create a dynamic proxy class for accessing it
 * @param options options for customizing behavior
 */
export const mountApi = (options: IMountApiOptions = {}) =>
  new Api({
    multipleMethodArgs: true,
    baseUrl: options.baseUrl ?? '/',
    requestMethodMapper: (methodName: string) => ({
      requestMethod: 'POST',
      methodName,
    }),
    fetchConfig: options.fetchConfig,
  })
