const mongoose = require('mongoose');

const {Schema} = mongoose;




const userSchema = new Schema({
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    country_code: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false,
        unique: true,
        expires: 500
    },
    change_set: {
        type: Boolean,
        required: false,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    referral_id: {
        type: String,
        required: false,
    },
    verified: {
        type: Boolean,
        required: false,
        default: false
    },
    verified_at: {
        type: Date,
        required: false
    } 
},
{ timestamps: true });

userSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('User already exists'));
      } else {
        next(error);
      }
})

module.exports = mongoose.model('User', userSchema);
