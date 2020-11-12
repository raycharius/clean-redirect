<p align="center">
    <img src="https://raw.githubusercontent.com/raycharius/clean-redirect/main/resources/images/logo-horizontal.png" alt="Logo" width="600px">
</p>

<p align="center">
    <h3 align="center">All your redirect logic wrapped into one clean redirect</h3>
</p>

<p align="center">
    Force HTTPS, remove trailing slash, to lower case, naked to www, and your own custom logic, as one redirect.
    <br />
    <br />
    <a href="#usage">Quick Start Guide</a>
    ·
    <a href="https://github.com/raycharius/clean-redirect/issues">Request Feature</a>
    ·
    <a href="https://github.com/raycharius/clean-redirect/issues">Report Bug</a>
  </p>
</p>

***

[![npm](https://img.shields.io/npm/v/clean-redirect?color=bright-green)](https://www.npmjs.com/package/clean-redirect)
![NPM](https://img.shields.io/npm/l/clean-redirect?color=bright-green)
[![codecov](https://codecov.io/gh/raycharius/clean-redirect/branch/main/graph/badge.svg)](https://codecov.io/gh/raycharius/clean-redirect)
[![Maintainability](https://api.codeclimate.com/v1/badges/a9aecc5560c08e013ec8/maintainability)](https://codeclimate.com/github/raycharius/clean-redirect/maintainability)

> Note that this version is still being tested and documented. Stable version will be released as Version 1.0.0.

When it comes to redirects, it's easy to end up with a redirect chain. First your server forces HTTPS. Redirects to the naked domain. Then removes the trailing slash. And only then does the request hit your backend, where it is met with redirects dependent on your business logic. **Clean Redirect** is a middleware for Express that helps you avoid redirect chains by keeping all of the redirect rules in one place, redirecting only once they've all been applied. 

While it may be desirable to keep some of those redirects (such as force HTTPS) on the web server, there are cases when they need to happen on the backend, such as when hosting an application on Heroku or similar infrastructure.

### :zap: &nbsp; Features

* Enforce HTTPS.
* Redirect from naked domain to WWW and vice versa.
* Remove trailing slash from path.
* Convert path to lowercase.
* The ability to pass in a function with your own business logic.
* A lot of configurable options to keep it as simple or governed as you need it.

### :floppy_disk: &nbsp; Installation 

#### Using NPM: 

``` bash
npm install --save clean-redirect
```

#### Using Yarn: 

``` bash
yarn add clean-redirect
```
### :mag: &nbsp; Example

```javascript

const express = require('express');
const cleanRedirect = require('clean-redirect');

const app = express();

const getCustomRedirectLocation = (req, res, redirector) => {
  if (redirector.path === '/store') {
    redirector
      .setPath('/marketplace')
      .setPersistQueryString(false)
      .setRedirectCode(302);
  }
};

const redirector = cleanRedirect({
  forceHttps: true,
  toWww: true,
  pathToLowerCase: true,
  removeTrailingSlash: true,
  persistQueryString: true,
  customRedirects: getCustomRedirectLocation,
  callNextOnRedirect: true,
  redirectCode: 301,
});

app.use(redirector);

// http://yourapp.com/SUBSCRIBE/?email=johndoe@gmail.com => 301
// https://www.yourapp.com/subscribe?email=johndoe@gmail.com

// http://yourapp.com/STORE/?showBundles=true => 302
// https://www.yourapp.com/marketplace

```

### :space_invader: &nbsp; Usage

| Option              | Type     | Required | Description                                                                                                                                                                                                       |
|---------------------|----------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| forceHttps          | Boolean  | No       | Redirects non-secure HTTP requests to HTTPS. Defaults to `false`.                                                                                                                                                 |
| toWww               | Boolean  | No       | Redirects requests to the naked (root) domain to the WWW domain. Defaults to  `false`. Both `toWww` and `toNaked` cannot set to `true` at the same time.                                                          |
| toNaked             | Boolean  | No       | Redirects requests to the WWW domain to the naked (root) domain. Defaults to  `false`. Both `toWww` and `toNaked` cannot set to `true` at the same time.                                                          |
| pathToLowerCase     | Boolean  | No       | Redirects requests with capital letters in the path to the same path, but lowercase. Defaults to  `false`.                                                                                                        |
| removeTrailingSlash | Boolean  | No       | Redirects requests with a trailing slash to the same path, without a slash. Defaults to  `false`.                                                                                                                 |
| persistQueryString  | Boolean  | No       | When set, the query string from the original request will be persisted to the redirect location. Defaults to  `false` (default behavior for Express).                                                             |
| redirectCode        | Integer  | No       | Sets the redirect code to be used by default. Valid values are `301` and `302`. Defaults to `302`.                                                                                                                |
| callNextOnRedirect  | Boolean  | No       | When set to `true`, the `next()` function will be called in the middleware after the redirect has taken place. Defaults to `false`.                                                                               |
| deferRedirectToNext | Boolean  | No       | When set to `true`, `res.redirect()` is not called in the middleware. Instead, an instance of CleanRedirect is saved to `res.locals` and available for further governance in the middleware that follows.         |
| customRedirects     | Function | No       | This is a function that accepts three arguments (`req`, `res`, `redirector`) and is called before calling `res.redirect()`. Pass this in to include custom redirect logic using conditions, getters, and setters. |
