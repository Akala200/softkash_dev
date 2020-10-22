const router = require('express').Router();
const AuthController = require('../controllers/authController');
const {auth} = require('../middlewares/authMiddleware')

router.get("/guarded", auth, (req, res, next) => {
    return res.status(200).json("This works ");
});


module.exports = router;