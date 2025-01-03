const catchAsync = require('../Utils/catchAsync');
const Users=require('../Models/userModel');
const Tour = require('../Models/tourModel');
const mongoose = require('mongoose');

var ObjectId = require('mongodb').ObjectId;

const getOverview=catchAsync(async (req,res)=>{
  //Get All Tour Data
  const tours = await Tour.find();
  //Render Webpage

  //Render Webpage with Tour Data

  //megkeresi a base nevu pug templatet
  res.status(200).render('overview',{
    title:'All Tours',
    tours
  });

});

const getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.id).populate({
    path: 'reviews',
  });

  if(!tour){
    return next(new AppError('There is no tour with that name.',404));
  }

  const guideIds = tour.guides;

  console.log('Guide IDs:', guideIds);

  const tourGuides=await Users.find({
  _id: { $in: guideIds },
});

  // Rendereljük a 'tourDetail' Pug template-et
  res.status(200)
    .set(
      'Content-Security-Policy',
      'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com')
    .render('tourDetail', {
    title: `${tour.name} Tour`,
    tour,
    tourGuides,
  });
});

const getAccountDetails=(req,res)=>{
  console.log(req.user);
  res.status(200).render('account',{
    title:'Account Details',
    user:req.user
  });

}

const loginUserForm=(req,res)=>{
  res.status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('loginUser', {
      title: `Log into your account`
    });
}


module.exports={getOverview,getTour,loginUserForm,getAccountDetails}