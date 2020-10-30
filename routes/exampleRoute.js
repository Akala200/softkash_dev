const router = require('express').Router();
const AuthController = require('../controllers/authController');
const {auth} = require('../middlewares/authMiddleware')
const UserController = require('../controllers/userController');


router.get("/guarded", auth, (req, res, next) => {
    return res.status(200).json("This works ");
});
router.post("/add/details", auth, UserController.Details);
router.get("/available/loans", auth, UserController.getLoan);
router.get("/get/user", auth, UserController.getAllUserDetails);
router.get("/user/balance", auth, UserController.getUserBalance);






module.exports = router;

