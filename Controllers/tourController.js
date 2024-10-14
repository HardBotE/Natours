const fs = require('fs');

//const tours= JSON.parse(fs.readFileSync(`{__directory}/../dev-data/data/tours-simple.json`));
const Tour = require('./../Models/tourModel.js');
const querystring = require('node:querystring');
const { APIFeatures } = require('../Utils/APIFeatures');
const e = require('express');


// Get all tours
const getAllTours = async (req, res) => {

  try {

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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      error: err
    });
  }
};

// Get a specific tour by ID

const getTour = async (req, res) => {

  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      error: err
    });

  }

};

createTour = async (req, res) => {
  console.log(req.body);
  try {
    // const newTour = new Tour({})
    // newTour.save()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

// Create a new tour
const updateTour = async (req, res) => {

  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: 'Error writing to file'
    });
  }
};


// Delete a tour
const deleteTour = async (req, res) => {
  console.log(req.params.id);
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'successfully deleted'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err
    });
  }
};
const topFiveTours = (req, res, next) => {
  req.query.limit = '5',
    req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getStats = async (req, res) => {
  try {

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
  } catch (err) {
    console.log(err);
  }
};

const getMonthlyPlan = async (req, res) => {

  try {
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
  } catch (err) {
    res.status(404).json({
      message: 'Feature currently unavailable',
      error: err
    });
  }
};

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
