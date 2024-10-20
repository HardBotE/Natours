const fs = require('fs');

//const tours= JSON.parse(fs.readFileSync(`{__directory}/../dev-data/data/tours-simple.json`));
const Tour = require('./../Models/tourModel.js');
const querystring = require('node:querystring');
const { APIFeatures } = require('../Utils/APIFeatures');
const e = require('express');
const catchAsync=require('../Utils/catchAsync');
const AppError = require('../Utils/appError');


// Get all tours
const getAllTours = catchAsync(async (req, res,next) => {
    //Waiting for query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limiting()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      items: tours.length,
      data: {
        tours
      }
    });
});

// Get a specific tour by ID

const getTour = catchAsync(async (req, res,next) => {

    const tour = await Tour.findById(req.params.id);

    if(!tour)
    {
      return next(new AppError('No tour found with that ID',404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
});



createTour =catchAsync( async (req, res,next) => {
  console.log(req.body);

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  }
);

// Create a new tour
const updateTour = catchAsync(async (req, res,next) => {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if(!tour)
    {
      return next(new AppError('No tour found with that ID',404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });

});


// Delete a tour
const deleteTour = catchAsync(async (req, res,next) => {

    const tour =await Tour.findByIdAndDelete(req.params.id);
    if(!tour) {
      return next(new AppError('No tour found with that ID'),404);
    }
    res.status(200).json({
      status: 'successfully deleted'
    });

});
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
