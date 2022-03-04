const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId, ref : "User", required : true
    },
    name : {
        type : String,
        required : true
    },
    balance : {
        type : Number,
        default : 0
    },
    // members : {
    //     type : Array,
    //     default : [ { type : mongoose.Schema.Types.ObjectId, ref : "User" } ]
    // },
    members : {
        type : Array,
        default : []
    },
    isDefault : {
        type : Boolean,
        default : false
    }
});

const Account = mongoose.model("account", accountSchema);

module.exports = Account;