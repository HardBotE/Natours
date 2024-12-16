const fs = require('fs');

//const tours= JSON.parse(fs.readFileSync(`{__directory}/../dev-data/data/tours-simple.json`));
const Tour = require('./../Models/tourModel.js');
const querystring = require('node:querystring');
const { APIFeatures } = require('../Utils/APIFeatures');
const e = require('express');
const catchAsync=require('../Utils/catchAsync');

const { deleteOne, createOne, updateOne, getOne, getAll } = require('./handlerFactory');
const AppError = require('../Utils/appError');

const getAllTours = getAll(Tour);

const getTour = getOne(Tour);

const createTour =createOne(Tour);

const updateTour = updateOne(Tour);

const deleteTour = deleteOne(Tour);

const topFiveTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getStats = catchAsync(async (req, res,next) => {

    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: '$difficulty',
          numberOfTours: { $sum: 1 },
          numberOfRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: {
          price: -1
        }
      },
      {
        $match: { _id: { $ne: 'easy' } }
      }
    ]);
    res.status(200).json({
      message: 'Successfully made the statistics!',
      data: {
        stats
      }
    });

});

const getMonthlyPlan = catchAsync(async (req, res,next) => {

    const year = req.params.year;
    const monthlyPlan = await Tour.aggregate([
      {
        $unwind:
          '$startDates'
      },
      {
        $match: {
          startDates:
            { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numberOfTours: { $sum: 1 },
          tourNames: { $push: '$name' }
        }
      },
      { $sort: { numberOfTours: -1 } },
      { $addFields: { month: '$_id' } },
      {
        $project: {
          _id: 0
        }
      },
      {
        $limit:12
      }
    ]);

    res.status(200).json({
      message: 'Successful data aggregation',
      data: {
        monthlyPlan
      }
    });

});

const getToursWithin=catchAsync(async (req,res,next)=>{

  const {distance,latlng,unit}=req.params;
  const [lat,lng]=latlng.split(',');

  const radius=unit==='mi'? distance / 3963.2 : distance / 6378.1

  if(!lat||!lng)
  {
    next(new AppError('Please Provide longitude or latitude in the format lat,lng!!',400));
  }

  console.log(distance,lat,lng,unit);

  const tours=await Tour.find({startLocation: { $geoWithin: {$centerSphere:[[lng,lat],radius ]} }})

  res.status(200).json({
    status:'success',
    data:{
      tours
    }
  });

});

const getDistances=catchAsync(async (req,res,next)=>{

  const {latlng,unit}=req.params;
  const [lat,lng]=latlng.split(',');

  if(!lat||!lng)
  {
    return next(new AppError('Please Provide longitude or latitude in the format lat,lng!!',400));
  }
  const multiplier = unit === 'mi'? 0.000621371 : 0.001

  const distances=await Tour.aggregate([{
    $geoNear:{
      //the distance will be calculated from this point
      near:{
        type:'Point',
        //longitude-latitued
        coordinates:[lng*1,lat*1]
      },
      distanceField:'distance',
      distanceMultiplier:multiplier,
      spherical:true
    }
  },
    {
      $project:{
        distance:1,
        name:1,
      }
    }
  ]);

  res.status(200).json({
    status:'success',
    data:{
      distances
    }
  });

});

module.exports = {
  getAllTours,
  updateTour,
  deleteTour,
  createTour,
  getTour,
  topFiveTours,
  getStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances
};
