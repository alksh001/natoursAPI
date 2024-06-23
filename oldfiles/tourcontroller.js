const express = require('express');
const fs = require('fs');
const Tour = require('./models/tourModel');

// let tours = JSON.parse(fs.readFileSync(`${__dirname}/dev_data/data/tours.simple.json`))

const checkID = (req, res, next, val) => {
    console.log(`val = ${val}`);
    
    if ( Number(req.params.id) > tours.length-1) {
        return res.status(404).json({
            status: "failed",
            message: "Invalid ID"
        });
    }
    next();
}

const checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
       return res.status(404).json({
            success: "failed",
            message : "name and price are required"
        })
    }
    next();
}

const getAllTours = (req, res) => {
    // res.status(200).json({
    //     status: 'success',
    //     result: tours.length,
    //     data: {
    //         tours
    //     }
    // });
};

const getTour = (req, res) => {

    // const id = req.params.id;
    
    // if (id > tours.length) {
    //     return res.status(404).json({
    //         status: "failed",
    //         message: "Invalid ID"
    //     })
    // }
    // const id = Number(req.params.id);
    // const tour = tours.find(el => el.id === id);
    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     }
    // });
};

const deleteTour = (req, res) => {
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
}

const create = (req, res) => {
    // console.log(req.body);
    // let newId = tours[tours.length - 1].id + 1;
    // let newTour = Object.assign({ id: newId }, req.body);

    // tours.push(newTour);

    // fs.writeFile(`${__dirname}/dev_data/data/tours.simple.json`,
    //     JSON.stringify(tours),
    //     err => {
    //         res.status(201).json({
    //             status: 'success',
    //             data: {
    //                 tour: newTour
    //             }
    //         })
    //     }
    // )
};

module.exports = {create, deleteTour, getTour, getAllTours, checkBody, checkID};