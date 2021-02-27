const User = require('../models/User');
const Vendor = require('../models/Vendor');

const Admin = require('../models/Admin');
const Loan = require('../models/Loan');

const Wallet = require('../models/wallet');
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

exports.getUserPhone = async (phone) => {
    let user = await User.findOne({phone: phone}).catch((err) => {
        console.log(err);
        return false;
    });
    return user;
}

exports.getUserAddDetails = async (id) => {
    let user = await UserDetails.findOne({user: id}).catch((err) => {
        console.log(err);
        return false;
    });
    return user;
}


exports.getLoan = async () => {
    let type = 'Personal';
    let loan = await Loan.find({type: type}).catch((err) => {
        console.log(err);
        return false;
    });
    return loan;
}

exports.getLoanCooperate = async () => {
    let type = 'Cooperate';
    let loan = await Loan.find({type: type}).catch((err) => {
        console.log(err);
        return false;
    });
    return loan;
}



exports.getUserByToken = async (token) => {
    let user = await User.findOne({token: token}).catch((err) => {
        console.log(err)
        return err
    });

    return user;
}

exports.getUserWallet = async (id) => {
    let wallet = await Wallet.findOne({user: id}).catch((err) => {
        console.log(err)
        return err
    });

    return wallet;
}


exports.getUserId = async (id) => {
    let user = await User.findById(id).catch((err) => {
        console.log(err);
        return false;
    })
    return user;
}

exports.getUserReferral = async (referral_id) => {
    let user = await User.findOne({referral_id: referral_id}).catch((err) => {
        console.log(err);
        return false;
    });
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

exports.createVendor = async ({...params}) => {
    let vendor = new Vendor({...params});

    try {
        vendor = await vendor.save();
        return vendor
    }
    catch(error) {
        console.log(error);
        throw error;
    }
    // return user;
}

exports.createWallet = async ({...params}) => {
    let wallet = new Wallet({...params});

    try {
        wallet = await wallet.save();
        return wallet
    }
    catch(error) {
        console.log(error);
        throw error;
    }
    // return user;
}

exports.createAdmin = async ({...params}) => {
    let admin  = new Admin({...params});

    try {
        admin = await admin.save();
        return admin
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
