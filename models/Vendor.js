const mongoose = require('mongoose');

const {Schema} = mongoose;




const VendorSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    businessName: {
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
    businessAddress: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    number: {
        type: String,
        required: false,
        unique: true,
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

VendorSchema.post('save', (error, doc, next) => {
    if (error.email === 'MongoError' && error.code === 11000) {
        next(new Error('Vendor already exists'));
      } else {
        next(error);
      }
})

module.exports = mongoose.model('Vendor', VendorSchema);
