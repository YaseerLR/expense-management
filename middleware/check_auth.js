const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Account = require('../models/account');

module.exports = async(req, res, next) => {
    try{
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, 'secretKey');
        const user =  await User.findOne({token : token});
        const account = await Account.find({"members.email" : user.email});
        // console.log('account :: ><>', account);
        req.userData = decoded;
        req.token = token;
        res.locals.user = user;
        res.locals.account = account;
        next();
    }catch(err){
        return res.status(400).render("pages/login",{result: {message : "Please login By Your Mail"}});
    }
};