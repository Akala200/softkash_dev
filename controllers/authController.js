const jwt = require('jsonwebtoken');
const router = require('../routes/userRoute');
const UserRepository = require('../repository/userRepository')
const {successResponse, errorResponse, notFoundResponse} = require('../helpers')
const bcrypt = require('bcryptjs')
const Mail = require('../mails');
const {makeHash} = require('../helpers');


exports.postLogin = async (req, res) => {
    let {email, password} = req.body
    let user = await UserRepository.getUser({email: email});
    if(!user) {
        return errorResponse(res, 'Email or password is wrong',
        {email, password})
    }
    let validPass = await comparePassword(password, user.password);
    
    if(!validPass) {
        return errorResponse(res, 'Email or password is wrong',
        {email, password})
    }

    // Generate token
    const token = jwt.sign({ _id: user._id, 
        name: user.name, 
        email: user.email }, 
        process.env.JWT_TOKEN_SECRET, { expiresIn: '3h' });

        // console.log(token);
        // Implement a login count later
    res.header('auth-token', token);
    return successResponse(res, 'Login Successful', 
    {'auth-token': token, user}
    )
}


exports.sendToken = async (req, res) => {
    let {email} = req.body;

    if(!email) {
        return errorResponse(res, 'Email is required', {});
    }

    let token = generateToken(email);

    let user = await UserRepository.storeToken(token, email);
    if (!user) {
        return errorResponse(res, 'Email does not exist', {email});
    }

    Mail.sendPasswordRest(user.token, user.email);
    return successResponse(res, 'A reset password link was sent to your mail', {user})
    
}


exports.resetPassword = async (req, res) => {
    let token = req.params.token;
    let {password} = req.body;

    
    // process.exit();

    if(!password){ 
        return errorResponse(res, 'Password is required', {});
    }
    let user = await UserRepository.getUser({token});
    
    if(!user) {
        return errorResponse(res, 'This token is invalid')
    }
    try {
        const isTokenValid = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      let hashedPassword = await makeHash(password);
      console.log('the hashed password ', hashedPassword);
    //   process.exit();
      let storedUser = await UserRepository.updatePassword(hashedPassword, user._id);
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