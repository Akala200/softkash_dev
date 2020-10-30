const mongoose = require('mongoose');

const {Schema} = mongoose;

const WalletSchema = new Schema({
    user: {
        type: String,
        unique: true,
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },

    phone: {
        type: String,
        required: true
    },
    Number_of_credit: {
        type: Number,
        required: true,
        default: 0
    },
    Number_of_debit: {
        type: Number,
        required: true,
        default: 0
    },
},

{ timestamps: true });


module.exports = mongoose.model('Wallet', WalletSchema);
