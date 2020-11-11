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

[![codecov](https://codecov.io/gh/raycharius/clean-redirect/branch/main/graph/badge.svg)](https://codecov.io/gh/raycharius/clean-redirect)
[![Maintainability](https://api.codeclimate.com/v1/badges/a9aecc5560c08e013ec8/maintainability)](https://codeclimate.com/github/raycharius/clean-redirect/maintainability)

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

const getCustomRedirectLocation = (res, req, redirector) => {
  if (redirector.path === '/store') {
    redirector
      .setPath('/marketplace')
      .setPersistQueryString(false)
      .setRedirectType(302);
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
  redirectType: 301,
});

app.use(redirector);

```

Using this configuration, you get: 

**Original URL:**   http://yourapp.com/SUBSCRIBE/?email=johndoe@gmail.com
**Target URL:**     https://www.yourapp.com/subscribe?email=johndoe@gmail.com
**Redirect Code:**  301

**Original URL:**   http://yourapp.com/STORE/?showBundles=true
**Target URL:**     https://www.yourapp.com/marketplace
**Redirect Code:**  302