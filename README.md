# api-mount-client

_by Vytenis Urbonavičius_

_api-mount-client_ provides a straightforward way to reach back-end API served using [api-mount-server](http://npmjs.com/package/api-mount-server) or a compatible library.

Basically it should feel as if server-side API methods are called directly.

This library is based on [api-link](http://npmjs.com/package/api-link) which is dedicating request functionality to either browser's _fetch_ API or a globally available _fetch_ method in a Node.js environment (often [node-fetch](https://www.npmjs.com/package/node-fetch))

---

## Installation

```
npm install --save api-mount-client
```

## Usage

On Node.js server using [api-mount-server](http://npmjs.com/package/api-mount-server):

```typescript
import {apiMountFactory} from 'api-mount-server'

class SomeApi {
  foo() {
    // This may return a Promise as well
    return 'foo'
  }
}

const ApiMount = apiMountFactory()
ApiMount.exposeClassBasedApi(new SomeApi())
```

On a browser or Node.js client:

```typescript
import {mountApi} from 'api-mount-client'

const SomeApi = mountApi({baseUrl: 'http://someServer.com:3000/some-api'})

// Client always receives a Promise
const result = await SomeApi.foo() // 'foo'
```

Note that there are multiple ways how API is served. API may be a set of functions, static class, object created from a class, etc. More information about serving an API can be found in the README of [api-mount-server](http://npmjs.com/package/api-mount-server).

In case _foo_ rejects a promise or throws an exception, client will reject a promise with error as a payload.

Note that in case _api-mount-client_ is used in a server enviroment, a global _fetch_ method needs to be available. This can be achieved by installing [node-fetch](https://www.npmjs.com/package/node-fetch).

## Supported Configuration

_mountApi_ supports a configuration which contains following keys:

- baseUrl - base URL for HTTP requests. It may contain a protocol, host, port and base path but should not contain end-point method names and/or query arguments.
- fetchConfig - _fetch_ API configuration which is passed through to the browser's _fetch_ API or a server-side equivalent. Additional documentation can be found under _/docs_ directory inside [api-link](http://npmjs.com/package/api-link) package. One common case of using _fetchConfig_ is to modify headers. Please note that provided headers completely override default ones. Please make sure that _Content-Type_ is provided correctly. Normally it should be setup for JSON usage:

```typescript
// ...
  fetchConfig: {
    requestInit: {
      headers: {
        'Content-Type': 'application/json',
        // Other headers may go here
      },
    },
  },
// ...
```

## Protocol

Please see _Protocol_ section of [api-mount-server](http://npmjs.com/package/api-mount-server) README.

## TypeScript

Please see _TypeScript_ section of [api-mount-server](http://npmjs.com/package/api-mount-server) README.
