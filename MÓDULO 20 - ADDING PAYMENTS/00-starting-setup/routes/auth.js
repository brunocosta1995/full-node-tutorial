const express = require("express");
const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/reset", authController.getReset);

router.get("/new-password/:token", authController.getNewPassword);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail()
      .custom((value) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject("E-mail doesn't exist, please enter a valid email");
          }
        });
      }),
    check("password")
      .isAlphanumeric()
      .isLength({ min: 5 })
      .withMessage("Please enter a valid password that is a number and/or text with at least 5 characters.")
      .trim()
      .custom((value, { req }) => {
        return User.findOne({ email: req.body.email }).then((user) => {
          if (!user) {
            return Promise.reject("User not found!");
          }
          return bcrypt.compare(value, user.password).then((isPasswordEqual) => {
            if (!isPasswordEqual) {
              return Promise.reject("Password incorrect");
            }
          });
        });
      }),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("Invalid email input");
        // }
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail exists already, please pick a different one."
            );
          }
        });
      }),
    body(
      "password",
      "Please enter a valid password that is a number and/or text with at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    })
    .trim(),
  ],
  authController.postSignup
);

router.post("/reset", authController.postReset);

router.post("/new-password/", authController.postNewPassword);

module.exports = router;
