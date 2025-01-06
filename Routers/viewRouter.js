const express = require('express');
const authController = require('../controllers/authController');
const { getTour,getOverview,getAccountDetails, loginUserForm, getMyTours } = require('../Controllers/viewController');
const { userHasToken, loggedIn } = require('../Controllers/authController');
const bookingController = require('../Controllers/bookingController');
const router = express.Router();



router.get('/me', loggedIn, getAccountDetails);

router.get('/my-tours', loggedIn, getMyTours);

router.get('/',bookingController.createBookingCheckout,userHasToken,getOverview);

router.get('/tours/:id',userHasToken,getTour);

router.get('/login',userHasToken,loginUserForm);



module.exports = router;