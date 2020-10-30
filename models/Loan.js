const mongoose = require('mongoose');

const {Schema} = mongoose;

const LoanSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    type: {
        type: String,
        enum : ['Personal', 'Cooperate'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },

    interrest_rate: {
        type: String,
        required: true
    },
    interval: {
        type: Number,
        required: true
    },
    repayment_duration: {
        type: Number,
        required: true
    },
},

{ timestamps: true });


module.exports = mongoose.model('Loan', LoanSchema);
