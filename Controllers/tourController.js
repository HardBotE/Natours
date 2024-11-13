const fs = require('fs');

//const tours= JSON.parse(fs.readFileSync(`{__directory}/../dev-data/data/tours-simple.json`));
const Tour = require('./../Models/tourModel.js');
const querystring = require('node:querystring');
const { APIFeatures } = require('../Utils/APIFeatures');
const e = require('express');
const catchAsync=require('../Utils/catchAsync');
const AppError = require('../Utils/appError');
const log = require('eslint-plugin-react/lib/util/log');
const { deleteOne, createOne, updateOne, getOne, getAll } = require('./handlerFactory');

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

module.exports = {
  getAllTours,
  updateTour,
  deleteTour,
  createTour,
  getTour,
  topFiveTours,
  getStats,
  getMonthlyPlan
};
