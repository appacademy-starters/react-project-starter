const jwt = require("jsonwebtoken");

const {
  jwtConfig: { secret, expiresIn },
} = require("../../config");
const { User } = require("../../db/models");

// Automatically generates a message and status code for authentication errors
class AuthenticationError extends Error {
  constructor() {
    super("Unauthorized");

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationError);
    }

    this.name = "AuthenticationError";
    this.status = 401;
  }
}

// Generates a JWT with the specified user
function generateToken(user) {
  const data = user.toSafeObject();

  return jwt.sign({ data }, secret, {
    expiresIn: Number.parseInt(expiresIn)
  });
}

// Sets the current user to `req.user` if there is a current user
function getCurrentUser(req, _res, next) {
  const { token } = req.cookies;
  if (!token) return next();

  return jwt.verify(token, secret, null, async(err, payload) => {
    if (!err) {
      const userId = payload.data.id;
      try {
        req.user = await User.getCurrentUserById(userId);
      } catch {}
    }
    return next();
  });
}

// If there is no current user, return an error
const requireUser = [
  getCurrentUser, 
  function (req, _res, next) {
    if (req.user) return next();
  
    const err = new AuthenticationError();
    return next(err);
  }
];

module.exports = { generateToken, requireUser, getCurrentUser, AuthenticationError };
