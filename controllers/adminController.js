const jwt = require('jsonwebtoken');
const router = require('../routes/userRoute');
const adminRepository = require('../repository/adminRepository')
const {successResponse, errorResponse, notFoundResponse} = require('../helpers')
const bcrypt = require('bcryptjs')
const Mail = require('../mails');
const {makeHash} = require('../helpers');
const {makeToken} = require('../helpers');

const generateUniqueId = require('generate-unique-id');



exports.postAdmin = async(req, res, next) => {
    let {first_name, middle_name, last_name, email, department, role } = req.body;
    // process.exit();

    const password = generateUniqueId({
        length: 10,
        useLetters: true
      });
      console.log(password);
  
        const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt).catch((err) => {
       return err
     })

   
   try{
     const admin = await adminRepository.createAdmin({
        first_name, middle_name, last_name, email, department, role, password:hashedPassword
     });

   // Mail.sendVerifyEmail(email, token);
      return res.status(200).json({
        status: true,
        message: 'Admin user hass been created successful. Your password has been sent to the user mail',
      });
   }
   catch(error) {
       console.log('an error occurred');
       return errorResponse(res, error.message, {phone, password})
   }
}


exports.postLoan = async(req, res, next) => {
    let {name, type, amount, interrest_rate, repayment_duration, interval } = req.body;
    // process.exit();

   
   try{
     const loan = await adminRepository.createLoan({
        name, type, amount, interrest_rate, repayment_duration, interval
     });

   // Mail.sendVerifyEmail(email, token);
      return res.status(200).json({
        status: true,
        message: 'Loan has been created successful.',
        loan
      });
   }
   catch(error) {
       console.log('an error occurred');
       return errorResponse(res, error.message)
   }
}



exports.putLoan = async(req, res, next) => {
    let {  name, type, amount, interrest_rate, repayment_duration, interval } = req.body;
    // process.exit();
    let { id } = req.query;

     
    try{
        const loan = await adminRepository.editLoan(
           name, type, amount, interrest_rate, repayment_duration, id, interval
        );

        console.log(loan);
   
      // Mail.sendVerifyEmail(email, token);
         return res.status(200).json({
           status: true,
           message: 'Loan has been successfully edited',
           loan
         });
      }
      catch(error) {
          console.log('an error occurred');
          return errorResponse(res, error.message)
      }
   }
   

exports.changePassword = async (req, res) => {
    
    let { password} = req.body;
    let {email} = req.query
   console.log( req.user);

    if(!email) {
        return errorResponse(res, 'User email is required', {});
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt).catch((err) => {
      return err
    })

    let user = await adminRepository.changePassword(email, hashedPassword);
    if (!user) {
        return errorResponse(res, 'User does not exist');
    }

  //  Mail.sendPasswordRest(user.token, user.email);
    return successResponse(res, 'Password has been changed successfully');
    
}


exports.postLogin = async (req, res) => {
    let {email, password} = req.body
    let user = await adminRepository.getAdmin(email);
    if(!user) {
        return errorResponse(res, 'email or password is wrong',
        {email, password})
    }
    let validPass = await bcrypt.compare(password, user.password);
    
    if(!validPass) {
        return errorResponse(res, 'email or password is wrong',
        {email, password})
    }

    // Generate token
    const token = jwt.sign({ _id: user._id, 
        email: user.email,
        role: user.role }, 
        process.env.JWT_TOKEN_SECRET_ADMIN, { expiresIn: '2h' });

        // console.log(token);
        // Implement a login count later
    res.header('auth-token', token);
    return successResponse(res, 'Login Successful', 
    {'auth-token': token, user}
    )
}
