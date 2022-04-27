const express = require("express");
const router = express.Router();
const authorise = require("../middleware/check_auth");

const { getAllAccount, addAccount, deleteAccount, getAddMember, addMember, updateAccountName, deleteMember } = require("../contollers/account");

router.get("/", authorise, getAllAccount);

router.get("/addAccount", authorise, addAccount);

router.get("/addMember/:id", authorise, getAddMember);

router.post("/addMember", authorise, addMember);

router.get("/updateAccount", authorise, updateAccountName);

router.get("/deleteMember/:id", authorise, deleteMember);

router.get("/deleteAccount/:id", authorise , deleteAccount)

module.exports = router;