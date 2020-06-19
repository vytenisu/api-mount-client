# api-mount-client

_by Vytenis Urbonavičius_

_api-mount-client_ provides a straightforward way for reaching back-end API served using [api-mount-server](http://npmjs.com/package/api-mount-server) or a compatible library.

Once setup, it makes it feel as if server-side API methods are called directly.

This library is based on [api-link](http://npmjs.com/package/api-link) which is dedicating request functionality to either browser's _fetch_ API or a _node-fetch_ in a _Node_ environment.

---

## Installation

```
npm install --save api-mount-client
```

## Usage

On your _Node_ server build an object containing API methods (more information and alternative ways of constructing _API_ are provided in the docs of [api-mount-server](http://npmjs.com/package/api-mount-server)):

```typescript
const api = {
  foo() {
    return 'foo'
  },
}
```

In case your back-end is not based on _Node_ but you would still want to use _api-mount-client_, you can explore _Protocol_ section in the docs of [api-mount-server](http://npmjs.com/package/api-mount-server).

Expose API via [api-mount-server](http://npmjs.com/package/api-mount-server) (see docs of [api-mount-server](http://npmjs.com/package/api-mount-server) to explore different approaches, usage of classes, namespacing, etc.):

```typescript
const {apiMountFactory} = require('api-mount-server')
const ApiMount = apiMountFactory()
ApiMount.exposeApi(api)
```

In case you have client and server on different hosts/ports, you might run into browser's _CORS_ policy restrictions. Unless handled requests may get blocked or responses may be incomplete. Below is an example using _cors_ _NPM_ package for working around browser's _CORS_ policy constraint:

```typescript
const ApiMount = apiMountFactory({
  beforeListen: app => {
    // This is just for testing purposes
    // You would probably want to explicitly list
    // where you expect requests to be coming from
    // for security reasons
    app.use(require('cors')())
  },
})
```

On client side (browser or _Node_ client) mount the _API_:

```typescript
import {mountApi} from 'api-mount-client'
const api = mountApi({baseUrl: 'http://someServer.com:3000'})
```

If your _API_ is namespaced, attach your namespace path to the _baseUrl_ of _mountApi_:

```typescript
const api = mountApi({baseUrl: 'http://someServer.com:3000/api-name'})
```

Now you can access function on server from your client just like that:

```typescript
const result = await api.foo() // 'foo'
```

Note that client always receives a _Promise_ object. This is why _await_ was used. In case _foo_ rejects a promise or throws an exception, client will reject a promise with error as a payload.

## Try it out!

In order to test library on vanilla _JavaScript_ directly in browser, you can refer to this example:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Test</title>
    <script src="./node_modules/api-mount-client/dist/index.js"></script>
  </head>
  <body>
    <script>
      const api = window.ApiMountClient.mountApi({
        baseUrl: 'http://localhost:3000',
      })

      api.test().then(console.log)
    </script>
  </body>
</html>
```

_api-mount-client_ is exposed as a UMD library and therefore it is available in global scope if no other way of importing is available.

Above example assumes that _API_ was exposed using _Node_ code like this:

```typescript
const {apiMountFactory} = require('api-mount-server')
var cors = require('cors')

const ApiMount = apiMountFactory({
  beforeListen: app => app.use(cors()),
})

const api = {
  test = () => 'works!',
}

ApiMount.exposeApi(api)
```

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
