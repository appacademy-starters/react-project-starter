const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require("express-validator");

const { User } = require("../../db/models");
const { handleValidationErrors } = require("../util/validation");
const { generateToken } = require("../util/auth");
const {
  jwtConfig: { expiresIn },
} = require("../../config");

const router = express.Router();

// Signup route
router.post(
  "/",
  handleValidationErrors,
  asyncHandler(async function (req, res) {
    console.log(req.body);
    const user = await User.signup(req.body);

    const token = await generateToken(user);
    res.cookie("token", token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.json({
      user,
    });
  })
);

module.exports = router;
