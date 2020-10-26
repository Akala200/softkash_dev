const mongoose = require('mongoose');

const {Schema} = mongoose;


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const TokenSchema = new Schema({
    phone: {
        type: Number,
        required: true
    },
    country_code: {
        type: String,
        required: true
    },
    token:  {
        type : String,
        unique : true,
    },
  
    createdAt: {
        type: Date, required: true, default: Date.now, expires: 500
    }
},

);


module.exports = mongoose.model('Token', TokenSchema);
