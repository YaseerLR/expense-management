const express = require("express");
const router = express.Router();
const { getAddAccountPage, getAllAccount, createAccount, getUpdateAccountPage, updateAccount, deleteAccount, getAddMember, addMember, deleteMember } = require("../controllers/account");
const authorise = require("../middleware/check-auth");


// get all accounts
router.get("/", authorise, getAllAccount);

// get addAccount page
router.get("/addAccount", authorise, getAddAccountPage);

// create account
router.post("/addAccount", authorise, createAccount);

// get update account page
router.get("/updateAccount/:id", authorise, getUpdateAccountPage);

// update account 
router.post("/updateAccount", authorise, updateAccount);

// delete account 
router.get("/deleteAccount/:id", authorise, deleteAccount);

// get add member page
router.get("/addMember/accountId/:accountId", authorise, getAddMember);

// add member to account
router.post("/addMember", authorise, addMember);

// remove member from account
router.get("/deleteMember/:data", authorise, deleteMember);

module.exports = router;