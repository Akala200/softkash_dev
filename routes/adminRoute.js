const router = require('express').Router();
const adminController = require('../controllers/adminController');
const {auth} = require('../middlewares/adminMiddleware')

router.post("/admin/login", adminController.postLogin);
router.post("/account/create", adminController.postAdmin);
router.post("/admin/change/password", auth, adminController.changePassword);
router.post("/create/loan",  auth, adminController.postLoan);
router.put("/edit/loan",  auth, adminController.putLoan);



//postLoan
module.exports = router;