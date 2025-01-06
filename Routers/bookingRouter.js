const express = require('express');

const { getCheckOutSession, getAllBooking, createBooking, getBooking, deleteBooking, updateBooking } = require('../Controllers/bookingController');
const { loggedIn, authz } = require('../Controllers/authController');

const bookingRouter= express.Router();

bookingRouter.get('/checkout-session/:tourID',loggedIn,getCheckOutSession);


bookingRouter.use(authz('admin','lead-guide'));

bookingRouter.route('/')
  .get(getAllBooking)
  .post(createBooking);

bookingRouter.route(':/id')
  .get(getBooking)
  .patch(updateBooking)
  .delete(deleteBooking);

module.exports=bookingRouter;