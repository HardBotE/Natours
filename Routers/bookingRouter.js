const express = require('express');

const { getCheckOutSession } = require('../Controllers/bookingController');
const { loggedIn } = require('../Controllers/authController');

const bookingRouter= express.Router();

bookingRouter.get('/checkout-session/:tourID',loggedIn,getCheckOutSession);

module.exports=bookingRouter;