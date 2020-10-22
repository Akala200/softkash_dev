const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    const token = req.header('auth-token');

    console.log(token);
    if(!token) return res.status(401).send('Access Denied!'); 

    try {
        const verified = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        console.log('viewing the verified ', verified);
        req.user = verified;
        next();
    } catch (err){
        res.status(400).send('Invalid Token');
    }
}