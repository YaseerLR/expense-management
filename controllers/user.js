const User = require("../models/user");
const Account = require("../models/account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

let transporter = nodemailer.createTransport(smtpTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "adc6baef1e634b",
        pass: "d2fc1cfbf21728"
    }
}));




/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description get signup page
 * @author "Vimal Solanki"
 */
async function getSignupPage(req, res) {
    try {
        return res.render('pages/signUp');

    } catch (err) {
        return res.status(400).json({
            msg : 'Something went wrong!'
        });
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description get login page
 * @author "Vimal Solanki"
 */
async function getLoginPage (req, res) {
    try {
        return res.render('pages/login', { result : {message : "Enter Your Login Detail"}});
        
    } catch (err) {
        console.log("error : ", err);
        res.status(400).json({
            msg: "error ....",
            error: err
        })
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description post request on signup
 * @author "Vimal Solanki"
 */
async function userSignUp(req, res) {
    try {
        let { name, email, password } = req.body;
        let user = await User.findOne({ email : email });

        if(user) {
            return res.status(409).render({ result : { message : "User already exists!", user : user } });

        } else {
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    return res.status(400).json({
                        msg : "Unable to hash password!",
                        error : err
                    });

                } else {
                    let newUser = new User({
                        name : name,
                        email : email,
                        password : hash
                    });
                    await newUser.save();

                    let newAccount = new Account({
                        userId : newUser._id,
                        name : name + " Default Account",
                        members : [{ userId : newUser._id, name : name, email : email, isAdmin : true }],
                        isDefault : true
                    });
                    await newAccount.save();


                    // sending welcome mail
                    let mailOptions = {
                        from : "adc6baef1e634b",
                        to : email,
                        subject : "welcome mail",
                        text : "Hellow dear, welcome to the Expense Management."
                    };

                    transporter.sendMail(mailOptions, async function(err, info) {
                        if (err) {
                            console.log("err into send mail : ", err);
                        } else {
                            await console.log("Email sent successfully. :: <><> :: ", info.response);
                        }
                    });


                    return res.status(200).render("pages/login.ejs", { result : { message : "User created successfully..."}});

                }

            });

        }
        
    } catch(err) {
        console.log("error in signup user : ", err);
        res.status(400).json({
            error : err
        });

    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description post request on login page
 * @author "Vimal Solanki"
 */
async function userLogin(req, res) {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email : email });

        if (!user) {
            return res.status(401).json({
                msg : "User not found!"
            });

        } 

        bcrypt.compare(password, user.password, async (err, result) => {
            if (err) {
                return res.status(401).json({
                    msg : "Authencation failed!"
                });
            } 
            if (result) {
                const token = await jwt.sign(
                    {
                        email : email,
                        userId : user._id
                    },
                    "secretKey",
                    {
                        expiresIn : "20h"
                    }
                );

                console.log("token :: ", token);
                res.cookie("jwt", token, {
                    expires : new Date(Date.now()+ 3000000000),
                    httponly: true
                });

                let accounts = await Account.find({ userId : user._id });

                let balance = 0;
                for (let i = 0; i < accounts.length; i++ ) {
                    balance += accounts[i].balance;
                }

                return res.status(200).render("pages/allAccount", { account : accounts, balance : balance, msg : "success" });
            }

            return res.status(401).json({
                msg : "Authencation failed!"
            });

        })

    } catch(err) {
        console.log("err in login : ", err);
        res.status(400).json({
            msg : "Unable to login, something went wrong!",
            error : err
        });
    }

};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description logout
 * @author "Vimal Solanki"
 */
async function userLogout(req, res) {
    try {
        res.clearCookie("jwt");
        res.render("pages/login", { result : { message : "you are logged out!" }});

    } catch (err) {
        return res.status(400).json({
            msg : 'Something went wrong!'
        });
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description post request for delete user
 * @author "Vimal Solanki"
 */
async function userDelete(req, res) {
    try {
        console.log();
        let deleteUser = await User.remove({ _id : req.params.userId });
        return res.status(200).json({
            msg : "User deleted successfully..."
        });

    } catch(err) {
        res.status(400).json({
            msg : "Can't delete user!!",
            error : err
        });
    }
    
};


module.exports = { getSignupPage, getLoginPage, getLoginPage, userLogout, userSignUp, userLogin, userDelete };