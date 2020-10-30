const router = require('express').Router();
const AuthController = require('../controllers/authController');

router.post("/login", AuthController.postLogin);
router.post("/reset", AuthController.sendToken);
router.post("/change/password", AuthController.resetPassword);
router.post("/resend", AuthController.resend);



module.exports = router;