const {successResponse, errorResponse, notFoundResponse} = require('../helpers');
const bcrypt = require('bcryptjs');
const UserRepository = require('../repository/userRepository');
const Mail = require('../mails');
const {makeHash} = require('../helpers');
const {makeToken} = require('../helpers');

const generateUniqueId = require('generate-unique-id');
const jwt = require('jsonwebtoken');

exports.getUser = async(req, res, next) => {
    return successResponse(
        res, 'success', 'yes it works'
    )
}

exports.postUser = async(req, res, next) => {
    let {phone, password, country_code} = req.body;
    // process.exit();

    if(!phone || phone.length < 11 || !password ) {
      return res.status(400).json({
        status: false,
        message: 'Phone number or password required',
      });
    }

    const token = generateUniqueId({
      length: 6,
      useLetters: false
    });

    const referral_id = generateUniqueId({
      length: 12,
      useLetters: true
    });

    let modifiedPhone = country_code + phone; 

      const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt).catch((err) => {
     return err
   })
   
   try{
     const user = await UserRepository.createUser({
         phone,
         password: hashedPassword,
         country_code: country_code,
         token: token,
         referral_id: referral_id
     });

     const wallet = await UserRepository.createWallet({
      user: user._id,
      phone: modifiedPhone,
  });

   // Mail.sendVerifyEmail(email, token);
      return res.status(200).json({
        status: true,
        message: 'Registration is successfull, kindly verify your account before the token expires',
        user,
        wallet
      });
   }
   catch(error) {
       console.log('an error occurred');
       return errorResponse(res, error.message, {phone, password})
   }
}

exports.VerifyUser = async(req, res, next) => {
  let {code} = req.body;
  // process.exit();

 try{
   const user = await UserRepository.verify(code)
    // Generate token
    const token = jwt.sign({ _id: user._id, 
      country_code: user.country_code, 
      phone: user.phone }, 
      process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });

      // console.log(token);
      // Implement a login count later
  res.header('auth-token', token);
  return successResponse(res, 'Verification Is Successful', 
  {'auth-token': token, user}
  )
 }
 catch(error) {
     console.log('an error occurred');
     return errorResponse(res, error.message)
 }
}


exports.Details = async(req, res, next) => {
  let {email, address, first_name, middle_name, last_name, city, 
    country, closest_buss_stop, employed, self_employed, unemployed, employer,
    bussiness_name, dob, devices_code, gender, marital_status, lock_status, referral_id, 
  } = req.body;

  let { id } = req.query;
  let user = await UserRepository.getUserId(id);

  if(!user) {
    return errorResponse(res, 'User not found');
}

let refferalUser = await UserRepository.getUserReferral(referral_id);


//getUserReferral
 try{
  const useDetail = await UserRepository.detail({
    email, address, first_name, middle_name, last_name, city, 
    country, closest_buss_stop, employed, self_employed, unemployed, employer,
    bussiness_name, user: id, dob, devices_code, gender, marital_status, lock_status, parent_id: refferalUser._id
  });

  return successResponse(res, 'User Details added', {useDetail})
 }
 
 catch(error) {
     console.log('an error occurred');
     return errorResponse(res, error.message)
 }
}


exports.getLoan = async(req, res, next) => {
  let { id } = req.query;
  let user = await UserRepository.getUserAddDetails(id);

  if(!user) {
    return errorResponse(res, 'User not found');
}

//getUserReferral
 try{
 
if(user.kyy_level === 1) {
  
  let loan = await UserRepository.getLoan();
  
  return successResponse(res, 'Loans available', {loan});
  }
  
  if(user.kyy_level === 2){
      
  let loan = await UserRepository.getLoanCooperate();
  
  return successResponse(res, 'Loans available', {loan});
  }
 }
 
 catch(error) {
     console.log('an error occurred');
     return errorResponse(res, error.message)
 }
}



exports.getAllUserDetails = async(req, res, next) => {
  let { id } = req.query;
  let user = await UserRepository.getUserId(id);

  if(!user) {
    return errorResponse(res, 'User not found');
}

//getUserReferral
 try{
 
  
  let wallet = await UserRepository.getUserWallet(id);
  let userdetails = await UserRepository.getUserAddDetails(id);

  
  return res.status(200).json({
    status: true,
    message: 'User detail retrieved',
    user,
    userdetails,
    wallet
  });
    
 }
 
 catch(error) {
     console.log('an error occurred');
     return errorResponse(res, error.message)
 }
}


exports.getUserBalance = async(req, res, next) => { 
  let { id } = req.query;
  let user = await UserRepository.getUserId(id);

  if(!user) {
    return errorResponse(res, 'User not found');
}

//getUserReferral
 try{  
  let wallet = await UserRepository.getUserWallet(id);
  
  return res.status(200).json({
    status: true,
    message: 'User Available Balance',
    wallet
  });
    
 }
 
 catch(error) {
     console.log('an error occurred');
     return errorResponse(res, error.message)
 }
}