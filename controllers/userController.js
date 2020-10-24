const {successResponse, errorResponse, notFoundResponse} = require('../helpers');
const bcrypt = require('bcryptjs');
const UserRepository = require('../repository/userRepository');
const Mail = require('../mails');
const {makeHash} = require('../helpers');
const generateUniqueId = require('generate-unique-id');

exports.getUser = async(req, res, next) => {
    return successResponse(
        res, 'success', 'yes it works'
    )
}

exports.postUser = async(req, res, next) => {
    let {phone, password, coutry_code} = req.body;
    // process.exit();
    let hashedPassword = await makeHash(password);
    let token = generateUniqueId({
        length: 6,
        useLetters: false
      });
   try{
     const user = await UserRepository.createUser({
         phone,
         password: hashedPassword,
         coutry_code: coutry_code
     })
     console.log('here', user)
   // Mail.sendVerifyEmail(email, token);
      return res.status(200).json({
        status: true,
        message: 'Registration is successfull',
        verification_token: token,
        user,
      });
   }
   catch(error) {
       console.log('an error occurred');
       return errorResponse(res, error.message, {email, password})
   }
}