const User = require('../models/User');

exports.getUser = async ({...params}) => {
    let user = await User.findOne({...params});
    if(!user) {
        return false;
    }
    return user;
}

exports.createUser = async ({...params}) => {
    let user = new User({...params});
    try {
        user = await user.save();
        return user;
    }
    catch(error) {
        console.log(error);
        throw error;
    }

    // return user;
}

exports.storeToken = async(token, email) => {
    let user = await User.findOne({ email});
    if(!user) {
        return false;
    }
    user.token = token;
    user.save();

    return user;
}

exports.updatePassword = async(password, id) => {
    let user = await User.findById(id);
    if(!user) {
        return false;
    }
    user.password = password;
    user.save();

    return user;
}