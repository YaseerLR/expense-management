const express = require("express");
const router = express.Router();
const authorise = require("../middleware/check-auth");
const { getSignupPage, getLoginPage, userSignUp, userLogin, userLogout, userDelete } = require("../controllers/user");

// get signup page
router.get("/signup", getSignupPage);

// create new user with sign up
router.post("/signup", userSignUp);

// get login page
router.get("/login", getLoginPage);

// login user
router.post("/login", userLogin);

// logout user
router.get("/logout", authorise, userLogout)

// delete user
router.delete("/:userId", authorise , userDelete);

module.exports = router;