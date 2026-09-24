# Usage Guide
## Getting started
### Creating a CookieVault
CookieVault is a class. You can easily create one by using `new CookieVault`. This will create a new vault with default settings and no cookies.
```js
const cookieVault = new CookieVault();
```

### Adding init options
CookieVault lets you initialize a vault with custom settings.
```js
const cookieVault = new CookieVault({
    preserve: false
});
```

* **preserve** (boolean)
  * Whether the vault should prevent cookies from expiring.
  * Default value: `false`

### Preloading cookies
You can also pass a batch of cookies to to the constructor to automatically import them.
```js
const cookieVault = new CookieVault({
    contents: {
        'name-of-cookie': {
            value: 'example-value',
            expires: 1861920000000,
            domain: 'example.com',
            path: '/'
        }
    }
});
```

Preloaded batches use the same structure as imported and exported batches. For instructions on how to structure a batch of cookies, see [structuring imports and exports](#structuring-imports-and-exports).

## Importing and exporting
### Importing cookies
> [!CAUTION]
> As of right now, `import` is an alias of `replace`. Any cookies that are already in the vault will be removed.

You can easily import a batch of cookies using the `import` function.
```js
cookieVault.import(myCookies);
```

### Exporting cookies
You can easily export cookies with the `export` function.
```js
const myCookies = cookieVault.export();
```

### Replacing the vault contents
You can replace the vault contents by using the `replace` function. This will remove any cookies that are already in the vault.
```js
cookieVault.replace(myCookies);
```

Alternatively, you can pace the replace option to the `import` function.
```js
cookieVault.import(myCookies, { replace: true });
```

### Structuring imports and exports
Imports and exports are structured in a specific way.

```ts
type VaultContents = {
    [key: string]: {
        value: string,
        expires?: number,
        domain?: string,
        path?: string
    }
}
```

Batches of cookies are stored as a key-value pair inside of a JSON object, where the key represents the name of the cookie and the value is a JSON representation of the cookie itself.
* **value** (string)
  * The actual value of the cookie.
* **expires** (number)
  * The date and time the cookie expires on, as a UNIX epoch.
  * *(optional)*
* **domain** (string)
  * The domain the cookie should be restricted to.
  * *(optional)*
* **path** (string)
  * The path the cookie should be restricted to.
  * *(optional)*

## Reading from the vault
### Reading cookies
You can read a cookie by using the `read` function.
```js
const myCookie = cookieVault.read('my-cookie');
```

The `read` function returns the cookie's value as a string. If the cookie doesn't exist or is outside the request scope, it will return `null`.

### Checking if cookies exist
You can check if a cookie exists by using the `exists` function.
```js
if(cookieVault.exists('my-cookie')) {
    // do something
}
```

This function returns a boolean value representing whether or not the cookie exists. It will also return false if it is outside of the request scope.

### Reading all of the cookies
The `walk` function returns a key-value pair representing all of the cookies, where the key is the name and the value is the value of the cookie. It will not include cookies that are outside of the request scope.
```js
const cookies = cookieVault.walk();
Object.keys(cookies).forEach(name => {
    const value = cookies[name];
    // do something
});
```

### Export cookies as an HTTP header
The `exportCookiesAsHttp` function generates an HTTP header using the cookies in the vault.
```js
const header = cookieVault.exportCookiesAsHttp();
```

### Specifying a request scope
You can add a request scope to any of these functions. A request scope will exclude certain cookies based off of the domain and/or file path. The request scope should always be the last parameter of a function. This example shows one added to `read`, but it can also be added to `exists`, `walk`, and `exportCookiesAsHTTP` as well.

```js
const myCookie = cookieVault.read('my-cookie', {
    domain: 'example.com',
    path: '/'
});
```

## Writing to the vault
## Adding a new cookie
You can easily create a new cookie using the `append` function. This function takes the name and value of the cookie.
```js
cookieVault.append('my-cookie', 'hello world');
```

You can also pass additional options using a third parameter.
```js
cookieVault.append('my-cookie', 'hello world', {
    expires: 1861920000000,
    domain: 'subdomain.example.com',
    path: '/'
});
```
* **expires** (number)
  * The date and time the cookie expires on, as a UNIX epoch.
* **domain** (string)
  * The domain the cookie should be restricted to.
* **path** (string)
  * The path the cookie should be restricted to.
  * Default value: `"/"`

## Removing a cookie
The `remove` function removes a cookie.
```js
cookieVault.remove('my-cookie');
```

You can also use the `clear` function to remove all cookies from the vault.
```js
cookieVault.clear();
```

### Importing cookies from an HTTP header
You can easily import cookies from an HTTP response by passing each `Set-Cookie` header to the `importCookieFromHttp` function.
```js
cookieVault.importCookieFromHttp(myResponseHeaders['Set-Cookie'][0]);
```

You can also import cookies sent in an HTTP request by passing the `Cookie` header into the `importCookiesFromHttp` function.
```js
cookieVault.importCookiesFromHttp(myRequestHeaders['Cookie'][0]);
```