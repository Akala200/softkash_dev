const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    middle_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },      
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: false,
        unique: true
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
