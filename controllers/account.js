const Account = require("../models/account");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description get all accounts of user
 * @author "Vimal Solanki"
 */
async function getAllAccount(req, res) {
    try {
        console.log("getAllAccount : : req.userData :: ", req.userData);
        let accounts = await Account.find({ userId : req.userData.userId });
  
        let balance = 0;
        for (let i = 0; i < accounts.length; i++) {
            let balancePerAccount = 0;
            let transactions = await Transaction.find({ account : accounts[i]._id });

            for (let j = 0; j < transactions.length; j++ ) {
                if (transactions[j].type == "income") {
                    balancePerAccount += transactions[j].amount;
                } else if ( transactions[j].type == "expense") {
                    balancePerAccount -= transactions[j].amount;
                } else {
                    balancePerAccount -= transactions[j].amount;
                }
            }

            balance += balancePerAccount;
            await Account.updateOne({ _id : accounts[i]._id }, { $set : { balance : balancePerAccount }});

        };

        let allAccounts = await Account.find({ userId : req.userData.userId });
        res.status(200).render("pages/allAccount", { account : allAccounts, balance : balance, msg : "success" });

    } catch (err) {
        console.log("err in get accounts : ", err);
        return res.status(400).json({
            msg : 'Something went wrong!'
        });
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description render page of add account
 * @author "Vimal Solanki"
 */
 async function getAddAccountPage(req, res) {
    try {  
        res.status(200).render("pages/addAccount", { msg : "success" });

    } catch (err) {
        console.log("err in get accounts : ", err);
        return res.status(400).json({
            msg : 'Something went wrong!'
        });
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description create new account of user
 * @author "Vimal Solanki"
 */
async function createAccount(req, res) {
    try {
        let userId = mongoose.Types.ObjectId(req.userData.userId);
        
        let { name } = req.body;
        let { email } = req.userData;

        let isAvailable = await Account.findOne({ name : name });
        if (isAvailable) {
            return res.render("pages/addAccount", { msg: "Account with this name is already exists!" });
 
        }

        let user = await User.findOne({ _id : userId })

        let newAccount = new Account({
            userId : userId,
            name : name,
            members : [{ userId : userId, name : user.name, email : email, isAdmin : true }]
        });
        await newAccount.save();

        let accounts = await Account.find({ userId : userId });
        let balance = 0;
        for (let i = 0; i < accounts.length; i++ ) {
            balance += accounts[i].balance;
        }

        return res.status(200).render("pages/allAccount", { account : accounts, balance : balance, msg : "success" });

    } catch (err) {
        console.log("err in create account :: ", err);
        return res.status(400).json({
            msg : 'Something went wrong in create account!'
        });
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description update account details 
 * @author "Vimal Solanki"
 */
async function getUpdateAccountPage(req, res) {
    try {
        let accountId = req.params.id;
        let account = await Account.findOne({ _id : accountId });
        res.status(200).render("pages/updateAccount", { account : account });

    } catch (err) {
        return res.status(400).json({
            msg : 'Something went wrong!'
        });
    }
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description update account details 
 * @author "Vimal Solanki"
 */
async function updateAccount(req, res) {
    try {
        let userId = req.userData.userId;
        let { accountId, name } = req.body;
        await Account.updateOne({ _id : accountId }, { $set : { name : name }}, {new : true});
        let accounts = await Account.find({ userId : userId });

        let balance = 0;
        for (let i = 0; i < accounts.length; i++ ) {
            balance += accounts[i].balance;
        }

        return res.status(200).render("pages/allAccount", { account : accounts, balance : balance, msg : "success" });

    } catch (err) {
        console.log("err in edit account : ", err);
        return res.status(400).json({
            msg : 'Something went wrong in upudate account!'
        });
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description delete account
 * @author "Vimal Solanki"
 */
async function deleteAccount(req, res) {
    try {
        let account = await Account.find({ _id : req.params.id });

        if (account[0].isDefault === false)  {
            let deleteAccount = await Account.deleteOne({ _id : req.params.id });
            return res.redirect("/account");

        } else {
            let accounts = await Account.find({ _id : req.params.id });

            let balance = 0;
            for (let i = 0; i < accounts.length; i++ ) {
                balance += accounts[i].balance;
            }
            return res.status(200).render("pages/allAccount", { account : accounts, balance : balance, msg : "default" });

        }

    } catch (err) {
        console.log("err in delete account :: ", err);
        return res.status(400).json({
            msg : 'Something went wrong in delete account!'
        });
    }
};

/**
 * @param {*} req
 * @param {*} res
 * @description get page for add member in account
 * @author `Vimal Solanki`
 */
async function getAddMember(req, res) {
    try {
        const id = req.params.accountId;
        const account = await Account.findOne({ _id: id });
        console.log("account in getAddMember : ", account);
        res.render("pages/addMember", { account: account, msg: null });

    } catch (err) {
        return res.status(400).json({
            msg: 'Something went wrong in getting page of add member!'
        });
    }
}

/**
 * @param {*} req
 * @param {*} res
 * @description add member to account
 * @author `Vimal Solanki`
 */
async function addMember(req, res) {
    try {
        console.log("req.body :: ", req.body);
        let { email, accountId } = req.body;
        let user = await User.findOne({ email : email });
        let account = await Account.findOne({ _id : accountId });
        let transactions = await Transaction.find({ account : accountId });
        let members = account.members;

        if(user) {
            let check = false;
            for(let i = 0; i < members.length; i++) {
                if (members[i].email == email) {
                    check = true;
                    break;
                }
            }

            if (check == true) {
                return res.render("pages/transaction", { transaction: transactions, balance : account.balance, accountId, members: account.members, account: account, msg: "User already exist in this account!" });

            } else {
                let member = {
                    userId : user._id,
                    name : user.name,
                    email : user.email,
                    isAdmin : false
                };
                const addedMember = await Account.findOneAndUpdate({ _id: accountId }, { $push: { "members": member } });
                await addedMember.save();
    
                return res.redirect(`/transaction/id/${accountId}`);
            }

        } else {
            return res.render("pages/transaction", { transaction: transactions, balance : account.balance, accountId, members: account.members, account: account, msg: "user not found" });

        }


    } catch (err) {
        console.log("err in add member :: ", err);
        return res.status(400).json({
            msg: 'Something went wrong in adding member!'
        });
    }
}

/**
 * @param {*} req
 * @param {*} res
 * @description remove member from account
 * @author "Vimal Solanki"
 */
 async function deleteMember(req, res) {
    try { 

        let memberId = req.params.data;
        let memberIdObj = mongoose.Types.ObjectId(req.params.data);
        let accountId = req.query.accountId;
        let account = await Account.findOne({ _id : accountId });
        
        let isAdmin = false;
        for(let i = 0; i < account.members.length; i++) {
            // if ( account.members[i].userId.toString() == memberId && account.members[i].isAdmin == true) {
            if ( (account.members[i].userId.toString() == memberId) && (account.members[i].isAdmin == true) ) {
                isAdmin = true;
                break;
            }  

        };

        let transactions = await Transaction.find({ account : accountId });
        if ( isAdmin == true ) {
            return res.render("pages/transaction", { transaction : transactions, balance : account.balance, accountId, members : account.members, account : account, msg : "Can not remove admin!" });
            

        } else {
            const update = await Account.findOneAndUpdate({ _id : mongoose.Types.ObjectId(accountId) }, { $pull: { "members": { userId : memberIdObj } } });
            let account = await Account.findOne({ _id : accountId });

            return res.render("pages/transaction", { transaction : transactions, balance: account.balance, accountId, members : account.members, account : account, msg : "success" });
 
        }
        
    } catch (err) {
        console.log("err in delete member :: ", err);
        return res.status(400).json({
            msg: 'Something went wrong in delete member!'
        });
    }
}


module.exports = { 
    getAddAccountPage, 
    getUpdateAccountPage, 
    getAllAccount, 
    createAccount, 
    updateAccount, 
    deleteAccount, 
    getAddMember, 
    addMember, 
    deleteMember 
};