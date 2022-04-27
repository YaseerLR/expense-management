const bcrypt = require('bcrypt');
const User = require('../models/user');
const Account = require('../models/account');
const Transaction = require('../models/transaction');
const { parse } = require('dotenv');

/**
 * @param {*} req
 * @param {*} res
 * @description getAllTransaction Detail by using get
 * @author `DARSHAN ZignutsTechnolab`
 */
async function getAllTransaction(req, res) {
  try {
    let accountId = req.params.accountId;
    let transactions = await Transaction.find({ account: accountId });
    const memberData = await Account.find({ _id: accountId }, {});
    const { account } = res.locals;
    if (!transactions) {
      return res.status(400).json({
        msg: 'no data availabale',
      });
    } else {
      const accountDetail = await Account.findOne({ _id: accountId });
      const name = accountDetail.name;
      res.render('pages/transaction', {
        accountDetail: account,
        transaction: transactions,
        accountId: accountId,
        account: memberData,
        name,
        msg: '',
      });
    }
  } catch (err) {
    return res.status(400).json({
      msg: 'Something went wrong in get transactions!',
    });
  }
}

/**
 * @param {*} req
 * @param {*} res
 * @description addtransaction Detail By using post
 * @author `DARSHAN ZignutsTechnolab`
 */
async function addTransaction(req, res) {
  try {
    const { account } = res.locals;
    const {
      id,
      yesno,
      income,
      incomeTo,
      expenseFrom,
      expense,
      accountFrom,
      accountTo,
      transactionDescription,
      Amount,
    } = req.body;
    const accountData = await Account.findOne({ _id: id });
    let balance = accountData.balance;
    let transactions = await Transaction.find({ account: id });
    const memberData = await Account.find({ _id: id }, {});
    if (yesno == 'Income') {
      balance = balance + parseInt(Amount);
      const data = new Transaction({
        account: id,
        type: 'Income',
        from: income,
        to: incomeTo,
        discription: transactionDescription,
        amount: Amount,
      });
      await data.save();
      await Account.findOneAndUpdate({ _id: id }, { $set: { balance } });
      res.redirect('/transaction/id/' + id);
    } else if (
      (yesno == 'TransferToAccount' || yesno == 'Expense') &&
      balance - parseInt(Amount) >= 0
    ) {
      balance = balance - parseInt(Amount);
      if (yesno == 'Expense') {
        const data = new Transaction({
          account: id,
          type: 'Expense',
          from: expenseFrom,
          to: expense,
          discription: transactionDescription,
          amount: Amount,
        });
        await data.save();
        await Account.findOneAndUpdate({ _id: id }, { $set: { balance } });
        res.redirect('/transaction/id/' + id);
      } else if (yesno == 'TransferToAccount') {
        const data = new Transaction({
          account: id,
          type: 'TransferToAccount',
          from: accountFrom,
          to: accountTo,
          discription: transactionDescription,
          amount: Amount,
        });
        await data.save();
        await Account.findOneAndUpdate({ _id: id }, { $set: { balance } });
        res.redirect('/transaction/id/' + id);
      }
    } else {
      res.render('pages/transaction', {
        accountDetail: account,
        transaction: transactions,
        name: accountData.name,
        accountId: id,
        account: memberData,
        msg: 'lowBalance',
      });
    }
  } catch (err) {
    return res.status(400).json({
      msg: 'Something went wrong!',
    });
  }
}

/**
 * @param {*} req
 * @param {*} res
 * @description getUpdateTransaction Detail by using get
 * @author `DARSHAN ZignutsTechnolab`
 */
async function getUpdateTransaction(req, res) {
  try {
    const { account } = res.locals;

    const id = req.params.transactionId;
    const transaction = await Transaction.findOne({ _id: id });
    const accountId = transaction.account;
    const accountInfo = await Account.findOne({ _id: accountId });
    return res.render('pages/updateT', {
      accountDetail: account,
      name: accountInfo.name,
      accountId,
      transaction,
    });
  } catch (err) {
    return res.status(400).json({
      msg: 'Something went wrong!',
    });
  }
}

/**
 * @param {*} req
 * @param {*} res
 * @description updateTransaction Detail by using patch
 * @author `DARSHAN ZignutsTechnolab`
 */
async function updateTransaction(req, res) {
  try {
    const { account } = res.locals;
    const id = req.params.transactionId;
    const {
      yesno,
      income,
      incomeTo,
      expenseFrom,
      expense,
      accountFrom,
      accountTo,
      transactionDescription,
      Amount,
    } = req.body;
    const transaction = await Transaction.findOne({ _id: id });
    const accountId = transaction.account;
    const accountDetail = await Account.findOne({ _id: accountId });
    let balance = accountDetail.balance;
    let UpdateValue = {};

    if (transaction.type == 'Income') {
      balance = balance - transaction.amount;
    } else {
      balance = balance + transaction.amount;
    }
    if (yesno == 'Income') {
      balance = balance + parseInt(Amount);
      UpdateValue = {
        type: 'Income',
        from: income,
        to: incomeTo,
        discription: transactionDescription,
        amount: Amount,
      };
      const UpdateT = await Transaction.findOneAndUpdate({_id : id }, {$set: UpdateValue});
      const UpdateA = await Account.findOneAndUpdate({ _id: req.body.id }, { $set: { balance } });
      res.redirect('/transaction/id/' + req.body.id);
    } else if (
      (yesno == 'TransferToAccount' || yesno == 'Expense') &&
      balance - parseInt(Amount) >= 0
    ) {
      balance = balance - parseInt(Amount);
      if (yesno == 'Expense') {
        UpdateValue = {
          type: 'Expense',
          from: expenseFrom,
          to: expense,
          discription: transactionDescription,
          amount: Amount,
        };
      } else if (yesno == 'TransferToAccount') {
        UpdateValue = {
          type: 'TransferToAccount',
          from: accountFrom,
          to: accountTo,
          discription: transactionDescription,
          amount: Amount,
        };
      }
      const UpdateT = await Transaction.findOneAndUpdate({_id : id }, {$set: UpdateValue});
      const UpdateA = await Account.findOneAndUpdate({ _id: req.body.id }, { $set: { balance } });
      res.redirect('/transaction/id/' + req.body.id);
    }else{
      const accountData = await Account.findOne({ _id: req.body.id });
      let transactions = await Transaction.find({ account: req.body.id });
      const memberData = await Account.find({ _id: req.body.id }, {});
      res.render('pages/transaction', {
        accountDetail: account,
        transaction: transactions,
        name: accountData.name,
        accountId: accountData.id,
        account: memberData,
        msg: 'lowBalance',
      });
    }
 
  } catch (err) {
    console.log('errrr::: ', err);
    return res.status(400).json({
      msg: 'Something went wrong!',
    });
  }
}

/**
 * @param {*} req
 * @param {*} res
 * @description deleteTransaction Detail by using delete
 * @author `DARSHAN ZignutsTechnolab`
 */
async function deleteTransaction(req, res) {
  try {
    const tId = req.params.transactionId;
    const transactionData = await Transaction.findOne({ _id: tId });
    const accountDetail = await Account.findOne({
      _id: transactionData.account,
    });
    const { account } = res.locals;
    let balance = accountDetail.balance;
    const accountId = accountDetail._id;
    if (transactionData.type == 'Income') {
      balance = balance - parseInt(transactionData.amount);
    } else if (transactionData.type == 'Expense') {
      balance = balance + parseInt(transactionData.amount);
    } else if (transactionData.type == 'TransferToAccount') {
      balance = balance + parseInt(transactionData.amount);
    }
    if (balance >= 0) {
      await Account.findOneAndUpdate({ _id: accountId }, { $set: { balance } });
      await Transaction.deleteOne({ _id: tId });
      res.redirect(`/transaction/id/${accountId}`);
    } else {
      let transactions = await Transaction.find({ account: accountId });
      const memberData = await Account.find({ _id: accountId }, {});
      res.render('pages/transaction', {
        accountDetail: account,
        transaction: transactions,
        accountId,
        name: accountDetail.name,
        account: memberData,
        msg: 'noDelete',
      });
    }
  } catch (err) {
    return res.status(400).json({
      msg: 'Something went wrong!',
    });
  }
}

module.exports = {
  getAllTransaction,
  addTransaction,
  getUpdateTransaction,
  updateTransaction,
  deleteTransaction,
};
