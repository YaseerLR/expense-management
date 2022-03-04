const express = require("express");
const router = express.Router();
const authorize = require("../middleware/check-auth");
const { getTransactions, getAddTransactionPage, addTransaction, getEditTransactionPage, editTransaction, deleteTransaction } = require("../controllers/transaction");



// get all transactions of any account
router.get("/id/:accountId", authorize, getTransactions);

// render page for add transaction 
router.get("/addTransaction/id/:accountId", authorize, getAddTransactionPage);

// add new transaction
router.post("/addTransaction/id/:accountId", authorize, addTransaction);

// get edit transaction page
router.get("/editTransaction/:transactionId", authorize, getEditTransactionPage);

// edit transaction
router.post("/editTransaction/id/:transactionId", authorize, editTransaction);

// delete account 
router.get("/deleteTransaction/:transactionId", authorize, deleteTransaction);


module.exports = router;