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
    let {first_name, last_name,  middle_name, email, password} = req.body;
    // process.exit();
    let hashedPassword = await makeHash(password);
    let token = generateUniqueId({
        length: 6,
        useLetters: false
      });
   try{
     const user = await UserRepository.createUser({
         email,
         first_name,
         middle_name,
         last_name,
         password: hashedPassword
     })
     console.log('here', user)
    Mail.sendVerifyEmail(email, token);
      return res.status(200).json({
        status: true,
        message: 'Registration is successfull',
        user,
      });
   }
   catch(error) {
       console.log('an error occurred');
       return errorResponse(res, error.message, {email, password})
   }
}