const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    account : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Account",
        required : true
    },
    type : {
        type : String,
        enum: ['Income', 'Expense', "TransferToAccount"]
    },
    discription : {
        type : String,
        default : "others"
    },
    amount : {
        type : Number,
        required : true,
        default : 0
    },
    from : {
        type : String
    },
    to : {
        type : String
    }
}, { timestamps : true });

const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction;