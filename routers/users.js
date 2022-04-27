const express = require("express");
const router = express.Router();
const { getsignup, signUp, getlogin, loginUser, logout, deleteUser } = require("../contollers/user");
const authorise = require("../middleware/check_auth");

 
router.get("/signup", getsignup);

router.post("/signup", signUp);

router.get("/login", getlogin);

router.post("/login", loginUser);

router.get("/logout",authorise, logout);

router.delete("/:userId", deleteUser);

module.exports = router;
