const cors = require('cors');
const createError = require('http-errors');
const cookieParser = require('cookie-parser')
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const logger = require('morgan');
const csurf = require('csurf');
const routes = require('./routes');
const { ValidationError } = require("sequelize");
const { AuthenticationError } = require('./routes/util/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

// Security Middleware
if (process.env.NODE_ENV !== 'production') {
  // enable cors only in development
  app.use(cors());
}
// helmet helps set a variety of headers to better secure your app
app.use(helmet());
app.use(
  csurf({
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
  })
);

// connect the routes from the /routes folder
app.use(routes);

// Serve React Application
// This should come after routes, but before 404 and error handling.
if (process.env.NODE_ENV === 'production') {
  // Serve the client's index.html file at the root route
  app.get('/', (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });

  // Serve the static assets in the client's build folder
  app.use(express.static("client/build"));

  // Serve the client's index.html file at all other routes NOT starting with /api
  app.get(/\/(?!api)*/, (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// create a 404 error for any requests that reach this middleware
// (requests will not reach this middleware if the response has been resolved)
app.use(function(_req, _res, next) {
  next(createError(404));
});

// If error is a sequelize error, make the errors look pretty
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = "Sequelize Error";
  }
  err.status = 422;
  next(err);
});

// Error handler
app.use(function(err, _req, res, _next) {
  res.status(err.status || 500);

  // If there is an authentication error, clear the token
  if (err instanceof AuthenticationError) {
    res.clearCookie('token');
  }

  // If in production, don't show the error stack trace
  if (process.env.NODE_ENV === 'production') {
    res.json({
      message: err.message,
      error: { errors: err.errors },
    });
  } else {
    console.log(err.stack);
    res.json({
      message: err.message,
      stack: err.stack,
      error: JSON.parse(JSON.stringify(err)),
    });
  }
});

module.exports = app;
