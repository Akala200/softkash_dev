const User = require('../models/User');
const Token = require('../models/Token');
const UserDetails = require('../models/UserDetails');


const {makeToken} = require('../helpers');
const generateUniqueId = require('generate-unique-id');

exports.getUser = async (phone) => {
    let user = await User.findOne(phone);
    if(!user) {
        return false;
    }
    return user;
}


exports.getUserByToken = async (token) => {
    console.log(token);
    let user = await User.findOne({token: token}).catch((err) => {
        console.log(err)
        return err
    });

    return user;
}

exports.getUserId = async (id) => {
    let user = await User.findById(id).catch((err) => {
        console.log(err);
        return false;
    })
    return user;
}


exports.createUser = async ({...params}) => {
    let user = new User({...params});

    try {
        user = await user.save();
        return user
    }
    catch(error) {
        console.log(error);
        throw error;
    }
    // return user;
}

exports.storeToken = async( phone) => {
    let user = await User.findOne({ phone});
    console.log(user)
    if(!user) {
        return false;
    }
    const token = generateUniqueId({
        length: 6,
        useLetters: false
      });
  
    user.token = token;
    user.change_set = true;
    user.save();
    return user;
}

exports.verify = async(code) => {
   const newToken = ''
    let userData ={
        token: newToken,
        verified: true,
        verified_at: Date.now()
    }

    let user = await User.findOneAndUpdate({ token: code }, userData, { new: true }).catch((err) => {
        return err
    })

    return user;
    
}

exports.updatePassword = async(password, id) => {
    let user = await User.findById(id);
    if(!user) {
        return false;
    }
    user.password = password;
    user.token = ''
    user.change_set = false
    user.save();

    return user;
}



exports.detail = async({...params}) => {
    let userDetail = new UserDetails({...params});

    try {
        userDetail = await userDetail.save();
        return userDetail
    }
    catch(error) {
        console.log(error);
        throw error;
    } 
}
