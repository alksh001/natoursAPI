const express = require('express');
const Tour = require('./models/tourModel');

const aliasTopTour = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,duration,difficulty';
    next();
}

const getAllTours = async (req, res) => {
    try {
        // filtering 
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        console.log('query ',queryStr);
        let query = Tour.find(JSON.parse(queryStr));

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }


        // Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }
        

        // Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 1;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numOfTours = await Tour.countDocuments();
            if (skip > numOfTours) throw new Error("This page does not exist");
        }

        // Executing query
        // const tours = await query;

        const features = new APIFeatures(Tour.find(), req.query).filter();
        const tours = await features.query;

         res.status(200).json({
            status: 'success',
            result: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

const getTour =async (req, res) => {
    try {
    
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'fail',
            message: err
        });     
}
};

// const deleteTour = (req, res) => {
    // const id = Number(req.params.id);
    // tours = tours.filter(el => el.id !== id);
    // // console.log(tour, `id ${req.params.id}`);

    // tours = tour;

    // fs.writeFileSync(`${__dirname}/dev_data/data/tours.simple.json`,
    //     JSON.stringify(tours));
    // res.status(201).json({
    //     status: 'success',
    //     data: tour
    // });
// }

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

const create = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: err
        });
   }
    
};

module.exports = {create, deleteTour, getTour, getAllTours,updateTour, aliasTopTour};