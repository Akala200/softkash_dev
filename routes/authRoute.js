const router = require('express').Router();
const AuthController = require('../controllers/authController');

router.post("/login", AuthController.postLogin);
router.post("/reset", AuthController.sendToken);
router.post("/token/:token", AuthController.resetPassword);


module.exports = router;