const mongoose = require('mongoose');

const {Schema} = mongoose;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};


const UserDetailsSchema = new Schema({
    first_name: {
        type: String,
        required: false
    },
    middle_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
        required: false
    },      
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: false,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },

    kyy_level: {
        type: Number,
        required: true,
        default: 0,
    },
    dob: {
        type: Date,
        required: true,
        trim: true,
    },
    devices_code: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum : ['Male', 'Female'],
        required: true,
    },
    marital_status: {
        type: String,
        enum : ['Single', 'Married'],
        required: true,
    },
    lock_status: {
        type: Boolean,
        default: false,
        required: false,
    },
    parent_id: {
        type: String,
        required: false,
    },
    user: {
        type: String,
        unique: true,
        required: false,
    },
    country: {
        type: String,
        required: true
    },
    closest_buss_stop: {
        type: String,
        required: false,
    },
    employed: {
        type: Boolean,
        required: false,
    },
    self_employed: {
        type: Boolean,
        required: false,
    },
    unemployed: {
        type: Boolean,
        required: false,
    },
    employer: {
        type: String,
        required: false,
    },
    
    bussiness_name: {
        type: String,
        required: true
    },
    completed_repayment_cirle: {
        type: Number,
        required: false
    },
},
{ timestamps: true });

UserDetailsSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('user already exists'));
      } else {
        next(error);
      }
})

module.exports = mongoose.model('UserDetails', UserDetailsSchema);
