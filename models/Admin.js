const mongoose = require('mongoose');

const {Schema} = mongoose;




const adminSchema = new Schema({
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
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true
    }
},
{ timestamps: true });

adminSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('admin already exists'));
      } else {
        next(error);
      }
})

module.exports = mongoose.model('admin', adminSchema);
