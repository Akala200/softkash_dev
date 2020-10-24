const mongoose = require('mongoose');

const {Schema} = mongoose;


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new Schema({
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
    phone: {
        type: Number,
        unique: true,
        validate: {
            validator: function(v) {
                return /d{10}/.test(v);
            },
            message: '{VALUE} is not a valid 10 digit number!'
        }
    },
   
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false,
        unique: true
    },
    verified: {
        type: Boolean,
        required: false
    },
    verified_at: {
        type: Date,
        required: false
    } 
},
{ timestamps: true });

userSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Email already exists'));
      } else {
        next(error);
      }
})

module.exports = mongoose.model('User', userSchema);
