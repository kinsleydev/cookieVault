# CookieVault
CookieVault is a library that provides an interface for easily handling cookies in Node.JS.

## Features
* Import cookies from HTTP headers
* Export cookies as HTTP headers
* Export and restore vault contents in JSON
* Isolate cookies by domain and path
* Automatically expires cookies
* Instantly clear vault

In addition, I'm planning on adding more features in the future:
* Isolate cross-site cookies
* Restrict cookies to secure origins only
* Using custom value for current time

## Installation
You can easily install CookieVault from NPM.
```bash
npm install cookievault
```

Alternatively, you can download `cookieVault.js` directly from the releases tab.

At this time, CookieVault only works in Node.JS. If you want to use CookieVault somewhere else, you'll need to provide a Node.js-compatible environment for CookieVault to run in.

## Usage
Here is a basic fetch example that uses CookieVault and [node-fetch](https://github.com/node-fetch/node-fetch).
```js
const CookieVault = require('cookievault');
const nodefetch = require('node-fetch');

const cookieVault = new CookieVault();

const fetch = async (location, options={}) => {
    const url = new URL(location);
    if(!options.headers) {
        options.headers = {};
    }
    const cookies = cookieVault.exportCookiesAsHttp({
        domain: url.hostname,
        path: url.pathname
    });
    if(cookies) {
        options.headers['Cookie'] = cookies;
    }
    const response = await nodefetch(location, options);
    const responseCookies = response.headers.raw()['set-cookie'];
    if(responseCookies) {
        responseCookies.forEach(cookie => cookieVault.importCookieFromHttp(cookie));
    }
    return response.
}
```

For full usage instructions, check out the [documentation](/usage.md).

## Mirrors
CookieVault is hosted on multiple mirrors:
* [GitHub](https://github.com/kinsleydev/cookieVault) (primary)
* [git.gay](https://git.gay/kinsleydev/cookieVault)
* [NPM](https://npmjs.com/package/cookieVault)