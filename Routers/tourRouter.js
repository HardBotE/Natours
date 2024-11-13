const express = require('express');
const { deleteTour, getAllTours, getTour, updateTour,topFiveTours } = require('../Controllers/tourController.js') ;
const { getStats, createTour, getMonthlyPlan } = require('../Controllers/tourController');
const { loggedIn,authz } = require('../Controllers/authController');
const { getAllReviews, createReview } = require('../Controllers/reviewController');

const reviewRouter=require('./../Routers/reviewRouter');


const toursRouter=express.Router();
console.log(toursRouter.param);


toursRouter.use('/:id?/review',reviewRouter);


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
  .get(getAllTours)
  .post(loggedIn,authz('admin','lead-guide'),createTour);

toursRouter
  .route('/:id')
  .get(getTour)
  .patch(loggedIn,authz(['admin','tour-guide-lead']),updateTour)
  .delete(loggedIn,authz(['admin','tour-guide-lead']),deleteTour);


module.exports=toursRouter;