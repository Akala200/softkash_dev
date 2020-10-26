const router = require('express').Router();
const AuthController = require('../controllers/authController');

router.post("/login", AuthController.postLogin);
router.post("/reset", AuthController.sendToken);
router.post("/change/password", AuthController.resetPassword);


module.exports = router;