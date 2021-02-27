const router = require('express').Router();
const UserController = require('../controllers/userController');


router.get('/', UserController.getUser);
router.post("/register/vendor", UserController.postUser);
router.post("/verify", UserController.VerifyUser);



module.exports = router;