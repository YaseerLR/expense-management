const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const userRoutes = require('./routes/user');
const accountRoutes = require("./routes/account");
const transactionRoutes = require("./routes/transaction");
const cookieParser = require("cookie-parser");

// const mongoURI = "mongodb://vimals:yYZdA5S7aXW4dCczcjUyTnZxXfQREBkQ@15.206.7.200:28017/vimals?authSource=admin&ssl=false";
const mongoURI = "mongodb://localhost:27017/Expense_Manager";

const db = mongoose.connect(mongoURI, { useNewUrlParser: true })
.then(() => {
    console.log("connected ...");
}).catch(err => {
    console.log("err in database :: ", err);
});

    
    
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/user', userRoutes);
app.use('/account', accountRoutes);
app.use('/transaction', transactionRoutes);
app.use("/", async function(req, res) {
    try {
        res.status(200).render("pages/web")
    } catch (err) {
        return res.status(400).json({
            msg : 'Something went wrong!'
        });
    }
});

    
    
app.listen(port, () => {
    console.log('Listenint to the port :', port);
});