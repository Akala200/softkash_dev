const jwt = require('jsonwebtoken');
const router = require('../routes/userRoute');
const UserRepository = require('../repository/userRepository')
const {successResponse, errorResponse, notFoundResponse} = require('../helpers')
const bcrypt = require('bcryptjs')
const Mail = require('../mails');
const {makeHash} = require('../helpers');
const {makeToken} = require('../helpers');



exports.postLogin = async (req, res) => {
    let {phone, password, country_code} = req.body
    let user = await UserRepository.getUser({phone: phone});
    if(!user) {
        return errorResponse(res, 'Phone number or password is wrong',
        {phone, password})
    }
    let validPass = await comparePassword(password, user.password);
    
    if(!validPass) {
        return errorResponse(res, 'Phone number or password is wrong',
        {phone, password})
    }

    // Generate token
    const token = jwt.sign({ _id: user._id, 
        country_code: user.country_code, 
        phone: user.phone }, 
        process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });

        // console.log(token);
        // Implement a login count later
    res.header('auth-token', token);
    return successResponse(res, 'Login Successful', 
    {'auth-token': token, user}
    )
}


exports.sendToken = async (req, res) => {
    let {phone, country_code} = req.body;

    if(!phone) {
        return errorResponse(res, 'Phone number is required', {});
    }

    let code = parseInt(country_code);
    let phoneNumber = code + phone;


    let user = await UserRepository.storeToken(phone);
    if (!user) {
        return errorResponse(res, 'Phone number does not exist', {phoneNumber});
    }

  //  Mail.sendPasswordRest(user.token, user.email);
    return successResponse(res, 'A reset password link was sent to your mail', {user})
    
}

exports.resend = async (req, res) => {
    let { phone } = req.query;

    let user = await UserRepository.getUserPhone(phone);
    if (!user) {
        return errorResponse(res, 'User does not exist');
    }
    let token = user.token;

  //  Mail.sendPasswordRest(user.token, user.email);
    return successResponse(res, 'Code has been resent', {token})
    
}


exports.resetPassword = async (req, res) => {
    let token = req.query.token;
    let {password} = req.body;

    
    // process.exit();

    if(!password){ 
        return errorResponse(res, 'Password is required', {});
    }
    let user = await UserRepository.getUserByToken(token);
    
    if(!user) {
        return errorResponse(res, 'This token is invalid')
    }

    try {
      let hashedPassword = await makeHash(password);
      console.log('the hashed password ', hashedPassword);
    //   process.exit();
      let storedUser = await UserRepository.updatePassword(hashedPassword, user._id);
      console.log(storedUser);

      return successResponse(res, 'Password Updated', {storedUser});

    } catch (err){
        res.status(400).send('Invalid Token');
    }
}

const comparePassword = async (password, hashedPassword) => {
    const validPass = await bcrypt.compare(password, hashedPassword);
    return validPass
}

const generateToken =  (email) => {
    let token = jwt.sign({email}, process.env.JWT_TOKEN_SECRET, { expiresIn: '3h' });
    return token
}