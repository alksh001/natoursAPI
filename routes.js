const express = require("express");
const tourController = require('./tourController');
const authController = require('./controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID)

router.route('/top-5-cheap').get(tourController.aliasTopTour, tourController.getAllTours);

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.create);

router.route('/tour-stats').get(tourController.tourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/:id')
    .get(tourController.getTour)
    .put(tourController.updateTour)
    .delete( authController.protect, authController.restrictTo('admin','lead-guide'),tourController.deleteTour);

module.exports = router;