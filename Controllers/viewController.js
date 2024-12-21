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

  const guideIds = tour.guides;

  console.log('Guide IDs:', guideIds);

  const tourGuides=await Users.find({
  _id: { $in: guideIds },
});

  console.log('Tour:', tour);
  console.log('Guides:', tourGuides);

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



module.exports={getOverview,getTour}