const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    // members : {
    //     type : Array,
    //     default : [ { type : mongoose.Schema.Types.ObjectId, ref : "User" } ]
    // },
    members: [{
        name: {
            type: String
        },
        email: {
            type: String,
            required: true,
            match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    }],
    isDefault: {
        type: Boolean,
        default: false
    }
});

const Account = mongoose.model("account", accountSchema);

module.exports = Account;