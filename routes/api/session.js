const express = require("express");
const asyncHandler = require("express-async-handler");
const { check } = require("express-validator");

const { User } = require("../../db/models");
const { handleValidationErrors } = require("../util/validation");
const { getCurrentUser, generateToken } = require("../util/auth");
const { jwtConfig: { expiresIn }} = require('../../config');

const router = express.Router();

// Get current user route
router.get(
  "/",
  getCurrentUser,
  asyncHandler(async function (req, res) {
    return res.json({
      user: req.user || {}
    });
  })
);

// Login route
router.put(
  "/",
  handleValidationErrors,
  asyncHandler(async function (req, res, next) {
    const user = await User.login(req.body);
    if (user) {
      const token = await generateToken(user);
      res.cookie("token", token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production",
      });
      return res.json({
        user,
      });
    }
    return next(new Error('Invalid credentials'));
  })
);

module.exports = router;
