const express = require('express');
const morgan = require('morgan')
const route = require('./routes')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRoute = require('./routes/userRoute');


const app = express();
app.use(morgan('dev'))
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', route);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {

    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});


app.use(globalErrorHandler);


module.exports = app