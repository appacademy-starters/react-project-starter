# Client

This project was bootstrapped with [Create React App].

Your React App will live here. 

## Start Up in Development

While is development, run this application from this location using `npm start`
or `yarn start`.

No environment variables are needed to run this application in development, 
but be sure to edit the "proxy" in the `package.json` to the reflect port of 
your backend server.

## Deploy to Production

This app will be automatically built when you deploy to Heroku, please see the 
`heroku-postbuild` script in your `express.js` application's `package.json`, 
**NOT** React's `package.json` to see how this works.

## Using Redux

If you are using Redux, then run:

`npm install redux react-redux redux-thunk`

## CSRF Protection

On all request methods besides `GET`, you need to define a `CSRF-TOKEN` header
that has a value of the `XSRF-TOKEN` cookie.

Example of a fetch request with CSRF header:

```js
import Cookies from 'js-cookie';

const login = async () => {
  const csrfToken = Cookies.get("XSRF-TOKEN");
  const res = await fetch("/api/session", {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      "CSRF-TOKEN": csrfToken,
    },
    body: JSON.stringify({
      username: "Demo-lition",
      password: "password"
    }),
  });
  res.data = await res.json(); // current user info
  if (res.ok) {
    return res.data;
  }
};
```

[Create React App]: https://github.com/facebook/create-react-app