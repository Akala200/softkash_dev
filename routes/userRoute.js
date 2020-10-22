const router = require('express').Router();
const UserController = require('../controllers/userController');

router.get('/', UserController.getUser);
router.post("/register", UserController.postUser);


module.exports = router;