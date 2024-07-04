const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}.`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid Token. Please login again', 401)

const handleJWTExpireError = () => new AppError('Token Exired. Please login again', 401)

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err.name,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {

    if (err.isOperational) {
        console.log(err);
        
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.log(err);
        res.status(400).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        // console.log("err1",err.name);
        sendErrorDev(err, res);
        
    } else if (process.env.NODE_ENV === 'production') {

        let error = { ...err };
        error.message = err.message;
        error.name = err.name;
        error.isOperational = err.isOperational;
        
        if (error.name === 'CastError')  error = handleCastErrorDB(error)
        if (error.name === 'JsonWebTokenError')  error = handleJWTError()
        if (error.name === 'TokenExpiredError')  error = handleJWTExpireError()
        
        sendErrorProd(error, res);
    }

    
}