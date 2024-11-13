const express = require('express');
const { loggedIn, authz } = require('../Controllers/authController');
const { getAllReviews, createReview, updateReview, deleteReview, setParams, getReview } = require('../Controllers/reviewController');

const reviewRouter=express.Router({mergeParams:true});

reviewRouter.use(loggedIn);
reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(authz('user'),setParams,createReview);

reviewRouter
  .route('/:id')
  .get(getReview)
  .patch(authz('user','admin'),updateReview)
  .delete(authz('user','admin'),deleteReview);

module.exports=reviewRouter;
