const Admin = require('../models/Admin');
const Loan = require('../models/Loan');

const Token = require('../models/Token');
const UserDetails = require('../models/UserDetails');


const {makeToken} = require('../helpers');
const generateUniqueId = require('generate-unique-id');

exports.getAdmin = async (email) => {

    let user = await Admin.findOne({email: email});
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

exports.getUserReferral = async (referral_id) => {
    let user = await User.findOne({referral_id: referral_id}).catch((err) => {
        console.log(err);
        return false;
    });
    return user;
}




exports.createAdmin = async ({...params}) => {
    let admin  = new Admin({...params});

    try {
        admin = await admin.save();
        return admin
    }
    catch(error) {
        throw error;
    }
    // return user;
}

exports.createLoan = async ({...params}) => {
    let loan  = new Loan({...params});

    try {
        loan = await loan.save();
        return loan
    }
    catch(error) {
        console.log(error);
        throw error;
    }
    // return user;
}


exports.editLoan = async ( name, type, amount, interrest_rate, repayment_duration, id) => {
    let loanData  = {
        name, type, amount, interrest_rate, repayment_duration
    }

    let loan = await Loan.findByIdAndUpdate(id, loanData, { new: true }).catch((err) => {
        return err
    });
    console.log(loan);

    return loan;
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

exports.changePassword = async(email, hashedPassword) => {
    let userData ={
        password: hashedPassword,
    }

    let user = await Admin.findOneAndUpdate({ email: email }, userData, { new: true }).catch((err) => {
        return err
    });

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
