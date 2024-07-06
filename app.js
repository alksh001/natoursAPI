const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const route = require('./routes')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRoute = require('./routes/userRoute');

const app = express();

// set security http headers
app.use(helmet());

app.use(morgan('dev'));

// setting Rate limit of incoming requests on the same api
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS- prevent malicious code from html site
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficuty', 'price']
}));

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requsetTime = new Date().toISOString();

    next();
});

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