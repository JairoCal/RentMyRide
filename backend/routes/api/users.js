// /api/users
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

// Validators
const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("firstName")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a first name with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Sign up ******************************************************************
// the sign up method from the User model will create the user in the DB
router.post(
  "",
  validateSignup,
  asyncHandler(async (req, res) => {
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      about,
      city,
      state,
      address,
      profileImageUrl,
    } = req.body;
    const user = await User.signup({
      email,
      username,
      password,
      firstName,
      lastName,
      about,
      city,
      state,
      address,
      profileImageUrl,
    });

    await setTokenCookie(res, user);

    return res.json({
      user,
    });
  })
);

module.exports = router;
