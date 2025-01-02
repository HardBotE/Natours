const express = require('express');
const authController = require('../controllers/authController');
const { getTour,getOverview,getAccountDetails, loginUserForm } = require('../Controllers/viewController');
const { userHasToken, loggedIn } = require('../Controllers/authController');

const router = express.Router();



router.get('/me', loggedIn, getAccountDetails);

router.get('/',userHasToken,getOverview);

router.get('/tours/:id',userHasToken,getTour);

router.get('/login',userHasToken,loginUserForm);



module.exports = router;