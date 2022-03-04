const Account = require("../models/account");
const Transaction = require("../models/transaction");


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description get all transaction
 * @author "Vimal Solanki"
 */
async function getTransactions(req, res) {
    try {
        let accountId = req.params.accountId;
        let transactions = await Transaction.find({ account: accountId });
        let account = await Account.findOne({ _id: accountId });
        let members = account.members;

        let balance = 0;
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].type == "income") {
                balance += transactions[i].amount;
            } else if (transactions[i].type == "expense") {
                balance -= transactions[i].amount;
            } else {
                balance -= transactions[i].amount;
            }
        };

        return res.status(200).render("pages/transaction", { transaction: transactions, accountId, members: members, balance: balance, account: account, msg: "success" });

    } catch (err) {
        console.log("err in get transactions of account :: ", err);
        return res.status(400).json({
            msg: 'Something went wrong in get transactions!'
        });
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description render page for add new transaction
 * @author "Vimal Solanki"
 */
async function getAddTransactionPage(req, res) {
    try {
        let accountId = req.params.accountId;
        return res.status(200).render("pages/addTransaction", { accountId: accountId });

    } catch (err) {
        return res.status(400).json({
            msg: 'Something went wrong!'
        });
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description for create new transaction
 * @author "Vimal Solanki"
 */
async function addTransaction(req, res) {
    try {

        let accountId = req.params.accountId;
        let { transType, description, amount } = req.body;

        let account = await Account.findOne({ _id: accountId });
        let balance = account.balance;

        if (transType.toLowerCase() == "income") {
            balance += amount;
            let updateAccount = await Account.updateOne({ _id: accountId }, { $set: { balance } });
        } else {
            balance -= amount;

            if (balance < 0) {
                let transactions = await Transaction.find({ account: accountId });
                return res.render("pages/transaction", { transaction: transactions, balance: account.balance, accountId, members: account.members, account: account, msg: "Low balance!!" });
            } else {
                let updateAccount = await Account.updateOne({ _id: accountId }, { $set: { balance } });
            }
        }

        let newTransaction = new Transaction({
            account: accountId,
            type: transType.toLowerCase(),
            description: description,
            amount: amount
        });
        await newTransaction.save();

        return res.redirect(`/transaction/id/${accountId}`);

    } catch (err) {
        console.log("err in addTransaction : ", err);
        return res.status(400).json({
            msg: 'Something went wrong!'
        });
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description get page for update transaction details 
 * @author "Vimal Solanki"
 */
async function getEditTransactionPage(req, res) {
    try {
        let transactionId = req.params.transactionId;
        let transaction = await Transaction.findOne({ _id: transactionId });
        res.status(200).render("pages/editTransaction", { transaction: transaction, transactionId: transactionId });

    } catch (err) {
        return res.status(400).json({
            msg: 'Something went wrong!'
        });
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description update transaction details 
 * @author "Vimal Solanki"
 */
async function editTransaction(req, res) {
    try {

        let { transType, description, amount } = req.body;
        let transactionId = req.params.transactionId;
        let transaction = await Transaction.findOne({ _id : transactionId });
        let accountId = transaction.account;
        let account = await Account.findOne({ _id: accountId });
        let members = account.members;
        let balance = account.balance;


        if (transaction.type == "income") {
            balance -= transaction.amount;
            balance += amount;
        } else {
            balance += transaction.amount;
            balance -= amount;
        }

        if (balance < 0) {
            let transactions = await Transaction.find({ account: accountId });
            return res.render("pages/transaction", { transaction: transactions, balance: account.balance, accountId, members: account.members, account: account, msg: "Low balance!!" });

        } else {
            let updateAccount = await Account.updateOne({ _id: accountId }, { $set: { balance } });
            let transaction = await Transaction.findOneAndUpdate({ _id: transactionId }, { $set: { type: transType.toLowerCase(), description: description, amount: amount } }, { new: true });
            let transactions = await Transaction.find({ account : accountId });
            return res.status(200).render("pages/transaction", { balance, transaction: transactions, accountId, members, account: account, msg: "success" });
        }
        
    } catch (err) {
        console.log("err in edit account : ", err);
        return res.status(400).json({
            msg: 'Something went wrong in upudate account!'
        });
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description delete transaction
 * @author "Vimal Solanki"
 */
async function deleteTransaction(req, res) {
    try {
        let transactionId = req.params.transactionId;
        console.log("transaction ID : ", transactionId);
        let transaction = await Transaction.findOne({ _id : transactionId });
        let account = await Account.findOne({ _id : transaction.account });
        let accountId = account._id;
        let balance = account.balance;
        if (transaction.type == "income") {
            balance -= transaction.amount;
        } else {
            balance += transaction.amount;
        }

        if (balance < 0) {
            let transactions = await Transaction.find({ account : accountId });
            return res.render("pages/transaction", { transaction: transactions, balance: account.balance, accountId, members: account.members, account: account, msg: "Low balance!!" });
        } else {
            let deleteTransaction = await Transaction.findOneAndDelete({ _id: transactionId });
            let accontUpdate = await Account.findOneAndUpdate({_id: accountId},{$set :{balance}});
            return res.redirect(`/transaction/id/${accountId}`);
        }

        
        

    } catch (err) {
        console.log("err in delete account :: ", err);
        return res.status(400).json({
            msg: 'Something went wrong in delete account!'
        });
    }
};

module.exports = { getTransactions, getAddTransactionPage, addTransaction, getEditTransactionPage, editTransaction, deleteTransaction };