const Review = require('../Models/reviewModel');
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handlerFactory');


const setParams=(req,res,next)=>{
  if(!req.body.tourRef) req.body.tourRef=req.params.id;
  if(!req.body.userRef) req.body.userRef=req.user.id;
  next();
};

const createReview =createOne(Review);

const getAllReviews = getAll(Review);

const getReview=getOne(Review);

const deleteReview=deleteOne(Review);

const updateReview=updateOne(Review);

module.exports={createReview,getAllReviews,deleteReview,updateReview,setParams,getReview};