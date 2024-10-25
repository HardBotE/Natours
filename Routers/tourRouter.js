const express = require('express');
const { deleteTour, getAllTours, getTour, updateTour,topFiveTours } = require('../Controllers/tourController.js') ;
const { getStats, createTour, getMonthlyPlan } = require('../Controllers/tourController');
const { loggedIn } = require('../Controllers/authController');


const toursRouter=express.Router();
console.log(toursRouter.param);

toursRouter
  .route('/top-5-tours')
  .get(topFiveTours,getAllTours);

toursRouter
  .route('/tour-stats')
  .get(getStats);

toursRouter.route('/monthly-plan/:year')
  .get(getMonthlyPlan);

toursRouter
  .route('/')
  .get(loggedIn,getAllTours)
  .post(createTour);

toursRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports=toursRouter;