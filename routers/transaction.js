const express = require('express');
const router = express.Router();
const authorise = require('../middleware/check_auth');
const {
  getAllTransaction,
  //   getAddTransaction,
  addTransaction,
  getUpdateTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../contollers/transaction');

router.get('/id/:accountId', authorise, getAllTransaction);

// router.get('/addTransaction/id', authorise, getAddTransaction);

router.post('/addTransaction', authorise, addTransaction);

router.get(
  '/updateTransaction/:transactionId',
  authorise,
  getUpdateTransaction
);

router.post('/updateTransaction/:transactionId', authorise, updateTransaction);

router.get(
  '/deleteTransaction/id/:transactionId',
  authorise,
  deleteTransaction
);

module.exports = router;
