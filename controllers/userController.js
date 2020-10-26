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

    const token = generateUniqueId({
      length: 6,
      useLetters: false
    });

      const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt).catch((err) => {
     return err
   })
   
   try{
     const user = await UserRepository.createUser({
         phone,
         password: hashedPassword,
         country_code: country_code,
         token: token
     });

   // Mail.sendVerifyEmail(email, token);
      return res.status(200).json({
        status: true,
        message: 'Registration is successfull, kindly verify your account before the token expires',
        user,
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
    bussiness_name 
  } = req.body;

  let { id } = req.query;
  console.log(id);
  let user = await UserRepository.getUserId(id);

  if(!user) {
    return errorResponse(res, 'User not found');
}

 try{
  const useDetail = await UserRepository.detail({
    email, address, first_name, middle_name, last_name, city, 
    country, closest_buss_stop, employed, self_employed, unemployed, employer,
    bussiness_name, user: id
  });

  return successResponse(res, 'User Details added', {useDetail})
 }
 
 catch(error) {
     console.log('an error occurred');
     return errorResponse(res, error.message)
 }
}